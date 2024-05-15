import { Component, input } from '@angular/core';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { StatusEntity } from '../../models/global.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [CommonModule, NzTagModule],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class TagComponent {
  status = input.required<StatusEntity>(); 
}
