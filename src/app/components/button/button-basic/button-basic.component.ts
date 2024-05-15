import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ButtonBasicType } from '../../../models/global.type';

@Component({
  selector: 'app-button-basic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-basic.component.html',
  styleUrl: './button-basic.component.scss'
})
export class ButtonBasicComponent {
  label = input.required<string>();
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  type = input<ButtonBasicType>('primary');
  btnType = input<'button' | 'submit'>('button');

  onClick = output<void>();

  onClickBtn(){
    if(this.loading() || this.disabled()) return;

    this.onClick.emit();
  }
}
