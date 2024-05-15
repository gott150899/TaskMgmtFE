import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { gantt } from 'dhtmlx-gantt';
import moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { StatusEntity } from '../../models/global.enum';
import { TaskCreateBody, TaskUpdateBody, TaskVmV2 } from '../../models/task.model';
import { NotifyService } from '../../services/notify.service';
import { StaffService } from '../../services/staff.service';
import { TaskService } from '../../services/task.service';
declare var $: any;

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TaskComponent implements OnInit{
  @ViewChild('gantt_here', { static: true }) ganttContainer!: ElementRef;

  tasks: TaskVmV2[] = [];

  constructor(private _staffService: StaffService, private _taskService: TaskService, private _notifyService: NotifyService) {
    
  }

  async ngOnInit(){
    gantt.config.show_links = false;

    gantt['form_blocks']["multiselect"] = {
      render: function (sns: any) {
        var height = (sns.height || "23") + "px";
        var html = "<div class='gantt_cal_ltext gantt_cal_chosen gantt_cal_multiselect' style='height:" + height + ";'><select data-placeholder='...' class='chosen-select' multiple>";
        if (sns.options) {
          for (var i = 0; i < sns.options.length; i++) {
            if(sns.unassigned_value !== undefined && sns.options[i].key == sns.unassigned_value){
              continue;
            }
            html += "<option value='" + sns.options[i].key + "'>" + sns.options[i].label + "</option>";
          }
        }
        html += "</select></div>";
        return html;
      },
  
      set_value: function (node: any, value: any, ev: any, sns: any) {
        console.log('set_value', value);
        node.style.overflow = "visible";
        node.parentNode.style.overflow = "visible";
        node.style.display = "inline-block";
        var select = $(node.firstChild);
        console.log('node', node);
        console.log('select', select);
  
        if (value) {
          value = (value + "").split(",");
          select.val(value);
        }
        else {
          select.val([]);
        }
  
        select.chosen();
        if(sns.onchange){
          select.change(function(){
            // sns.onchange.call(this);
          })
        }
        select.trigger('chosen:updated');
        select.trigger("change");
      },
  
      get_value: function (node: any, ev: any) {
        var value = $(node.firstChild).val();
        return value;
      },
  
      focus: function (node: any) {
        $(node.firstChild).focus();
      }
    };

    // gantt.serverList("people", [
    //   {key: 6, label: "John"},
    //   {key: 7, label: "Mike"},
    //   {key: 8, label: "Anna"},
    //   {key: 9, label: "Bill"},
    //   {key: 10, label: "Floe"}
    // ]);

    const resp = await lastValueFrom(this._staffService.get('', StatusEntity.Active))
    // this._staffService.get().subscribe(res => {
    const _newData = resp.data.map((item) => ({
      key: item.id,
      label: item.fullName
    }));

    gantt.serverList("people", _newData);
    // })
  
  
    function findUser(id: any){
      var list = gantt.serverList("people");
      for(var i = 0; i < list.length; i++){
        if(list[i].key == id){
          return list[i];
        }
      }
      return null;
    }
  
    gantt.config.columns = [
      {name: "text", tree: true, width: 200, resize: true},
      {name: "start_date", align: "center", width: 80, resize: true},
      {name: "owner", align: "center", width: 75, label: "Owner", template: function (task: any) {
        if (task.type == gantt.config.types.project) {
          return "";
        }
  
        var result = "";
      
        var owners = task.owners;
  
        if (!owners || !owners.length) {
          return "Unassigned";
        }
  
        if(owners.length == 1){
          return findUser(owners[0]) ? findUser(owners[0]).label : '';
        }
  
        owners.forEach(function(ownerId: any) {
          var owner = findUser(ownerId);
          if (!owner)
            return;
          result += "<div class='owner-label' title='" + owner.label + "'>" + owner.label.substr(0, 1) + "</div>";
  
        });
  
        return result;
        }, resize: true
      },
      {name: "duration", width: 60, align: "center"},
      {name: "add", width: 44}
    ];
  
    
    gantt.locale.labels['section_owner'] = "Owner";
    gantt.config.lightbox.sections = [
      {name: "description", height: 38, map_to: "text", type: "textarea", focus: true},
      {name:"owner",height:60, type:"multiselect", options:gantt.serverList("people"), map_to:"owners"},
      {name: "time", type: "duration", map_to: "auto"}
    ];
  
    gantt.config.order_branch = true;
    gantt.config.open_tree_initially = true;
  
    gantt.init(this.ganttContainer.nativeElement);

    gantt.init(this.ganttContainer.nativeElement);

    if(!(gantt as any).$_initOnce){
        (gantt as any).$_initOnce = true;

        const dp = gantt.createDataProcessor({
          task: {
            update: (data: any) => this.updateTask(data),
            create: (data: any) => this.addTask(data),
            delete: (id: any) => this.removeTask(id),
          },
        });
    }

    const respParse = await lastValueFrom(this._taskService.get());
    this.tasks = respParse.data;
    
    gantt.parse({
      data: respParse.data.map(item => ({
        id: item.task.id,
        text: item.task.name,
        type: item.task.type,
        start_date: item.task.startDate ? moment(item.task.startDate).format('DD-MM-YYYY HH:mm') : null,
        end_date: item.task.endDate ? moment(item.task.endDate).format('DD-MM-YYYY HH:mm') : null,
        duration: item.task.duration,
        progress: item.task.progress,
        owners: item.staffs.map((staff) => staff.staffId),
        parent: item.task.parentId
      }))
    });
  
    // gantt.showLightbox(8);
  }

  addTask(data: any){
    console.log(data)
    const _body: TaskCreateBody = {
      parentId: data.parent ? Number(data.parent) : null,
      label: data.text,
      // type: data.type ? data.type : (this.tasks.length === 0 ? 'project' : 'task'),
      type: data.type,
      name: data.text,
      startDate: moment(data.start_date, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD'),
      endDate: moment(data.end_date, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD'),
      duration: data.duration,
      progress: data.progress,
      isUnscheduled: true,
      staffIds: data.owners.map((item: any) => Number(item)),
    }
    console.log(data);
    this._taskService.post(_body).subscribe(async res => {
      this._notifyService.notify$.next({status: 'success', message: 'Thêm công việc thành công!'});
      gantt.changeTaskId(data.id, res.data.id);

      const respParse = await lastValueFrom(this._taskService.get());
      this.tasks = respParse.data;
      // gantt.addTask({...data, id: res.data.id});
    })
  }

  updateTask(data: any){
    console.log(data);
    const _body: TaskUpdateBody = {
      id: data.id,
      parentId: data.parent ? Number(data.parent) : null,
      label: data.text,
      // type: data.type ? data.type : (this.tasks.length === 0 ? 'project' : 'task'),
      type: data.type,
      name: data.text,
      startDate: moment(data.start_date, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD'),
      endDate: moment(data.end_date, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD'),
      duration: data.duration,
      progress: data.progress,
      isUnscheduled: true,
      staffIds: data.owners.map((item: any) => Number(item)),
    };

    this._taskService.put(_body).subscribe(res => {
      this._notifyService.notify$.next({status: 'success', message: 'Cập nhật công việc thành công!'});
      gantt.refreshData();
    })
  }

  removeTask(id: number){
    this._taskService.delete(id).subscribe(res => {
      this._notifyService.notify$.next({status: 'success', message: 'Xóa công việc thành công!'});
      gantt.refreshData();
    })
  }
}