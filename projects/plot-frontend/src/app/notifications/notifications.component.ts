import { Component, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { Notification } from './notifications.models';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    NotificationComponent,
  ],
  selector: 'spaceribs-notifications',
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent {
  @Input() notifications: Notification[] = [
    {
      type: 'message',
      author: 'Spaceribs',
      subject: 'Do not attack me!',
      message:
        'Hello,\n\nI am just a simple friendly farming village. I wish to be left alone.\n\n❤️ Spaceribs',
      created: new Date(),
      unread: true,
    },
  ];
}
