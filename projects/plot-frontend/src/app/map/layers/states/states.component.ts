import { Component, ErrorHandler, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../../map.component';
import * as sources from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import Vector from 'ol/layer/Vector';
import Layer from 'ol/layer/Layer';
import Feature from 'ol/Feature';
import { StateComponent } from './state.component';

@Component({
  selector: 'spaceribs-states',
  standalone: true,
  imports: [CommonModule, StateComponent],
  template: `<spaceribs-state
    *ngFor="let feature of features"
    [state]="feature"
    [focused]="feature === focused"
  ></spaceribs-state>`,
})
export class StatesComponent {
  public layer: Layer;
  public features?: Feature[];

  @Input() public focused: Feature | null = null;

  constructor(
    private ol: MapComponent,
    errorHandler: ErrorHandler,
  ) {
    const source = new sources.Vector({
      url: '/assets/mapdata/out/provinces.geojson',
      format: new GeoJSON(),
    });

    source.on('featuresloadend', (evt) => {
      console.log(evt);
      this.features = evt.features;
    });

    source.on('featuresloaderror', (evt) => {
      errorHandler.handleError(evt);
    });

    this.layer = new Vector({
      properties: { id: 'states' },
      source,
      background: '#d9dbf1',
    });

    this.ol.map.addLayer(this.layer);
  }
}
