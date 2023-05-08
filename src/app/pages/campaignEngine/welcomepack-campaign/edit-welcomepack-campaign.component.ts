import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ICampaignScreen } from '@apps/models/interfaces/campaign-screen';
import { Utils } from '@apps/pages/shared-components/utils/utils';
import { BenefitsService } from '@apps/services/benefits.service';
import { CampaignsEngineService } from '@apps/services/campaigns-engine.service';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { Location } from '@angular/common';
import { CampaignType } from '@apps/models/types/types';
import { CampaignProducts } from '@apps/models/campaign';

type Cards = 'CARDS';
type BenefitPreview = 'BENEFIT_TR' | 'BENEFIT_TRM' | 'BENEFIT_SA' | 'BENEFIT_TR_SA' | 'BENEFIT_TRM_SA' | 'BENEFIT_SINGLE';
type RipleyPointsGOPreview = 'RIPLEY_POINTS_GO';
type BenefitScreenKey =
  'trBenefitScreen' | 'trmBenefitScreen' | 'saBenefitScreen' | 'trSaBenefitScreen' | 'trmSaBenefitScreen' | 'singleBenefitScreen';

const baseIdValidator = (campaignsEngineService: CampaignsEngineService): AsyncValidatorFn =>
  (ctrl: AbstractControl) => campaignsEngineService.checkIfWelcomepackExists(ctrl.value)
    .then(result => result ? null : {baseIdUsed: 'Este id ya está en uso'})
    .catch(err => {
      console.log(`Error checking if document exists: \n${err}`);
      return {benefitExistance: 'No se pudo verificar el id'};
    });

@Component({
  selector: 'app-edit-welcomepack-campaign',
  templateUrl: './edit-welcomepack-campaign.component.html',
  styleUrls: ['./edit-welcomepack-campaign.component.scss']
})
export class EditWelcomepackCampaignComponent implements OnInit {
    welcomepackForm: FormGroup;
    campaignType = 'welcome' as CampaignType;
    extensions = ['svg', 'png', 'jpg', 'jpeg'];
    isUploadingImage = false;
    isLoading = false;
    isEditing: boolean;
    id: string;
    benefitScreens = [];
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
    hasSA = false;
    hasTR = false;
    hasTRM = false;
    productsConditionText: string;
    hasProductsConfigured = false;

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

