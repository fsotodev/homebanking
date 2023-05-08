import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {ActivatedRoute, Router} from '@angular/router';
import {Benefit} from '@apps/models/benefit';
import {BenefitsService} from '@apps/services/benefits.service';
import {CampaignsEngineService} from '@apps/services/campaigns-engine.service';
import {ModalDialogService} from '@apps/services/modal-dialog.service';
import {Observable} from 'rxjs/';
import {map, startWith} from 'rxjs/operators';
import {screenIdValidator} from '../async-validators';

type SliderBenefitType = 'Destacados' | 'Exclusivos para ti (Seleccionables)';

interface CleanedFormBenefit {
  benefitId: string;
  priority: number;
}

interface FormSliderBenefit extends CleanedFormBenefit {
  companyImageUrlWelcome: string;
}

interface FormDefaultBenefit extends CleanedFormBenefit {
  weekDaysTag: string;
}

@Component({
  selector: 'app-new-benefit-screen',
  templateUrl: './new-benefit-screen.component.html',
  styleUrls: ['./new-benefit-screen.component.scss']
})
export class NewBenefitScreenComponent implements OnInit {
  benefitsForm: FormGroup;
  productForm: FormGroup;
  normalBenefitItems: FormArray;
  exclusiveBenefitsItems: FormArray;
  extensions = ['png', 'jpg', 'jpeg'];
  rawBenefits: Benefit[] = [];
  defaultBenefitsItems: FormArray;
  createdSliderBenefits = [];
  createdDefaultBenefits = [];
  selectedBenefitType: SliderBenefitType = 'Destacados';
  sliderBenefitTypes: Array<SliderBenefitType> = ['Destacados', 'Exclusivos para ti (Seleccionables)'];
  id: string;
  isEditing: boolean;
  isLoading = false;
  uploadFolder = '';
  isUploadingImage = false;
  filteredOptionsDefaultBenefits: Array<Observable<any[]>> = [];
  filteredOptionsExclusiveBenefits: Array<Observable<any[]>> = [];
  filteredOptionsNormalBenefits: Array<Observable<any[]>> = [];

  constructor(
    private fb: FormBuilder,
    private modalDialogService: ModalDialogService,
    private location: Location,
    private benefitsService: BenefitsService,
    private route: ActivatedRoute,
    private router: Router,
    private campaignEngineService: CampaignsEngineService
  ) {
  }

  async ngOnInit() {
    this.benefitsForm = this.fb.group({
      id: ['benefitsWP-', {
        validators: [Validators.required],
        asyncValidators: [screenIdValidator(this.campaignEngineService)],
        updateOn: 'blur'
      }],
      button: this.fb.group({
        backgroundColor: '#4f2d7f',
        color: '#ffffff',
        fixed: false,
        page: 'BenefitsListPage',
        pagePWA: '',
        params: '',
        paramsPWA: '',
        show: false,
        text: 'Ir a mis beneficios'
      }),
      details: this.fb.group({
        active: false,
        amount: 1,
        quota: 1
      }),
      benefits: this.fb.array([]),
      defaultBenefits: this.fb.array([]),
      backgroundColor: '#F3F3F3',
      backgroundColorTop: '#4f2d7f',
      mainTitle: this.fb.group({
        text: '¡conoce los descuentos de tu <b>tarjeta</b>!',
        show: true
      }),
      normalBenefits: this.fb.array([]),
      productsForExclusiveBenefits: this.fb.group({
        TR: false,
        TRM: false,
        SA: false
      }),
      /** @todo onchange agregar o sacar id producto al arreglo de arriba */
      subTitle: this.fb.group({
        text: 'Conoce más beneficios',
        show: true,
        color: ''
      }),
      exitButton: this.fb.group({
        color: '#ffffff',
        right: true,
        show: true,
        text: '<p style="font-size: 15px;">✕</p>'
      }),
      infoBox: this.fb.group({
        // eslint-disable-next-line max-len
        iconURL: 'https://firebasestorage.googleapis.com/v0/b/banco-ripley-app.appspot.com/o/benefits1111.png?alt=media&token=a8f1d493-dfb7-43be-bb79-19f656df51a5',
        show: false,
        text: 'Para obtener tus <b>códigos de descuento</b> ingresa a la sección de <b>Beneficios</b>'
      }),
      redirectBenefits: false,
      showBenefitMiniature: false,
      useSlider: true,
      wave: this.fb.group({
        invert: false,
        show: true
      })
    });
    this.rawBenefits = await this.benefitsService.getRawBenefits();
    this.route.queryParams.subscribe((params) => {
      if (params) {
        if (params.id) {
          this.isEditing = true;
          this.benefitsForm.get('id').disable();
          this.id = params.id;
          this.loadScreen();
        } else if (params.copyId) {
          this.id = params.copyId;
          this.isEditing = false;
          this.loadScreen();
        }
      }
    });
  }

