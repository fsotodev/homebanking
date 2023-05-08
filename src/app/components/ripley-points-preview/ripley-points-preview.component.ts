import { Component, Input } from '@angular/core';
import { UtilsService } from '@apps/services/utils.service';

@Component({
  selector: 'app-ripley-points-preview',
  templateUrl: './ripley-points-preview.component.html',
  styleUrls: ['./ripley-points-preview.component.scss']
})
export class RipleyPointsPreviewComponent {
    @Input() ripleyPointsWP;

    constructor(
        public utils: UtilsService
    ) { }

    get waveStyle() {
      const degrees = this.ripleyPointsWP.wave.invert ? 180 : 0;
      const display = this.ripleyPointsWP.wave.show ? 'block' : 'none';
      return {
        transform: `rotateY(${degrees}deg)`,
        display
      };
    }

    get showFixedButton() {
      return !!this.ripleyPointsWP.button.show && !!this.ripleyPointsWP.button.fixed;
    }

}
