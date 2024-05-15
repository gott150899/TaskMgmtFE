import { Component, OnInit } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { StaffVM } from '../../models/staff.model';
import { StaffService } from '../../services/staff.service';
import { CommonModule } from '@angular/common';
import { TagComponent } from '../../components/tag/tag.component';
import { ActionComponent } from '../../components/action/action.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NotifyService } from '../../services/notify.service';
import { StaffModifyComponent } from './staff-modify/staff-modify.component';
import { ButtonBasicComponent } from '../../components/button/button-basic/button-basic.component';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { StatusEntity } from '../../models/global.enum';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, FormsModule, NzTableModule, TagComponent, ActionComponent, NzModalModule, StaffModifyComponent, ButtonBasicComponent, NzSelectModule],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.scss'
})
export class StaffComponent implements OnInit{
  data: StaffVM[] = [];

  // isVisibleDelete = false;
  staffDelete?: StaffVM;

  isOpenFormUpdate = false;
  staffUpdate?: StaffVM;

  searchText = '';
  filterStatus = 9999;

  constructor(
    private _staffService: StaffService,
    private _notifyService: NotifyService
  ){
  }

  ngOnInit() {
    this.onFetchData();
  }
  
  onFetchData(){
    this._staffService.get(this.searchText, this.filterStatus).subscribe(res => {
      this.data = res.data;
    })
  }

  get messageDeleteWarning(){
    return this.staffDelete ? `Xác nhận khóa nhân viên "${this.staffDelete.fullName}" ?` : ''
  }

  get isVisibleDelete(){
    return this.staffDelete !== undefined;
  }

  handleCancel(){
    // this.isVisibleDelete = false
    this.staffDelete = undefined;
  }

  onDeleteItem(staff: StaffVM){
    // this.isVisibleDelete = true;
    this.staffDelete = staff;
  }

  onConfirmDelete(){
    
    try{
      this._staffService.delete(this.staffDelete!.id).subscribe(res => {
        this._notifyService.notify$.next({status: 'success', message: 'Xóa nhân viên thành công!'});
        this.onFetchData();
      })
    }catch{

    }
    this.staffDelete = undefined;
  }

  onUpdateItem(staff: StaffVM){
    this.staffUpdate = staff;
    this.isOpenFormUpdate = true;
  }

  onCloseFormModify(){
    this.isOpenFormUpdate = false;
    this.staffUpdate = undefined;
  }

  onAfterSubmitFormModify(){
    this.isOpenFormUpdate = false;
    this.staffUpdate = undefined;
    this.onFetchData();
  }

  onAddstaff(){
    this.isOpenFormUpdate = true;
  }

  onChangeFilterStatus(){
    // console.log(this.filterStatus)
    this.onFetchData();
  }
}
