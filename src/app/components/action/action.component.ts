import { CommonModule } from '@angular/common';
import { Component, OnInit, input, output } from '@angular/core';
import { ButtonBasicComponent } from '../button/button-basic/button-basic.component';


@Component({
  selector: 'app-action',
  standalone: true,
  imports: [CommonModule, ButtonBasicComponent],
  templateUrl: './action.component.html',
  styleUrl: './action.component.scss'
})
export class ActionComponent implements OnInit{
  isDelete = input.required<boolean>();
  isUpdate = input.required<boolean>();

  onDelete = output<void>();
  onUpdate = output<void>();

  totalCol = 0;

  ngOnInit() {
    if(this.isDelete()) this.totalCol++;
    if(this.isUpdate()) this.totalCol++;
  }

  onUpdateItem(){
    this.onUpdate.emit();
  }

  onDeleteItem(){
    this.onDelete.emit();
  }
}
