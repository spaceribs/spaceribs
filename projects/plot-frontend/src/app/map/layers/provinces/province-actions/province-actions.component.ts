import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';

export enum TerritoryAction {
  Attack,
  Redeploy,
  Spy,
  Message,
}

@Component({
  selector: 'spaceribs-province-actions',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './province-actions.component.html',
})
export class ProvinceActionsComponent {
  actions = TerritoryAction;

  @Output() action: EventEmitter<TerritoryAction> = new EventEmitter();
}
