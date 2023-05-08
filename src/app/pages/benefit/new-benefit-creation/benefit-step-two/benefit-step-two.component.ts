import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NewBenefitService } from '@apps/services/newBenefit.service';

@Component({
  selector: 'app-benefit-step-two',
  templateUrl: './benefit-step-two.component.html',
  styleUrls: ['./benefit-step-two.component.scss']
})
export class BenefitStepTwoComponent implements OnInit {
  @Input() selectedTemplate: string;
  benefitType: string;
  consumption: boolean;
  retirement: boolean;
  delivery: boolean;
  masterCard: boolean;
  tarjetaRipley: boolean;
  cuentaVista: boolean;
  debitoRipley: boolean;
  selectedIndex = 0;
  sku: string;
  skuList: string[] = [];
  title: string;
  subtitle: string;
  cardPrice: number;
  cardText: string;
  benefitDiscount: string;
  coverage: string;
  normalPrice: number;
  ripleyPoints: string;
  internetPrice: number;
  benefitShortDescrption: string;
  benefitDescription: string;
  secondStepForm: FormGroup;

  constructor(public newBenefitService: NewBenefitService) {
  }
  ngOnInit() {
    this.setModel();
    this.secondStepForm = new FormGroup({
      isMasterCardRequired: new FormControl(''),
      isCreditCardRequired: new FormControl(''),
      isDebitCardRequired: new FormControl(''),
      isDebitRequired: new FormControl(''),
      title: new FormControl('',
        // Validators.compose([
        //   Validators.maxLength(35),
        //   Validators.minLength(1),
        //   Validators.required
        // ])
      ),
      subtitle: new FormControl('',
        // Validators.compose([
        //   Validators.maxLength(80),
        //   Validators.minLength(1),
        //   Validators.required
        // ])
      ),
      cardPrice: new FormControl('',
        // Validators.compose([
        //   Validators.maxLength(80),
        //   Validators.minLength(1),
        //   Validators.pattern('^[0-9]*$')
        // ])
      ),
      cardText: new FormControl('',
        // Validators.compose([
        //   Validators.maxLength(80),
        //   Validators.minLength(1),
        //   Validators.required
        // ])
      ),
      normalPrice: new FormControl('',
        // Validators.compose([
        //   Validators.maxLength(80),
        //   Validators.minLength(1),
        //   Validators.min(0),
        //   Validators.pattern('^[0-9]*$')
        // ])
      ),
      internetPrice: new FormControl('',
        // Validators.compose([
        //   Validators.maxLength(80),
        //   Validators.minLength(1),
        //   Validators.min(0),
        //   Validators.pattern('^[0-9]*$')
        // ])
      ),
      benefitDiscount: new FormControl('',
        // Validators.compose([
        //   Validators.maxLength(60),
        //   Validators.minLength(1),
        //   Validators.required
        // ])
      ),
      coverage: new FormControl('',
        // Validators.compose([
        //   Validators.maxLength(60),
        //   Validators.minLength(1)
        // ])
      ),
      benefitDescription: new FormControl('',
        // Validators.compose([
        //   Validators.maxLength(500),
        //   Validators.minLength(1),
        //   Validators.required
        // ])
      ),
      benefitShortDescrption: new FormControl('',
        // Validators.compose([
        //   Validators.maxLength(40),
        //   Validators.minLength(1),
        //   Validators.required
        // ])
      ),
      ripleyPoints: new FormControl('',
        // Validators.compose([
        //   Validators.maxLength(80),
        //   Validators.minLength(1)
        // ])
      ),
      isDelivery: new FormControl(''),
      isLocallyConsume: new FormControl(''),
      isPickup: new FormControl(''),
      sku: new FormControl('')
    });

  }

