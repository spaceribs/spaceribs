import {
  Component,
  EmbeddedViewRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProvincesComponent } from './provinces.component';
import Feature from 'ol/Feature';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { unByKey } from 'ol/Observable';
import { MapComponent } from '../../map.component';
import { MatCardModule } from '@angular/material/card';
import RenderEvent from 'ol/render/Event';
import { FrameState } from 'ol/Map';
import Overlay from 'ol/Overlay';
import { Extent, getCenter } from 'ol/extent';
import { Coordinate } from 'ol/coordinate';
import { MatButtonModule } from '@angular/material/button';
import {
  MatBottomSheetModule,
  MatBottomSheet,
} from '@angular/material/bottom-sheet';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { ProvinceActionsComponent } from './province-actions/province-actions.component';

@Component({
  selector: 'spaceribs-province',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule,
    MatBottomSheetModule,
  ],
  templateUrl: './province.component.html',
})
export class ProvinceComponent implements OnDestroy {
  public feature?: Feature;
  public isFocused = false;
  public test = 'yes';

  @ViewChild('tooltip')
  public tooltipTemplate?: TemplateRef<unknown>;
  @ViewChild('tooltip')
  public tooltipRef?: EmbeddedViewRef<unknown>;
  public tooltip?: Overlay;
  public center?: Coordinate;

  @Output() public showDetails = new EventEmitter<void>();

  @Input() public set province(feature: Feature) {
    feature.set('type', 'province');
    feature.setStyle(this.defaultStyle);
    this.feature = feature;
    const extent = this.feature.getGeometry()?.getExtent() as Extent;
    this.center = getCenter(extent);
  }

  @Input() public set focused(isFocused: boolean) {
    this.isFocused = isFocused;

    if (this.isFocused === true) {
      this.feature?.setStyle(this.focusedStyle);
      this.animateFocus();
      this.showTooltip();
    } else {
      this.feature?.setStyle(this.defaultStyle);
      this.hideTooltip();
    }
  }

  private readonly defaultStyle = new Style({
    stroke: new Stroke({
      color: '#0b3948',
      width: 1,
      lineJoin: 'bevel',
    }),
    fill: new Fill({
      color: 'rgba(0,0,0,0)',
    }),
  });

  private readonly focusedStyle = new Style({
    zIndex: 1,
    stroke: new Stroke({
      color: '#3a6ea5',
      width: 7,
      lineJoin: 'bevel',
    }),
    fill: new Fill({
      color: 'rgba(0,0,0,0)',
    }),
  });

  constructor(
    private readonly provinces: ProvincesComponent,
    private vc: ViewContainerRef,
    private readonly ol: MapComponent,
    private readonly bottomSheet: MatBottomSheet,
  ) {}

  showActions() {
    this.bottomSheet.open(ProvinceActionsComponent);
  }

  ngOnDestroy(): void {
    this.hideTooltip();
  }

  animateFocus() {
    const start = Date.now();

    const animate = (event: RenderEvent) => {
      const frameState = event.frameState as FrameState;
      const elapsed = frameState.time - start;
      if (this.isFocused === false) {
        unByKey(listenerKey);
        return;
      }
      const lineDashOffset = (elapsed / 100) % 20;

      this.feature?.setStyle(
        new Style({
          zIndex: 1,
          stroke: new Stroke({
            color: 'rgba(32, 125, 181, 0.7)',
            width: 6,
            lineDash: [10],
            lineDashOffset,
            lineJoin: 'round',
            lineCap: 'round',
          }),
          fill: new Fill({
            color: 'rgba(32, 125, 181, 0.2)',
          }),
        }),
      );

      this.ol.map.render();
    };

    const listenerKey = this.provinces.layer.on('postrender', animate);
  }

  showTooltip() {
    if (this.tooltipTemplate) {
      this.tooltipRef = this.vc.createEmbeddedView(this.tooltipTemplate);
      this.tooltip = new Overlay({
        element: this.tooltipRef?.rootNodes[0],
        positioning: 'bottom-center',
        position: this.center,
      });
      this.ol.map.addOverlay(this.tooltip);
    }
  }

  hideTooltip() {
    if (this.tooltip != null) {
      this.ol.map.removeOverlay(this.tooltip);
      this.tooltipRef?.destroy();
    }
  }
}
