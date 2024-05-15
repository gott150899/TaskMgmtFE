import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';
import { NotifyService } from './services/notify.service';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, NzNotificationModule, NzLayoutModule, NzMenuModule, NzToolTipModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'TaskMgmtFE';
  isCollapsed = false;

  constructor(
    private _notificationService: NzNotificationService,
    private _notifyService: NotifyService
  ){

  }

  ngOnInit() {
    this._notifyService.notify$.subscribe(data => {
      if(!data.message) return;

      switch(data.status){
        case 'success':
          this._notificationService.success('Success', data.message)
          break;
        case 'info':
          this._notificationService.info('Info', data.message)
          break;
        case 'warning':
          this._notificationService.warning('Warning', data.message)
          break;
        case 'error':
          this._notificationService.error('Error', data.message)
          break;
      }
    })
  }
}
