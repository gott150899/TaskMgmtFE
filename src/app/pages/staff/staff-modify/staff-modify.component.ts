import { CommonModule } from '@angular/common';
import { Component, OnInit, effect, input, output } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { StatusEntity } from '../../../models/global.enum';
import { StaffVM } from '../../../models/staff.model';
import { NotifyService } from '../../../services/notify.service';
import { StaffService } from '../../../services/staff.service';
import { ButtonBasicComponent } from '../../../components/button/button-basic/button-basic.component';

@Component({
  selector: 'app-staff-modify',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NzModalModule, ButtonBasicComponent],
  templateUrl: './staff-modify.component.html',
  styleUrl: './staff-modify.component.scss'
})
export class StaffModifyComponent implements OnInit{
  isOpenForm = input.required<boolean>();
  staffModify = input<StaffVM>();

  onCloseModal = output<void>();
  onAfterSubmit = output<void>();

  isSumitting = false;

  formGroup = this._fb.group({
    id: this._fb.control(0),
    fullName: this._fb.control('', [
      Validators.required, 
      Validators.pattern(/^\s*[a-zA-ZĐđÂâĂăÊêÔôƠơƯưÁáÀàẢảÃãẠạĂăẮắẰằẲẳẴẵẶặÂâẤấẦầẨẩẪẫẬậÉéÈèẺẻẼẽẸẹÊêẾếỀềỂểỄễỆệÍíÌìỈỉĨĩỊịÓóÒòỎỏÕõỌọÔôỐốỒồỔổỖỗỘộƠơỚớỜờỞởỠỡỢợÚúÙùỦủŨũỤụƯưỨứỪừỬửỮữỰựÝýỲỳỶỷỸỹỴỵ]+(\s+[a-zA-ZĐđÂâĂăÊêÔôƠơƯưÁáÀàẢảÃãẠạĂăẮắẰằẲẳẴẵẶặÂâẤấẦầẨẩẪẫẬậÉéÈèẺẻẼẽẸẹÊêẾếỀềỂểỄễỆệÍíÌìỈỉĨĩỊịÓóÒòỎỏÕõỌọÔôỐốỒồỔổỖỗỘộƠơỚớỜờỞởỠỡỢợÚúÙùỦủŨũỤụƯưỨứỪừỬửỮữỰựÝýỲỳỶỷỸỹỴỵ]+)+\s*$/),
      Validators.maxLength(100)
    ]),
    shortName: this._fb.control('', Validators.maxLength(100)),
  });

  constructor(
    private _fb: FormBuilder,
    private _staffService: StaffService,
    private _notifyService: NotifyService
  ){
    effect(() =>{
      if(this.staffModify()){
        this.formGroup.patchValue((this.staffModify() as StaffVM));
      }
    })
  }

  ngOnInit() {
  }

  getControl<T = FormControl>(key: string){
    return this.formGroup.get(key) as T;
  }

  get titleModal(){
    return this.staffModify() ? 'Cập nhật nhân viên' : 'Thêm nhân viên';
  }

  get buttonText(){
    return this.staffModify() ? 'Cập nhật' : 'Thêm mới';
  }

  handleCancel(){
    this.onCloseModal.emit();
    this.onResetForm();
  }

  onResetForm(){
    this.formGroup.reset();
    this.isSumitting = false;
  
    this.formGroup.patchValue({
      id: 0
    })
  }

  onSubmitForm(){
    this.formGroup.markAllAsTouched();
    if(this.formGroup.invalid) return;

    this.isSumitting = true;

    const _body: any = this.formGroup.value;

    if(this.staffModify()){
      this._staffService.put(_body).subscribe(res => {
        this._notifyService.notify$.next({status: 'success', message: 'Cập nhật nhân viên thành công!'});
        this.onAfterSubmit.emit();
        this.isSumitting = false;
        this.onResetForm();
      })
    }else{
      this._staffService.post(_body).subscribe(res => {
        this._notifyService.notify$.next({status: 'success', message: 'Thêm nhân viên thành công!'});
        this.onAfterSubmit.emit();
        this.isSumitting = false;
        this.onResetForm();
      })
    }
  }
}
