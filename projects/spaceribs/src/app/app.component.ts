import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'spaceribs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AppComponent {}
