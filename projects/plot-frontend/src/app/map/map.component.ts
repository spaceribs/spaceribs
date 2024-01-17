import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import Map from 'ol/Map';
import View from 'ol/View';
import Feature from 'ol/Feature';
import { StatesComponent } from './layers/states/states.component';
import { ProvincesComponent } from './layers/provinces/provinces.component';
import { AngularSplitModule } from 'angular-split';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MapDetailsComponent } from './details/details.component';

@Component({
  selector: 'spaceribs-map',
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    AngularSplitModule,
    MatExpansionModule,
    MatTableModule,
    StatesComponent,
    ProvincesComponent,
    MapDetailsComponent,
  ],
  templateUrl: './map.component.html',
})
export class MapComponent implements AfterViewInit {
  public map: Map;
  public showDetails: boolean = false;
  public focusedState: Feature | null = null;
  public focusedProvince: Feature | null = null;

  @ViewChild('mapContainer')
  public mapContainer?: ElementRef;

  constructor() {
    this.map = new Map({
      view: new View({
        center: [0, 0],
        zoom: 0,
      }),
    });
  }

  ngAfterViewInit(): void {
    this.map.setTarget(this.mapContainer?.nativeElement);

    // const source = new sources.XYZ({
    //   url: `/assets/tileset/{z}/{x}/{y}.png`,
    //   tileSize: 512,
    //   crossOrigin: 'anonymous',
    // });

    this.map.on('singleclick', (evt) => {
      this.focusedState = null;
      this.focusedProvince = null;
      this.map?.forEachFeatureAtPixel(evt.pixel, (feature) => {
        if (feature instanceof Feature) {
          if (feature.get('type') === 'state') {
            this.focusedState = feature;
          }
          if (feature.get('type') === 'province') {
            this.focusedProvince = feature;
          }
        }
      });
    });

    this.map.on('pointermove', (evt) => {
      const hit = this.map.hasFeatureAtPixel(evt.pixel);
      this.map.getViewport().style.cursor = hit ? 'pointer' : '';
    });
  }
}
