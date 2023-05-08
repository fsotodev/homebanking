import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ICampaignScreen } from '@apps/models/interfaces/campaign-screen';
import { BenefitsService } from '@apps/services/benefits.service';

import { CampaignsEngineService } from '../../../services/campaigns-engine.service';
import { ModalDialogService } from '../../../services/modal-dialog.service';
import { Utils } from '../../shared-components/utils/utils';
import {CampaignType} from '@apps/models/types/types';

type Cards = 'CARDS';
type BenefitPreview = 'BENEFIT_TR' | 'BENEFIT_TRM' | 'BENEFIT_SA' | 'BENEFIT_TR_SA' | 'BENEFIT_TRM_SA' | 'BENEFIT_SINGLE';
type RipleyPointsGOPreview = 'RIPLEY_POINTS_GO';
type BenefitScreenKey =
  'trBenefitScreen' | 'trmBenefitScreen' | 'saBenefitScreen' | 'trSaBenefitScreen' | 'trmSaBenefitScreen' | 'singleBenefitScreen';
const baseIdValidator = (campaignsEngineService: CampaignsEngineService): AsyncValidatorFn =>
  (ctrl: AbstractControl) => campaignsEngineService.checkIfWelcomepackExists(ctrl.value)
    .then(result => result ? null : { baseIdUsed: 'Este id ya está en uso' })
    .catch(err => {
      console.log(`Error checking if document exists: \n${err}`);
      return { benefitExistance: 'No se pudo verificar el id' };
    });

@Component({
  selector: 'app-new-welcome-campaign',
  templateUrl: './new-welcomepack-campaign.component.html',
  styleUrls: ['./new-welcomepack-campaign.component.scss']
})
export class NewWelcomepackCampaignComponent implements OnInit {