  buildBenefit(benefits, firestoreBenefits) {
    return benefits.map(({benefitId, priority}) => {
      const originalBenefit = firestoreBenefits.find(activeBenefit => activeBenefit.id === benefitId);
      return {...originalBenefit, priority};
    });
  }

  goBack() {
    this.location.back();
  }

  productsForExclusiveBenefitsToArray(products) {
    return Object.entries(products)
      .filter(([_, value]) => value)
      .map(([key]) => key);
  }

  productsForExclusiveBenefitsToObj(products) {
    return products.reduce((acc, curr) => ({...acc, [curr]: true}), {});
  }

  getCleanSliderBenefits(normalBenefits, benefits) {
    const cleaningFn = ({companyImageUrlWelcome, ...rest}) => ({...rest});
    const cleanedNormalBenefits = normalBenefits.map(cleaningFn);
    const cleanedBenefits = benefits.map(cleaningFn);
    return {normalBenefits: cleanedNormalBenefits, benefits: cleanedBenefits};
  }

  async updateBenefitsImages(normalBenefits: Array<FormSliderBenefit>, benefits: Array<FormSliderBenefit>) {
    try {
      const everyBenefitToUpdate = normalBenefits.concat(benefits)
        .filter(({companyImageUrlWelcome}) => companyImageUrlWelcome !== '');
      const updateRequests = everyBenefitToUpdate.map(({benefitId, companyImageUrlWelcome}) => {
        const benefit = {id: benefitId, companyImageUrlWelcome};
        return this.benefitsService.updateWelcomepackImage(benefit);
      });
      await Promise.all(updateRequests);
    } catch (err) {
      console.log(`Error updating benefits images, ${err}`);
    }
  }

  async setCompanyImageUrlWelcome(event: MatAutocompleteSelectedEvent, benefits: FormArray, index: number) {
    try {
      const benefit = await this.benefitsService.getBenefitById(event.option.value);
      benefits.controls[index].get('companyImageUrlWelcome').setValue(benefit.companyImageUrlWelcome);
    } catch (error) {
      console.log(`Error setting companyImageUrlWelcome: ${error}`);
    }
  }

  async setWeekdaysTag(event: MatAutocompleteSelectedEvent, benefits: FormArray, index: number) {
    try {
      const benefit = await this.benefitsService.getBenefitById(event.option.value);
      const itsAnArrayWithItems = benefit.hasOwnProperty('weekdays') && benefit.weekdays.length;
      const tag = itsAnArrayWithItems
        ? benefit.weekdays[0]
        : '';
      benefits.controls[index].get('weekDaysTag').setValue(tag);
    } catch (error) {
      console.log(`Error setting weekDaysTag: ${error}`);
    }
  }

  async updateBenefitWeekDays(defaultBenefits) {
    try {
      const everyBenefitToUpdate = defaultBenefits
        .filter((benefit) => benefit.hasOwnProperty('weekDaysTag'));
      const updateRequests = everyBenefitToUpdate.map(({benefitId, weekDaysTag}) => {
        const benefit = {id: benefitId, weekDaysTag};
        return this.benefitsService.updateWelcomepackTag(benefit);
      });
      await Promise.all(updateRequests);
    } catch (err) {
      console.log(`Error updating benefits weekdays, ${err}`);
    }
  }


