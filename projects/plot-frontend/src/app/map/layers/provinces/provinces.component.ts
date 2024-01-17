import {
  Component,
  ErrorHandler,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from '../../map.component';
import * as sources from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import Vector from 'ol/layer/Vector';
import Layer from 'ol/layer/Layer';
import Feature from 'ol/Feature';
import { ProvinceComponent } from './province.component';

@Component({
  selector: 'spaceribs-provinces',
  standalone: true,
  imports: [CommonModule, ProvinceComponent],
  template: `<spaceribs-province
    *ngFor="let feature of features"
    [province]="feature"
    [focused]="feature === focused"
    (showDetails)="showDetails.emit()"
  ></spaceribs-province>`,
})
export class ProvincesComponent {
  public layer: Layer;
  public features?: Feature[];

  @Output() public showDetails = new EventEmitter<void>();

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
      properties: { id: 'provinces' },
      source,
    });

    this.ol.map.addLayer(this.layer);
  }
}