    async ngOnInit(): Promise<void> {
      this.isLoading = true;
      this.campaignsEngineService.rutUploadingProgress = 0;
      this.welcomepackForm = this.formBuilder.group({
        active: true,
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
          updateOn: 'blur'
        }],
        offerModal: [false, Validators.required],
        priority: ['', Validators.required],
        maxGoals: ['', Validators.required],
        maxViews: [''],
        allowTouchMove: true,
        allowSwipeToPrev: true,
        allowSwipeToNext: true,
        timeout: 200000
      });

      this.cardWPScreens = await this.campaignsEngineService.getScreensByTemplate('page-cards-welcomepack');
      this.benefitScreens = await this.campaignsEngineService.getScreensByTemplate('page-benefits-welcomepack');
      this.ripleyPointsScreens = await this.campaignsEngineService.getScreensByTemplate('page-flex');

      this.route.queryParams.subscribe((params) => {
        if (params && params.id) {
          this.welcomepackForm.get('id').disable();
          this.id = params.id;
          this.loadCampaign();
        }
      });
    }


    async loadCardsWPPreview() {
      const sortBenefitsByOrderyASC = (a: any, b: any) => a.order - b.order;
      try {
        /** @todo: add type */
        const { id } = this.cardWPScreen;
        this.cardWPScreen = await this.campaignsEngineService.getScreen(id);
        const {items} = this.cardWPScreen;
        this.cardItems = items.sort(sortBenefitsByOrderyASC);
        this.selectedPreview = 'CARDS';
      } catch (error) {
        console.log('Error loading ripley point preview');
      }
    }

    get welcomepackId(): any {
      return this.welcomepackForm.get('id') || '';
    }

    get filters(): any {
      const control = 'filters';
      if (this.welcomepackForm.contains(control)) {
        return this.welcomepackForm.get(control).value;
      }
      return null;
    }

    get uploadingRuts() {
      return this.campaignsEngineService.uploadingRuts;
    }

    get rutUploadingProgress(): number {
      return this.campaignsEngineService.rutUploadingProgress;
    }

    openEditTab(urlPath: string, id: string) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree([`/${urlPath}`], {queryParams: {id}})
      );
      window.open(url, '_blank');
    }

    openModalConfirmation(event: FileList, isRut: boolean, modalType) {
      this.modalDialogService.openModal(modalType)
        .then(btnPressed => {
          if (btnPressed === 'right' && isRut) {
            this.uploadCampaignRuts(event);
            (document.getElementById('uploadInputCampaignRut') as HTMLInputElement).value = '';
          } else if (!isRut) {
            (document.getElementById('uploadInput') as HTMLInputElement).value = '';
          } else if (isRut) {
            (document.getElementById('uploadInputCampaignRut') as HTMLInputElement).value = '';
          }
        });
    }

    uploadCampaignRuts(event: FileList) {
      const cards: CampaignProducts = new CampaignProducts();
      cards.hasSA = !!this.hasSA;
      cards.hasTR = !!this.hasTR;
      cards.hasTRM = !!this.hasTRM;
      this.campaignsEngineService.uploadCampaignRuts(event, this.id, this.campaignType, cards)
        .catch((error) => {
          console.error('ERROR: ', error);
          this.modalDialogService.openModal('csvUploadError');
          this.campaignsEngineService.uploadingRuts = false;
        });
    }

    async setBenefitsPreview(benefitScreenKey: BenefitScreenKey) {
      try {
        const {id}: ICampaignScreen = this[benefitScreenKey];
        this[benefitScreenKey] = await this.campaignsEngineService.getScreen(id);
        const {benefits = [], normalBenefits = []}: ICampaignScreen = this[benefitScreenKey];
        const sliderBenefitsFromFirestore = benefits.concat(normalBenefits);
        this.sliderBenefits = await this.getBenefits(sliderBenefitsFromFirestore);
        const {defaultBenefits}: ICampaignScreen = this[benefitScreenKey];
        this.listBenefits = await this.getBenefits(defaultBenefits);
      } catch (error) {
        console.log(`Error setting preview's benefits: ${error}`);
      }
    }

    async getBenefits(sliderBenefitsFromFirestore) {
      const sortBenefitsByPriorityASC = (a, b) => a.priority - b.priority;
      const sliderBenefits = await this.loadBenefits(sliderBenefitsFromFirestore);
      return sliderBenefits.sort(sortBenefitsByPriorityASC);
    }

    /** @todo: ADD TYPES */
    buildBenefit(benefits, firestoreBenefits) {
      return benefits.map(({benefitId, priority}) => {
        const originalBenefit = firestoreBenefits.find(activeBenefit => activeBenefit.id === benefitId);
        return {...originalBenefit, priority};
      });
    }

    async loadBenefits(benefitsIds) {
      const benefitsRequests = benefitsIds.map(({benefitId}) => this.benefitsService.getBenefitById(benefitId));
      /** @todo: ADD TYPES */
      const benefitsResults = await Promise.all(benefitsRequests);
      return this.buildBenefit(benefitsIds, benefitsResults);
    }

    async loadBenefitPreview(type: BenefitPreview) {
      if (type === 'BENEFIT_SINGLE') {
        if (typeof this.singleBenefitScreen === 'undefined') {
          return;
        }
        this.previewTitle = 'Pantalla de beneficios';
        await this.setBenefitsPreview('singleBenefitScreen');
      } else {
        console.log(`Type ${type} is not handled.`);
      }
      this.selectedPreview = type;
    }

    async loadRipleyPointPreview() {
      try {
        /** @todo: add type */
        const {id} = this.ripleyPointScreen;
        this.ripleyPointScreen = await this.campaignsEngineService.getScreen(id);
        this.selectedPreview = 'RIPLEY_POINTS_GO';
      } catch (error) {
        console.log('Error loading ripley point preview');
      }
    }

    async updateWelcomepack() {
      try {
        const id = this.id;
        const cardWPScreenId = this.cardWPScreen.id;
        const benefitScreenId = this.singleBenefitScreen.id;
        const ripleyPointScreenId = this.ripleyPointScreen.id;
        const updatedWelcomepack = {
          ...this.welcomepackForm.value,
          screens: [
            cardWPScreenId,
            benefitScreenId,
            ripleyPointScreenId
          ],
          filters: {
            ...this.welcomepackForm.value.filters,
          }
        };
        await this.campaignsEngineService.updateCampaign(id, updatedWelcomepack, this.campaignType);
        this.showModalWhenTransactionSaved('updateSuccessCampaign');
      } catch (error) {
        this.showModalWhenError();
        console.log(`Error actualizando welcomepack: ${error}`);
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

    goBack() {
      this.location.back();
    }

    private async loadSingleWelcomepack(welcomepack) {
      this.welcomepackForm.patchValue({
        ...welcomepack,
        filters: {
          ...welcomepack.filters,
          startDate: welcomepack.filters.startDate.toDate(),
          endDate: welcomepack.filters.endDate.toDate(),
          productDateEndSA: welcomepack.filters.productDateEndSA.toDate() || new Date(2020, 1, 1),
          productDateEndTR: welcomepack.filters.productDateEndTR.toDate() || new Date(2020, 1, 1),
          productDateEndTRM: welcomepack.filters.productDateEndTRM.toDate() || new Date(2020, 1, 1),
          productDateStartSA: welcomepack.filters.productDateStartSA.toDate() || new Date(2020, 1, 1),
          productDateStartTR: welcomepack.filters.productDateStartTR.toDate() || new Date(2020, 1, 1),
          productDateStartTRM: welcomepack.filters.productDateStartTRM.toDate() || new Date(2020, 1, 1),
        }
      });
      // Cards
      const cardScreen = welcomepack.screens[0] || '';
      if (cardScreen) {
        this.cardWPScreen = await this.campaignsEngineService.getScreen(cardScreen);
      }
      // Benefits
      this.singleBenefitScreen = await this.campaignsEngineService.getScreen(welcomepack.screens[1]);
      // Ripley points
      const ripleyPointsScreen = welcomepack.screens[2] || '';
      if (ripleyPointsScreen) {
        this.ripleyPointScreen = await this.campaignsEngineService.getScreen(ripleyPointsScreen);
      }
    }

    private async loadCampaign() {
      try {
        /** @todo: add typing */
        const campaign = await this.campaignsEngineService.getCampaign(
          this.id,
          this.campaignType
        );
        console.log('base', campaign);
        await this.loadSingleWelcomepack(campaign);
        this.hasSA = campaign.filters.hasSA;
        this.hasTR = campaign.filters.hasTR;
        this.hasTRM = campaign.filters.hasTRM;
        this.productsConditionText = campaign.filters.haveProductCondition === 'or' ? 'ALGUNO de' : 'TODOS';
        this.hasProductsConfigured = this.hasSA || this.hasTR || this.hasTRM;
        this.isLoading = false;
      } catch (error) {
        console.log(`Error loading welcomepacks ${error}`);
        this.isLoading = false;
      }
    }

}
