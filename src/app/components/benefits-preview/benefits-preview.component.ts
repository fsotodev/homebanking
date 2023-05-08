import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { UtilsService } from '@apps/services/utils.service';
import { Benefit } from '../../models/benefit';

const DEFAULT_BENEFIT_IMAGE = '/assets/img/logo_gray_square.png';

@Component({
  selector: 'app-benefits-preview',
  templateUrl: './benefits-preview.component.html',
  styleUrls: ['./benefits-preview.component.scss']
})
export class BenefitsPreviewComponent implements OnChanges {
    @Input() benefitsWP;
    @Input() exitButton;
    @Input() sliderBenefits;
    @Input() listBenefits: Benefit[];
    @Input() mainTitle;
    @Input() subTitle;
    @Input() useSlider;
    @Input() containerBackgroundColor;
    @Input() containerTopBackgroundColor;
    @Input() wave;
    @Input() isFromWelcomepackForm = false;
    @ViewChild('benefitSlides', {static: false}) public slides: any;
    public activeIndex = 0;
    public promotions = [];
    public loadedSliderBenefits = [];
    public slideOptions = {
      slidesPerView: 1.8,
      centeredSlides: true,
      slidesOffsetBefore: 20,
      spaceBetween: 20,
      allowTouchMove: true,
      zoom: { toggle: false }
    };
    constructor(
        public utils: UtilsService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes.listBenefits) {
        this.listBenefits = changes.listBenefits.currentValue;
      }
      if (changes.sliderBenefits) {
        this.sliderBenefits = changes.sliderBenefits.currentValue;
      }
    }

    get waveStyle() {
      const degrees = this.wave.invert ? 180 : 0;
      const display = this.wave.show ? 'block' : 'none';
      return {
        transform: `rotateY(${degrees}deg)`,
        display
      };
    }

    public isSlideActive(index: number) {
      return index === this.activeIndex;
    }

    public onSlideChange() {
      this.activeIndex = this.slides.directiveRef.instance.activeIndex;
    }

    public getPromotionImage(benefit: Benefit) {
      return benefit.companyImageUrlWelcome || DEFAULT_BENEFIT_IMAGE;
    }

    public getPromotionMiniImage(benefit: Benefit) {
      return benefit.newBenefit.logoImageUrl || DEFAULT_BENEFIT_IMAGE;
    }
}