  async saveScreen() {
    this.isLoading = true;
    const {normalBenefits, benefits, defaultBenefits, productsForExclusiveBenefits, ...rest} = this.benefitsForm.value;
    await this.updateBenefitsImages(normalBenefits, benefits);
    const cleanedSliderBenefits = this.getCleanSliderBenefits(normalBenefits, benefits);
    await this.updateBenefitWeekDays(defaultBenefits);
    const cleanedDefaultBenefits = defaultBenefits.map(({weekDaysTag, ...defaultRest}) => ({...defaultRest}));
    const productsForExclusiveBenefitsArray = this.productsForExclusiveBenefitsToArray(productsForExclusiveBenefits);
    if (!this.isEditing) {
      const newBenefit = {
        ...rest,
        productsForExclusiveBenefits: productsForExclusiveBenefitsArray,
        normalBenefits: cleanedSliderBenefits.normalBenefits,
        benefits: cleanedSliderBenefits.benefits,
        defaultBenefits: cleanedDefaultBenefits
      };
      this.campaignEngineService.addNewScreen(newBenefit, 'page-benefits-welcomepack')
        .then(() => {
          this.isLoading = false;
          this.showModalWhenTransactionSaved('saveSuccessBenefitScreen');
        }).catch((err) => {
          console.log(`Error adding screen: ${err}`);
          this.showModalWhenError();
        });
    } else {
      this.campaignEngineService.updateScreen(this.id, {
        ...rest,
        productsForExclusiveBenefits: productsForExclusiveBenefitsArray,
        normalBenefits: cleanedSliderBenefits.normalBenefits,
        benefits: cleanedSliderBenefits.benefits,
        defaultBenefits: cleanedDefaultBenefits
      })
        .then(() => {
          this.isLoading = false;
          this.showModalWhenTransactionSaved('updateSuccessBenefitScreen');
        }).catch((err) => {
          console.log(`Error updating screen: ${err}`);
          this.showModalWhenError();
        });
    }
  }

  showModalWhenError() {
    this.modalDialogService.openModal('genericError')
      .then((btnPressed) => {
        if (btnPressed === 'right') {
          this.router.navigate(['/home']);
        }
      });
  }

