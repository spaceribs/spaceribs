import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import Feature from 'ol/Feature';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';

@Component({
  selector: 'spaceribs-state',
  standalone: true,
  imports: [CommonModule],
  template: ``,
})
export class StateComponent {
  public feature?: Feature;
  public isFocused = false;

  @Input() public set state(feature: Feature) {
    feature.set('type', 'state');
    feature.setStyle(this.defaultStyle);
    this.feature = feature;
  }
  @Input() public set focused(isFocused: boolean) {
    this.isFocused = isFocused;

    if (this.isFocused === true) {
      this.feature?.setStyle(this.focusedStyle);
    } else {
      this.feature?.setStyle(this.defaultStyle);
    }
  }

  private readonly defaultStyle = new Style({
    stroke: new Stroke({
      color: '#0b3948',
      width: 3,
      lineJoin: 'bevel',
    }),
    fill: new Fill({
      color: '#acb0bd',
    }),
  });

  private readonly focusedStyle = new Style({
    stroke: new Stroke({
      color: '#0b3948',
      width: 3,
      lineJoin: 'bevel',
    }),
    fill: new Fill({
      color: '#acb0bd',
    }),
  });
}
