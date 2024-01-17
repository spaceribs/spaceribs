import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MessageNotification } from '../../notifications.models';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
  ],
  selector: 'spaceribs-notification-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class NotificationMessageComponent {
  @Input() notification?: MessageNotification;
}
