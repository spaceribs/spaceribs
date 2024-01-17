import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import Feature from 'ol/Feature';

@Component({
  selector: 'spaceribs-map-details',
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatExpansionModule,
    MatTableModule,
  ],
  templateUrl: './details.component.html',
})
export class MapDetailsComponent {
  @Input() province: Feature | null = null;
  @Input() state: Feature | null = null;
  @Output() hideDetails = new EventEmitter();
}
