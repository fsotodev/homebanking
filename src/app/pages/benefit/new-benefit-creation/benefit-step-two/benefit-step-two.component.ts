import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { NewBenefitService } from '@apps/services/newBenefit.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';


@Component({
  selector: 'app-benefit-step-two',
  templateUrl: './benefit-step-two.component.html',
  styleUrls: ['./benefit-step-two.component.scss']
})
export class BenefitStepTwoComponent implements OnInit {
  @Input() selectedTemplate: string;
  benefitType: string;
  consumption: boolean;
  delivery: boolean;
  masterCard: boolean;
  masterCardBlack: boolean;
  debitoMCVista: boolean;
  debitoMCCuentaCorriente: boolean;
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
  tags: any[] ;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(public newBenefitService: NewBenefitService) {

  }
  ngOnInit() {
    this.setModel();
    this.secondStepForm = new FormGroup({
      tagCtrl: new FormControl(''),
      isMasterCardBlackRequired: new FormControl(''),
      isMasterCardRequired: new FormControl(''),
      isMCDebitVistaRequired: new FormControl(''),
      isMCDebitCCRequired: new FormControl(''),
      title: new FormControl('', Validators.compose([Validators.maxLength(19)])
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
      benefitDiscount: new FormControl('', Validators.compose([Validators.maxLength(40)])
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
      benefitShortDescrption: new FormControl('', Validators.compose([Validators.maxLength(25)])
        //   ,Validators.minLength(1),
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
      sku: new FormControl('')
    });

  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push({ text: value, view: false });
    }

    // Clear the input value
    event.chipInput.clear();
  }

  remove(tag: any): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selectTag(tag: any): void {
    if(tag.view || this.validateMaxSelectedTag(tag)){
      this.toogleTag(tag);
      return;
    }
  }

  toogleTag(tag: any): void {
    const index = this.tags.indexOf(tag);
    if(index >= 0){
      this.tags[index].view = !this.tags[index].view;
    }
  }

  validateMaxSelectedTag(tag: any): boolean{
    const maxSelectedTags = 2;
    const countfiltered = this.tags.filter((element) => element.view).length;
    return countfiltered !== maxSelectedTags;
  }

  isProductSegmented(){
    return this.newBenefitService.selectedSegmentationType === 'productos';
  };

  setModel = () => {
    this.masterCardBlack = this.newBenefitService.modelBenefitOld.newBenefit.isMasterCardBlackRequired;
    this.masterCard = this.newBenefitService.modelBenefitOld.newBenefit.isMasterCardRequired;
    this.debitoMCVista = this.newBenefitService.modelBenefitOld.newBenefit.isMCDebitVistaRequired;
    this.debitoMCCuentaCorriente = this.newBenefitService.modelBenefitOld.newBenefit.isMCDebitCCRequired;
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
    this.tags = this.newBenefitService.modelBenefitOld.newBenefit.tags;
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
    this.newBenefitService.modelBenefitOld.newBenefit.isDelivery = this.delivery === undefined ? false : this.delivery;
    this.newBenefitService.modelBenefitOld.newBenefit.isMasterCardBlackRequired = this.masterCardBlack  || false;
    this.newBenefitService.modelBenefitOld.newBenefit.isMasterCardRequired = this.masterCard === undefined ? false : this.masterCard;
    this.newBenefitService.modelBenefitOld.newBenefit.isMCDebitVistaRequired = this.debitoMCVista === undefined ? false: this.debitoMCVista;
    this.newBenefitService.modelBenefitOld.newBenefit.isMCDebitCCRequired = this.debitoMCCuentaCorriente === undefined ?
      false: this.debitoMCCuentaCorriente;
    this.newBenefitService.modelBenefitOld.newBenefit.cardText = this.cardText.toString();
    this.newBenefitService.modelBenefitOld.newBenefit.benefitShortDescrption = this.benefitShortDescrption.toString();
    this.newBenefitService.modelBenefitOld.newBenefit.benefitDescription = this.benefitDescription.toString();
    this.newBenefitService.modelBenefitOld.newBenefit.normalPrice = this.normalPrice === undefined ? 0 : this.normalPrice;
    this.newBenefitService.modelBenefitOld.newBenefit.ripleyPoints = this.ripleyPoints === undefined ? '' : this.ripleyPoints;
    this.newBenefitService.modelBenefitOld.newBenefit.internetPrice = this.internetPrice === undefined ? 0 : this.internetPrice;
    this.newBenefitService.modelBenefitOld.newBenefit.skuList = this.skuList === undefined ? [] : this.skuList;
    this.newBenefitService.modelBenefitOld.newBenefit.tags = this.tags === undefined ? [] : this.tags;

  };

}