  welcomepackForm: FormGroup;
  campaignType = 'welcome' as CampaignType;
  extensions = ['svg', 'png', 'jpg', 'jpeg'];
  isUploadingImage = false;
  isLoading = false;
  id: string;
  hasTr = false;
  hasTrm = false;
  hasSa = false;
  hasTrmSa = false;
  hasTrSa = false;
  trBenefitScreen: ICampaignScreen = {};
  trmBenefitScreen: ICampaignScreen = {};
  saBenefitScreen: ICampaignScreen = {};
  trSaBenefitScreen: ICampaignScreen = {};
  trmSaBenefitScreen: ICampaignScreen = {};
  benefitScreens = [];
  benefitTrScreens = [];
  benefitTrmScreens = [];
  benefitSaScreens = [];
  benefitTrSaScreens = [];
  benefitTrmSaScreens = [];
  selectedPreview: BenefitPreview | RipleyPointsGOPreview | Cards;
  sliderBenefits = [];
  listBenefits = [];
  cardItems = [];
  previewTitle = 'Seleccione una preview';
  cardWPScreens = [];
  ripleyPointsScreens = [];
  /** @todo: typing */
  ripleyPointScreen: any = {};
  cardWPScreen: any = {};
  singleBenefitScreen: ICampaignScreen;
  isASingleWelcomepack = false;


  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private campaignsEngineService: CampaignsEngineService,
    private modalDialogService: ModalDialogService,
    public utils: Utils,
    private formBuilder: FormBuilder,
    private benefitsService: BenefitsService
  ) { }

  async ngOnInit() {
    this.welcomepackForm = this.formBuilder.group({
      active: false,
      activePWA: [false, Validators.required],
      minime: false,
      totem: false,
      pager: {
        hidden: false,
        backgroundColor: '',
        buttonBackground: '',
        buttonBackgroundColor: '',
        done: 'Listo',
        next: 'Siguiente',
        swiperColor: 'swiper-pink',
        textColor: '#4f2d7f'
      },
      filters: this.formBuilder.group({
        allUsers: [false, Validators.required],
        devices: this.formBuilder.group({
          desktop: [false, Validators.required],
          mobile: [true, Validators.required]
        }),
        endDate: ['', Validators.required],
        haveProductCondition: ['or', Validators.compose(
          [
            Validators.required
          ]
        )],
        productDateSA: false,
        productDateTR: false,
        productDateTRM: false,
        productDateEndSA: new Date(2020, 1, 1),
        productDateEndTR: new Date(2020, 1, 1),
        productDateEndTRM: new Date(2020, 1, 1),
        productDateStartSA: new Date(2020, 1, 1),
        productDateStartTR: new Date(2020, 1, 1),
        productDateStartTRM: new Date(2020, 1, 1),
        segment: [false, Validators.required],
        segmentRipley: [{ value: false, disabled: true }],
        segmentOne: [{ value: false, disabled: true }],
        segmentBronze: [{ value: false, disabled: true }],
        segmentSilver: [{ value: false, disabled: true }],
        segmentGold: [{ value: false, disabled: true }],
        startDate: ['', Validators.required],
      }),
      id: ['', {
        validators: [Validators.compose(
          [
            Validators.maxLength(35),
            Validators.minLength(1),
            Validators.required
          ]
        )],
        asyncValidators: [baseIdValidator(this.campaignsEngineService)],
        updateOnL: 'blur'
      }],
      offerModal: [false, Validators.required],
      priority: ['', Validators.required],
      maxGoals: [1 , Validators.required],
      maxViews: [3],
      allowTouchMove: true,
      allowSwipeToPrev: true,
      allowSwipeToNext: true,
      timeout: 200000,
    });

    this.cardWPScreens = await this.campaignsEngineService.getScreensByTemplate('page-cards-welcomepack');
    const allBenefits = await this.campaignsEngineService.getScreensByTemplate('page-benefits-welcomepack');
    this.benefitTrScreens = allBenefits.filter(benefit => benefit.productsForExclusiveBenefits.includes('TR'));
    this.benefitTrmScreens = allBenefits.filter(benefit => benefit.productsForExclusiveBenefits.includes('TRM'));
    this.benefitSaScreens = allBenefits.filter(benefit => benefit.productsForExclusiveBenefits.includes('SA'));
    this.benefitTrSaScreens = allBenefits.filter(benefit => benefit.productsForExclusiveBenefits.includes('SA')
      && benefit.productsForExclusiveBenefits.includes('TR'));
    this.benefitTrmSaScreens = allBenefits.filter(benefit => benefit.productsForExclusiveBenefits.includes('SA')
      && benefit.productsForExclusiveBenefits.includes('TRM'));
    this.ripleyPointsScreens = await this.campaignsEngineService.getScreensByTemplate('page-flex');
    this.route.queryParams.subscribe((params) => {
      if (params && params.copyId) {
        this.id = params.copyId;
        this.loadCampaign();
      }
    });
    this.onSegmentChanges();
  }

  get campaignId(): any {
    return this.welcomepackForm.get('id').value || '';
  }

  get filters(): any {
    return this.welcomepackForm.get('filters').value;
  }

  openEditTab(urlPath: string , id: string) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/${urlPath}`], { queryParams: { id } })
    );
    window.open(url, '_blank');
  }

  async loadBenefitPreview(type: BenefitPreview) {

    if (type === 'BENEFIT_SINGLE') {
      if (typeof this.singleBenefitScreen === 'undefined') {
        return;
      }
      this.previewTitle = 'Pantalla de beneficios';
      await this.setBenefitsPreview('singleBenefitScreen');
    } else if (type === 'BENEFIT_TR') {
      if (typeof this.trBenefitScreen === 'undefined') {
        return;
      }
      this.previewTitle = 'Pantalla de beneficios: TR';
      await this.setBenefitsPreview('trBenefitScreen');
    } else if (type === 'BENEFIT_TRM') {
      if (typeof this.trmBenefitScreen === 'undefined') {
        return;
      }
      this.previewTitle = 'Pantalla de beneficios: TR';
      await this.setBenefitsPreview('trmBenefitScreen');
    } else if (type === 'BENEFIT_SA') {
      if (typeof this.saBenefitScreen === 'undefined') {
        return;
      }
      this.previewTitle = 'Pantalla de beneficios: SA';
      await this.setBenefitsPreview('saBenefitScreen');
    } else if (type === 'BENEFIT_TR_SA') {
      if (typeof this.trSaBenefitScreen === 'undefined') {
        return;
      }
      this.previewTitle = 'Pantalla de beneficios: TR + SA';
      await this.setBenefitsPreview('trSaBenefitScreen');
    } else if (type === 'BENEFIT_TRM_SA') {
      if (typeof this.trmSaBenefitScreen === 'undefined') {
        return;
      }
      this.previewTitle = 'Pantalla de beneficios: TRM + SA';
      await this.setBenefitsPreview('trmSaBenefitScreen');
    } else  if (type === 'RIPLEY_POINTS_GO') {
      this.previewTitle = 'Pantalla de Ripley puntos go';
    } else {
      console.log(`Type ${type} is not handled.`);
    }
    this.selectedPreview = type;
  }

  async loadRipleyPointPreview() {
    try {
      /** @todo: add type */
      const { id } = this.ripleyPointScreen;
      this.ripleyPointScreen = await this.campaignsEngineService.getScreen(id);
      this.selectedPreview = 'RIPLEY_POINTS_GO';
    } catch (error) {
      console.log('Error loading ripley point preview');
    }
  }

  async setBenefitsPreview(benefitScreenKey: BenefitScreenKey) {
    try {
      const { id }: ICampaignScreen = this[benefitScreenKey];
      this[benefitScreenKey] = await this.campaignsEngineService.getScreen(id);
      const { benefits = [], normalBenefits = [] }: ICampaignScreen = this[benefitScreenKey];
      const sliderBenefitsFromFirestore = benefits.concat(normalBenefits);
      this.sliderBenefits = await this.getBenefits(sliderBenefitsFromFirestore);
      const { defaultBenefits }: ICampaignScreen = this[benefitScreenKey];
      this.listBenefits = await this.getBenefits(defaultBenefits);
    } catch (error) {
      console.log(`Error setting preiew's benefits: ${error}`);
    }
  }

  async getBenefits(sliderBenefitsFromFirestore) {
    const sortBenefitsByPriorityASC = (a, b) => a.priority - b.priority;
    const sliderBenefits = await this.loadBenefits(sliderBenefitsFromFirestore);
    return  sliderBenefits.sort(sortBenefitsByPriorityASC);
  }

  async loadBenefits(benefitsIds) {
    const benefitsRequests = benefitsIds.map(({ benefitId }) => this.benefitsService.getBenefitById(benefitId));
    /** @todo: ADD TYPES */
    const benefitsResults = await Promise.all(benefitsRequests);
    return this.buildBenefit(benefitsIds, benefitsResults);
  }

  async loadCardsWPPreview() {
    const sortBenefitsByOrderyASC = (a: any, b: any) => a.order - b.order;
    try {
      /** @todo: add type */
      const { id } = this.cardWPScreen;
      this.cardWPScreen = await this.campaignsEngineService.getScreen(id);

      const { items } = this.cardWPScreen;
      this.cardItems = items.sort(sortBenefitsByOrderyASC);

      this.selectedPreview = 'CARDS';
    } catch (error) {
      console.log('Error loading ripley point preview');
    }
  }

  /** @todo: ADD TYPES */
  buildBenefit(benefits, firestoreBenefits) {
    return benefits.map(({ benefitId, priority }) => {
      const originalBenefit = firestoreBenefits.find(activeBenefit => activeBenefit.id === benefitId);
      return { ...originalBenefit, priority };
    });
  }

  generateSingleWelcomepackPayload(id: string) {
    const cardsScreenId = this.cardWPScreen.id;
    const benefitScreenId = this.singleBenefitScreen.id;
    const ripleyPointsScreenId = this.ripleyPointScreen.id;
    return [{
      ...this.welcomepackForm.value,
      screens: [
        cardsScreenId,
        benefitScreenId,
        ripleyPointsScreenId
      ]
    }];
  }

  async createWelcomepacks() {
    try {
      const id = this.welcomepackForm.value.id.toLowerCase();
      const welcomepackPayload = this.generateWelcomepacksPayload(id);
      const welcomepackRequests = welcomepackPayload
        .map((campaign) => this.campaignsEngineService.addNewCampaign(campaign, this.campaignType));
      await Promise.all(welcomepackRequests);
      this.showModalWhenTransactionSaved('saveSuccessCampaign');
    } catch (error) {
      this.showModalWhenError();
      console.log(`Error creando welcomepack: ${error}`);
    }
  }

  showModalWhenTransactionSaved(modalType: string) {
    this.modalDialogService.openModal(modalType)
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.router.navigate(['/list-welcomepack-campaigns']);
        } else {
          this.welcomepackForm.reset();
        }
      });
  }

  showModalWhenError() {
    this.modalDialogService.openModal('genericError')
      .then((btnPressed) => {
        if (btnPressed === 'right') {
          this.router.navigate(['/home']);
        }
      });
  }

  generateWelcomepacksPayload(id: string): Array<any> {
    const welcomepackPayload = [];
    // @todo: cambiar rhe
    const cardsScreenId = this.cardWPScreen.id;
    const ripleyPointsScreenId = this.ripleyPointScreen.id;
    const baseId = this.generateBaseId(id);
    const welcomepackGroupId = baseId + '_group';
    if (this.hasTr) {
      const welcomepackForTr = {
        ...this.welcomepackForm.value,
        id: `${baseId}_tr`,
        filters: {
          ...this.welcomepackForm.value.filters,
          hasSA: false,
          hasTR: true,
          hasTRM: false
        },
        screens: [
          cardsScreenId,
          this.trBenefitScreen.id,
          ripleyPointsScreenId
        ]
      };
      welcomepackPayload.push(welcomepackForTr);
    }
    if (this.hasTrm) {
      const welcomepackForTrm = {
        ...this.welcomepackForm.value,
        id: `${baseId}_trm`,
        filters: {
          ...this.welcomepackForm.value.filters,
          hasSA: false,
          hasTR: false,
          hasTRM: true
        },
        screens: [
          cardsScreenId,
          this.trmBenefitScreen.id,
          ripleyPointsScreenId
        ]
      };
      welcomepackPayload.push(welcomepackForTrm);
    }
    if (this.hasSa) {
      const welcomepackForSa = {
        ...this.welcomepackForm.value,
        id: `${baseId}_sa`,
        filters: {
          ...this.welcomepackForm.value.filters,
          hasSA: true,
          hasTR: false,
          hasTRM: false
        },
        screens: [
          cardsScreenId,
          this.saBenefitScreen.id,
          ripleyPointsScreenId
        ]
      };
      welcomepackPayload.push(welcomepackForSa);
    }
    if (this.hasTrSa) {
      const welcomepackForTrSa = {
        ...this.welcomepackForm.value,
        id: `${baseId}_tr_sa`,
        filters: {
          ...this.welcomepackForm.value.filters,
          hasSA: true,
          hasTR: true,
          hasTRM: false
        },
        screens: [
          cardsScreenId,
          this.trSaBenefitScreen.id,
          ripleyPointsScreenId
        ]
      };
      welcomepackPayload.push(welcomepackForTrSa);
    }
    if (this.hasTrmSa) {
      const welcomepackForTrmSa = {
        ...this.welcomepackForm.value,
        id: `${baseId}_trm_sa`,
        filters: {
          ...this.welcomepackForm.value.filters,
          hasSA: true,
          hasTR: false,
          hasTRM: true
        },
        screens: [
          cardsScreenId,
          this.trmSaBenefitScreen.id,
          ripleyPointsScreenId
        ]
      };
      welcomepackPayload.push(welcomepackForTrmSa);
    }
    return welcomepackPayload
      .map(welcomepack => {
        const { productDateSA, productDateTR, productDateTRM } = welcomepack.filters;
        const  shouldUseNewProductsMark = productDateSA || productDateTR || productDateTRM;
        return {
          ...welcomepack,
          welcomepackGroupId,
          filters: {
            ...welcomepack.filters,
            useNewProductsMark: shouldUseNewProductsMark ? true : false
          }
        };
      });
  }

  receiveUrl(url: string, item: FormControl) {
    item.get('iconURL').setValue(url);
  }

  /** @todo: if this checkboxes are not needed (check it with Claudia) we can delete this logic */
  onSegmentChanges() {
    this.welcomepackForm.get('filters').get('segment')
      .valueChanges.subscribe(segment => {
        this.welcomepackForm.get('filters').get('segmentRipley').setValue(false);
        this.welcomepackForm.get('filters').get('segmentOne').setValue(false);
        this.welcomepackForm.get('filters').get('segmentBronze').setValue(false);
        this.welcomepackForm.get('filters').get('segmentSilver').setValue(false);
        this.welcomepackForm.get('filters').get('segmentGold').setValue(false);
        this.changeCategorySegmentsDisabledValue(segment);
      });
  }

  goBack() {
    this.location.back();
  }

  resetForm() {
    this.welcomepackForm.reset();
  }

  uploadIconText(i: number) {
    return `Cargar ícono elemento ${i + 1}`;
  }

  /** @todo: if this checkboxes are not needed (check it with Claudia) we can delete this logic */
  private changeCategorySegmentsDisabledValue(segment: boolean) {
    if (segment) {
      this.welcomepackForm.get('filters').get('segmentSilver').enable();
      this.welcomepackForm.get('filters').get('segmentRipley').enable();
      this.welcomepackForm.get('filters').get('segmentOne').enable();
      this.welcomepackForm.get('filters').get('segmentBronze').enable();
      this.welcomepackForm.get('filters').get('segmentGold').enable();
    } else {
      this.welcomepackForm.get('filters').get('segmentRipley').disable();
      this.welcomepackForm.get('filters').get('segmentOne').disable();
      this.welcomepackForm.get('filters').get('segmentBronze').disable();
      this.welcomepackForm.get('filters').get('segmentSilver').disable();
      this.welcomepackForm.get('filters').get('segmentGold').disable();
    }
  }

  private generateBaseId(id: string) {
    const baseIdRegex = /(_tr|_trm|_sa|_tr_sa|_trm_sa)$/gi;
    return id.replace(baseIdRegex, '');
  }

  private async loadSingleWelcomepack(welcomepack) {
    this.welcomepackForm.patchValue({
      id: welcomepack.id,
      priority: welcomepack.priority,
      maxGoals: welcomepack.maxGoals,
      maxViews: welcomepack.maxViews,
      filters: {
        startDate: welcomepack.filters.startDate.toDate(),
        endDate: welcomepack.filters.endDate.toDate()
      }
    });
    // Cards
    const cardScreen = welcomepack.screens[0] || '';
    if (cardScreen) {
      this.cardWPScreen = await this.campaignsEngineService.getScreen(cardScreen);
    }
    // Benefits
    const singleWelcomepackBenefitScreen = await this.campaignsEngineService.getScreen(welcomepack.screens[1]);
    this.singleBenefitScreen = singleWelcomepackBenefitScreen;
    this.isASingleWelcomepack = true;
    // Ripley points
    const ripleyPointsScreen = welcomepack.screens[2] || '';
    if (ripleyPointsScreen) {
      this.ripleyPointScreen = await this.campaignsEngineService.getScreen(ripleyPointsScreen);
    }
  }

  private async loadMultipleWelcomepack(campaign) {
    const welcomepacks = await this.campaignsEngineService.getWelcomepacksByGroupId(campaign.welcomepackGroupId);
    // if welcomepacks.length === 0 then it means that the welcomepack is really old
    // and it doesn't have a welcomepackGroupId.
    if (welcomepacks.length) {
      const [firstWelcomepack] = welcomepacks;
      // set general values
      const baseId = this.generateBaseId(firstWelcomepack.id);
      this.welcomepackForm.patchValue({
        id: baseId,
        priority: firstWelcomepack.priority,
        maxGoals: firstWelcomepack.maxGoals,
        maxViews: firstWelcomepack.maxViews,
        filters: {
          startDate: firstWelcomepack.filters.startDate.toDate(),
          endDate: firstWelcomepack.filters.endDate.toDate()
        }
      });
      // Cards
      const cardScreenId = firstWelcomepack.screens[0] || '';
      if (cardScreenId) {
        this.cardWPScreen = await this.campaignsEngineService.getScreen(cardScreenId);
      }
      // Set specif values by product
      // TR
      const trWelcomepackIdRegex = /_tr$/gi;
      const trWelcomepack = welcomepacks.find(({ id }) => trWelcomepackIdRegex.test(id));
      const trBenefitScreenId = trWelcomepack ? trWelcomepack.screens[1] : '';
      if (trBenefitScreenId) {
        this.hasTr = true;
        this.trBenefitScreen = await this.campaignsEngineService.getScreen(trBenefitScreenId);
      }
      // TRM
      const trmWelcomepackIdRegex = /_trm$/gi;
      const trmWelcomepack = welcomepacks.find(({ id }) => trmWelcomepackIdRegex.test(id));
      const trmBenefitScreenId = trmWelcomepack ? trmWelcomepack.screens[1] : '';
      if (trmBenefitScreenId) {
        this.hasTrm = true;
        this.trmBenefitScreen = await this.campaignsEngineService.getScreen(trmBenefitScreenId);
      }
      // SA
      const saWelcomepackIdRegex = /_sa$/gi;
      const saWelcomepack = welcomepacks.find(({ id }) => saWelcomepackIdRegex.test(id));
      const saBenefitScreenId = saWelcomepack ? saWelcomepack.screens[1] : '';
      if (saBenefitScreenId) {
        this.hasSa = true;
        this.saBenefitScreen = await this.campaignsEngineService.getScreen(saBenefitScreenId);
      }
      // TR_SA
      const trSaWelcomepackIdRegex = /_tr_sa$/gi;
      const trSaWelcomepack = welcomepacks.find(({ id }) => trSaWelcomepackIdRegex.test(id));
      const trSaBenefitScreenId = trSaWelcomepack ? trSaWelcomepack.screens[1] : '';
      if (trSaBenefitScreenId) {
        this.hasTrSa = true;
        this.trSaBenefitScreen = await this.campaignsEngineService.getScreen(trSaBenefitScreenId);
      }
      // TRM_SA
      const trmSaWelcomepackIdRegex = /_trm_sa$/gi;
      const trmSaWelcomepack = welcomepacks.find(({ id }) => trmSaWelcomepackIdRegex.test(id));
      const trmSaBenefitScreenId = trmSaWelcomepack ? trmSaWelcomepack.screens[1] : '';
      if (trmSaBenefitScreenId) {
        this.hasTrmSa = true;
        this.trmSaBenefitScreen = await this.campaignsEngineService.getScreen(trmSaBenefitScreenId);
      }
      // RIPLEY POINTS GO
      const ripleyPointsScreenId = firstWelcomepack.screens[2] || '';
      if (ripleyPointsScreenId) {
        this.ripleyPointScreen = await this.campaignsEngineService.getScreen(ripleyPointsScreenId);
      }
    }
  }

  private async loadCampaign() {
    try {
      /** @todo: add typing */
      const campaign = await this.campaignsEngineService.getCampaign(
        this.id,
        this.campaignType
      );

      if (!campaign.hasOwnProperty('welcomepackGroupId')) {
        await this.loadSingleWelcomepack(campaign);
      } else {
        await this.loadMultipleWelcomepack(campaign);
      }
      const { id, ...rest } = campaign;
      this.welcomepackForm.patchValue({
        ...rest,
        id: '',
        filters: {
          ...rest.filters,
          startDate: rest.filters.startDate.toDate(),
          endDate: rest.filters.endDate.toDate(),
          productDateEndSA: rest.filters.productDateEndSA.toDate(),
          productDateEndTR: rest.filters.productDateEndTR.toDate(),
          productDateEndTRM: rest.filters.productDateEndTRM.toDate(),
          productDateStartSA: rest.filters.productDateStartSA.toDate(),
          productDateStartTR: rest.filters.productDateStartTR.toDate(),
          productDateStartTRM: rest.filters.productDateStartTRM.toDate()
        }
      });
    } catch (error) {
      console.log(`Error loading welcomepacks ${error}`);
    }

  }
}