  showModalWhenTransactionSaved(modalType: string) {
    this.modalDialogService.openModal(modalType)
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.router.navigate(['/list-welcomepack-campaigns']);
        } else {
          this.benefitsForm.reset();
        }
      });
  }

  async loadPreview() {
    const sortBenefitsByPriorityASC = (a, b) => a.priority - b.priority;
    // Slider
    const exclusiveBenefits = this.benefitsForm.get('benefits').value;
    const normalBenefits = this.benefitsForm.get('normalBenefits').value;
    const sliderFormBenefits = this.selectedBenefitType === 'Exclusivos para ti (Seleccionables)'
      ? exclusiveBenefits
      : normalBenefits;
    const sliderBenefits = await this.loadBenefits(sliderFormBenefits);
    this.createdSliderBenefits = sliderBenefits.sort(sortBenefitsByPriorityASC);
    // List
    const defaultBenefits = this.benefitsForm.get('defaultBenefits').value;
    const listBenefits = await this.loadBenefits(defaultBenefits);
    this.createdDefaultBenefits = listBenefits.sort(sortBenefitsByPriorityASC);
  }

  async loadScreen() {
    try {
      const screen = await this.campaignEngineService.getScreen(this.id);
      const {id, productsForExclusiveBenefits, normalBenefits, defaultBenefits, benefits, ...rest} = screen;
      this.cleanFormArray('normalBenefits');
      normalBenefits.forEach(() => {
        this.addNormalBenefit();
      });
      this.cleanFormArray('defaultBenefits');
      defaultBenefits.forEach(() => {
        this.addDefaultBenefit();
      });
      this.cleanFormArray('benefits');
      benefits.forEach(() => {
        this.addExclusiveBenefit();
      });
      const formattedProductsForExclusiveBenefits = this.productsForExclusiveBenefitsToObj(productsForExclusiveBenefits);
      const baseBenefitScreen = {
        ...rest,
        normalBenefits,
        defaultBenefits,
        benefits,
        productsForExclusiveBenefits: formattedProductsForExclusiveBenefits
      };
      if (this.isEditing) {
        const exclusiveBenefitsWithImages = benefits
          .map((benefit) => this.addCompanyImageUrlToWelcomeBenefit(benefit, this.rawBenefits));
        const normalBenefitsWithImages = normalBenefits
          .map((benefit) => this.addCompanyImageUrlToWelcomeBenefit(benefit, this.rawBenefits));
        const defaultBenefitsWithWeekTags = defaultBenefits
          .map((benefit) => this.addWeekDaysTagToWelcomeBenefit(benefit, this.rawBenefits));
        this.benefitsForm.patchValue({
          ...baseBenefitScreen,
          benefits: exclusiveBenefitsWithImages,
          normalBenefits: normalBenefitsWithImages,
          defaultBenefits: defaultBenefitsWithWeekTags,
          id
        });
      } else {
        this.benefitsForm.patchValue({...baseBenefitScreen});
      }
      await this.loadPreview();
    } catch (error) {
      console.log(`Error loading screen: ${error}`);
    }
  }

  addCompanyImageUrlToWelcomeBenefit(benefitForm, activeBenefits: Benefit[]): FormSliderBenefit {
    const benefit = activeBenefits.find(({id}) => id === benefitForm.benefitId);
    if (benefit) {
      return {...benefitForm, companyImageUrlWelcome: benefit.companyImageUrlWelcome || ''};
    }
    // todo: si no encuentra nada, hay que ver como manejarlo y por qué no encuentra nada.
  }

  addWeekDaysTagToWelcomeBenefit(benefitForm: CleanedFormBenefit, activeBenefits: Benefit[]): FormDefaultBenefit {
    const benefit = activeBenefits.find(({id}) => id === benefitForm.benefitId);
    if (benefit) {
      const itsAnArrayWithItems = benefit.hasOwnProperty('weekdays');
      const weekday = itsAnArrayWithItems
        ? benefit.weekdays[0]
        : '';
      return {...benefitForm, weekDaysTag: weekday};
    }
    // si no encuentra nada, hay que ver como manejarlo y por qué no encuentra nada.
  }

  cleanFormArray(controlName) {
    const formArray = (this.benefitsForm.get(controlName) as FormArray);
    formArray.value.slice().reverse().forEach((_, index) => {
      formArray.removeAt(index);
    });
  }

  async loadBenefits(benefitsFromForm) {
    const completedBenefits = benefitsFromForm.filter(({benefitId, priority}) => benefitId !== '' && priority !== '');
    const generateRequest = async benefitForm => {
      const benefit = await this.benefitsService.getBenefitById(benefitForm.benefitId);
      const {companyImageUrlWelcome, weekDaysTag} = benefitForm;
      if (benefitForm.hasOwnProperty('companyImageUrlWelcome')) {
        return {...benefit, companyImageUrlWelcome};
      }
      if (benefitForm.hasOwnProperty('weekDaysTag')) {
        return {...benefit, weekDaysTag};
      }
      return benefit;
    };
    const benefitsRequests = completedBenefits.map(generateRequest);
    const benefitsResults = await Promise.all(benefitsRequests);
    return this.buildBenefit(completedBenefits, benefitsResults);
  }

  get benefitsWP() {
    return this.benefitsForm.value;
  }

  get defaultBenefits() {
    return this.benefitsForm.get('defaultBenefits') as FormArray;
  }

  get exclusiveBenefits() {
    return this.benefitsForm.get('benefits') as FormArray;
  }

  get normalBenefits() {
    return this.benefitsForm.get('normalBenefits') as FormArray;
  }

  get sliderBenefits() {
    const selectableBenefits = this.benefitsForm.get('benefits').value;
    const normalBenefits = this.benefitsForm.get('normalBenefits').value;
    return selectableBenefits.concat(normalBenefits);
  }

  get sliderBenefitMessage(): string {
    return this.selectedBenefitType === 'Exclusivos para ti (Seleccionables)' ? 'Exclusivos para ti (Seleccionables)' : 'Destacados';
  }

  createBenefit(isFromSlider = false): FormGroup {
    const formControlObj = {
      benefitId: ['', {
        validators: [Validators.required],
      }],
      priority: 1,
    };
    if (isFromSlider) {
      return this.fb.group({...formControlObj, companyImageUrlWelcome: ''});
    }
    // else, it's a default benefit
    return this.fb.group({...formControlObj, weekDaysTag: ''});
  }

  addDefaultBenefit(): void {
    this.defaultBenefitsItems = this.benefitsForm.get('defaultBenefits') as FormArray;
    this.defaultBenefitsItems.push(this.createBenefit());
    const controlIndex = this.defaultBenefitsItems.length - 1;
    if (this.isEditing) {
      this.filteredOptionsDefaultBenefits.push(this.defaultBenefitsItems.at(controlIndex).valueChanges.pipe(
        map(value => this._filter(value))
      ));
    } else {
      this.filteredOptionsDefaultBenefits.push(this.defaultBenefitsItems.at(controlIndex).valueChanges.pipe(
        startWith({benefitId: ''}),
        map(value => this._filter(value))
      ));
    }
  }

  addExclusiveBenefit(): void {
    this.exclusiveBenefitsItems = this.benefitsForm.get('benefits') as FormArray;
    this.exclusiveBenefitsItems.push(this.createBenefit(true));
    const controlIndex = this.exclusiveBenefitsItems.length - 1;
    if (this.isEditing) {
      this.filteredOptionsExclusiveBenefits.push(this.exclusiveBenefitsItems.at(controlIndex).valueChanges.pipe(
        map(value => this._filter(value))
      ));
    } else {
      this.filteredOptionsExclusiveBenefits.push(this.exclusiveBenefitsItems.at(controlIndex).valueChanges.pipe(
        startWith({benefitId: ''}),
        map(value => this._filter(value))
      ));
    }
  }

  addNormalBenefit(): void {
    this.normalBenefitItems = this.benefitsForm.get('normalBenefits') as FormArray;
    this.normalBenefitItems.push(this.createBenefit(true));
    const controlIndex = this.normalBenefitItems.length - 1;
    if (this.isEditing) {
      this.filteredOptionsNormalBenefits.push(this.normalBenefitItems.at(controlIndex).valueChanges.pipe(
        map(value => this._filter(value))
      ));
    } else {
      this.filteredOptionsNormalBenefits.push(this.normalBenefitItems.at(controlIndex).valueChanges.pipe(
        startWith({benefitId: ''}),
        map(value => this._filter(value))
      ));
    }
  }

  removeDefaultBenefit(index): void {
    this.modalDialogService.openModal('deleteConfirm')
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.defaultBenefitsItems = this.benefitsForm.get('defaultBenefits') as FormArray;
          this.defaultBenefitsItems.removeAt(index);
        }
      });
  }

  receiveUrl(url: string, item: FormControl) {
    item.get('companyImageUrlWelcome').setValue(url);
  }

  removeExclusiveBenefit(index): void {
    this.modalDialogService.openModal('deleteConfirm')
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.exclusiveBenefitsItems = this.benefitsForm.get('benefits') as FormArray;
          this.exclusiveBenefitsItems.removeAt(index);
        }
      });
  }

  removeNormalBenefit(index): void {
    this.modalDialogService.openModal('deleteConfirm')
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.normalBenefitItems = this.benefitsForm.get('normalBenefits') as FormArray;
          this.normalBenefitItems.removeAt(index);
        }
      });
  }

  private _filter(value: any): Array<any> {
    const filterValue = value.benefitId.toLowerCase();
    return this.rawBenefits.filter(({id}) => id.toLowerCase().includes(filterValue));
  }
}