  setModel = () => {
    this.masterCard = this.newBenefitService.modelBenefitOld.newBenefit.isMasterCardRequired;
    this.tarjetaRipley = this.newBenefitService.modelBenefitOld.newBenefit.isCreditCardRequired;
    this.cuentaVista = this.newBenefitService.modelBenefitOld.newBenefit.isDebitCardRequired;
    this.debitoRipley = this.newBenefitService.modelBenefitOld.newBenefit.isDebitRequired;
    this.title = this.newBenefitService.modelBenefitOld.newBenefit.title;
    this.subtitle = this.newBenefitService.modelBenefitOld.newBenefit.subtitle;
    this.cardPrice = this.newBenefitService.modelBenefitOld.newBenefit.cardPrice;
    this.cardText = this.newBenefitService.modelBenefitOld.newBenefit.cardText;
    this.normalPrice = this.newBenefitService.modelBenefitOld.newBenefit.normalPrice;
    this.internetPrice = this.newBenefitService.modelBenefitOld.newBenefit.internetPrice;
    this.benefitDiscount = this.newBenefitService.modelBenefitOld.newBenefit.benefitDiscount;
    this.coverage = this.newBenefitService.modelBenefitOld.newBenefit.coverage;
    this.benefitDescription = this.newBenefitService.modelBenefitOld.newBenefit.benefitDescription;
    this.benefitShortDescrption = this.newBenefitService.modelBenefitOld.newBenefit.benefitShortDescrption;
    this.ripleyPoints = this.newBenefitService.modelBenefitOld.newBenefit.ripleyPoints;
    this.delivery = this.newBenefitService.modelBenefitOld.newBenefit.isDelivery;
    this.consumption = this.newBenefitService.modelBenefitOld.newBenefit.isLocallyConsume;
    this.retirement = this.newBenefitService.modelBenefitOld.newBenefit.isPickup;
  };

  addSku() {
    if (this.sku !== undefined || this.sku.trim() !== '') {
      this.skuList.push(this.sku);
      this.sku = '';
    }
  }

  deleteSku(index: number) {
    this.skuList.splice(index, 1);
  }

  setIndex(event) {
    this.selectedIndex = event.selectedIndex;
  }

  saveStepTwo = () => {
    this.newBenefitService.modelBenefitOld.newBenefit.title = this.title.toString();
    this.newBenefitService.modelBenefitOld.newBenefit.subtitle = this.subtitle.toString();
    this.newBenefitService.modelBenefitOld.newBenefit.benefitDiscount = this.benefitDiscount;
    this.newBenefitService.modelBenefitOld.newBenefit.cardPrice = this.cardPrice === undefined ? 0 : this.cardPrice;
    this.newBenefitService.modelBenefitOld.newBenefit.coverage = this.coverage.toString();
    this.newBenefitService.modelBenefitOld.newBenefit.isLocallyConsume = this.consumption === undefined ? false : this.consumption;
    this.newBenefitService.modelBenefitOld.newBenefit.isPickup = this.retirement === undefined ? false : this.retirement;
    this.newBenefitService.modelBenefitOld.newBenefit.isDelivery = this.delivery === undefined ? false : this.delivery;
    this.newBenefitService.modelBenefitOld.newBenefit.isMasterCardRequired = this.masterCard === undefined ? false : this.masterCard;
    this.newBenefitService.modelBenefitOld.newBenefit.isDebitCardRequired = this.cuentaVista === undefined ? false : this.cuentaVista;
    this.newBenefitService.modelBenefitOld.newBenefit.isCreditCardRequired = this.tarjetaRipley === undefined ? false : this.tarjetaRipley;
    this.newBenefitService.modelBenefitOld.newBenefit.isDebitRequired = this.debitoRipley === undefined ? false : this.debitoRipley;
    this.newBenefitService.modelBenefitOld.newBenefit.cardText = this.cardText.toString();
    this.newBenefitService.modelBenefitOld.newBenefit.benefitShortDescrption = this.benefitShortDescrption.toString();
    this.newBenefitService.modelBenefitOld.newBenefit.benefitDescription = this.benefitDescription.toString();
    this.newBenefitService.modelBenefitOld.newBenefit.normalPrice = this.normalPrice === undefined ? 0 : this.normalPrice;
    this.newBenefitService.modelBenefitOld.newBenefit.ripleyPoints = this.ripleyPoints === undefined ? '' : this.ripleyPoints;
    this.newBenefitService.modelBenefitOld.newBenefit.internetPrice = this.internetPrice === undefined ? 0 : this.internetPrice;
    this.newBenefitService.modelBenefitOld.newBenefit.skuList = this.skuList === undefined ? [] : this.skuList;
  };

}
