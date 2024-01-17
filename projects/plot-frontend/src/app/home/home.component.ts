import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

import { BackgroundComponent } from './background/background.component';

@Component({
  standalone: true,
  imports: [
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    BackgroundComponent,
  ],
  selector: 'spaceribs-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {}
