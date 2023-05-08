import { Component, Input, OnInit } from '@angular/core';
import { NewBenefit } from '@apps/models/new-benefit';
import { NewBenefitService } from '@apps/services/newBenefit.service';

@Component({
  selector: 'app-new-benefit-preview',
  templateUrl: './new-benefit-preview.component.html',
  styleUrls: ['./new-benefit-preview.component.scss']
})
export class NewBenefitPreviewComponent implements OnInit {
  @Input() newBenefitToCreate: NewBenefit;
  isShowBenefit: boolean;
  showCard: boolean;

  constructor(public newBenefitService: NewBenefitService) { }

  ngOnInit() {
  }

  showCreditCard = () => (
    this.newBenefitService.modelBenefitOld.newBenefit?.isMasterCardRequired ||
      this.newBenefitService.modelBenefitOld.newBenefit?.isCreditCardRequired
  );

  debitCard = () => {
    let debitToShow = '';
    const { isDebitCardRequired, isDebitRequired } = this.newBenefitService.modelBenefitOld.newBenefit;
    if (isDebitRequired) {
      debitToShow = 'i-category-deb';
    } else if (isDebitCardRequired && !isDebitRequired) {
      debitToShow = 'i-category-deb-mc';
    }
    return debitToShow;
  };

}
