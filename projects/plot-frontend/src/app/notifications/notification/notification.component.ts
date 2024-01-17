import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Notification } from '../notifications.models';
import { NotificationMessageComponent } from './message/message.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    NotificationMessageComponent,
  ],
  selector: 'spaceribs-notification',
  templateUrl: './notification.component.html',
})
export class NotificationComponent {
  @Input() notification?: Notification;
}
