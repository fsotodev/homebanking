import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-wave',
  templateUrl: './wave.component.html',
  styleUrls: ['./wave.component.scss'],
})
export class WaveComponent {
  @Input() public invert: boolean;
  @Input() public top: boolean;
  @Input() public colorTop: string;
  @Input() public image = true;

  public path: string;

  constructor() {
    this.path = `url(${window.location.pathname}#MyGradient) rgb(79, 45, 127)`;
  }
}
