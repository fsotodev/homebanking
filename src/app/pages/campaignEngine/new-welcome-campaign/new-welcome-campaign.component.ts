import { Component, OnInit } from '@angular/core';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CampaignsEngineService } from '@apps/services/campaigns-engine.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { cloneDeep } from 'lodash';
import { AuthFirebaseService } from '@apps/shared/services/auth/auth-firebase.service';
import { UtilsService } from '@apps/services/utils.service';
import { Utils } from '@apps/pages/shared-components/utils/utils';
import { CampaignType, TemplateType } from '@apps/models/types/types';
import { ICampaingWelcome } from '@apps/models/interfaces/campaing-welcome';
import * as moment from 'moment';

@Component({
  selector: 'app-new-welcome-campaign',
  templateUrl: './new-welcome-campaign.component.html',
  styleUrls: ['./new-welcome-campaign.component.scss']
})
export class NewWelcomeCampaignComponent implements OnInit {

  campaignForm: FormGroup;
  minimeForm: FormGroup;
  id: string;
  campaign: ICampaingWelcome;
  original = {
    id: '',
    type: 'welcome',
    totem: false,
    activePWA: false,
    isCustom: false,
    minime: false,
    priority: 0,
    maxViews: 0,
    maxGoals: 0,
    rutsFilePath: [],
    screens:[],
    withConfirmationBtn: false,
    withButton: false,
    filters:{
      allUsers: false,
      haveProductCondition: '',
      devices: {
        mobile: true,
        desktop: true,
      },
      platform: {
        on: false,
        nfc: false,
        allowedPlatforms: []
      },
      segment: false,
      segmentGold: false,
      segmentRipley: false,
      segmentOne: false,
      segmentBronze: false,
      segmentSilver: false,
      hasSA: false,
      hasCA: false,
      hasTR: false,
      hasTRM: false,
      startDate: moment(),
      endDate:  moment(),
      productDateSA: false,
      productDateStartSA: moment(),
      productDateEndSA: moment(),
      productDateTR: false,
      productDateStartTR:moment(),
      productDateEndTR:moment(),
      productDateTRM:false,
      productDateStartTRM: moment(),
      productDateEndTRM: moment()
    }} as ICampaingWelcome;
  isUploadingImage = false;
  uploadFolder = 'welcomeCampaignsImages';
  campaignType = 'welcome' as CampaignType;
  templateType = 'page-minime' as TemplateType;
  campaigns: any[];
  screens = [];
  allScreens = [];
  newScreenName: string;
  isCopy = false;
  screenId = '';
  previewScreen: any;
  showConfPreview = false;
  platformsList: string[] = ['iosApp', 'androidApp', 'iosWeb', 'androidWeb', 'desktop'];
  screenDefaultData = {
    details: {active: false},
    button: {show: false, backgroundColor: '#4f2d7f', color: '#ffffff'},
    confirmationBtn: {show: false, backgroundColor: '#4f2d7f', color: '#ffffff'}
  };
  imageFile = {
    desktop: {description: 'Dimensiones: 350 x 450px', text: 'Cargar imagen desktop*'},
    mobile: {description: 'Dimensiones: 250 x 158 px', text: 'Cargar imagen Mobile*'},
    extensions: ['svg', 'png', 'jpg', 'jpeg']
  };
  rutsFilePath: Array<string> = [];
  rutsArrayShort: Array<string> = [];
  toggleRutListShort: boolean;
  noToggle: boolean;
  disablePwa: boolean;
  redirection: string;

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private campaignsEngineService: CampaignsEngineService,
    private modalDialogService: ModalDialogService,
    public utils: Utils,
    public utilsService: UtilsService,
    private authService: AuthFirebaseService
  ) {
    this.cleanCampaign();
  }

  public get rutUploadingProgress(): number {
    return this.campaignsEngineService.rutUploadingProgress;
  }

  public get customCampaignsUploadingProgress(): number {
    return this.campaignsEngineService.customCampaignsUploadingProgress;
  }

  async ngOnInit() {
    this.campaignsEngineService.rutUploadingProgress = 0;
    if (this.campaign.isCustom) {
      this.setCustomValidationsForm();
    } else {
      this.setValidationsForm();
    }
    this.allScreens = await this.campaignsEngineService.getScreens();
    this.route.queryParams.subscribe((params) => {
      if (params) {
        if (params.id) {
          this.id = params.id;
          this.loadCampaign();
        } else if (params.copyId) {
          this.id = params.copyId;
          this.isCopy = true;
          this.loadCampaign().then(() => {
            this.campaign = this.campaignsEngineService.setCopiedCampaignDefaultData(this.campaign, this.id);
            this.id = undefined;
          });
        }
      }
    });
    this.campaigns = await this.campaignsEngineService.getCampaigns(this.campaignType);
    if (this.id && !this.isCopy) {
      this.campaignForm.controls['id'].setValue(this.id);
      this.disableIdField();
    }
  }

  public toggleCustomMinimeChange(event: MatSlideToggleChange) {
    this.cleanCampaign();
    this.campaign.isCustom = event.checked;
    this.campaign.filters.allUsers = false;
    this.imageFile.desktop.description = '';
    this.imageFile.desktop.text = 'Cargar imagen';
    if (this.campaign.isCustom) {
      this.setCustomValidationsForm();
    } else {
      this.setValidationsForm();
    }
  }

  idValidator() {
    if (this.campaigns) {
      return this.campaignsEngineService.campaignIdValidator(this.campaign.id, this.campaigns);
    }
    return true;
  }

  screenIdValidator(id: string) {
    if (this.screens && this.allScreens && id) {
      return this.campaignsEngineService.campaignIdValidator(id, [...this.screens, ...this.allScreens]);
    }
    return true;
  }

  goBack() {
    this.location.back();
  }

  /* eslint-disable max-len */
  async loadCampaign() {
    const campaign = await this.campaignsEngineService.getCampaign(this.id, this.campaignType);
    this.campaign = campaign;
    if (this.campaign.isCustom) {
      this.setCustomValidationsForm();
    } else {
      this.setValidationsForm();
    }
    this.campaign = this.utils.completeCampaing(this.original,this.campaign);
    this.campaign.filters.startDate = this.campaign.filters.startDate ? this.campaign.filters.startDate.toDate() : undefined;
    this.campaign.filters.endDate = this.campaign.filters.endDate ? this.campaign.filters.endDate.toDate() : undefined;
    this.campaign.filters.productDateStartSA = this.campaign.filters.productDateStartSA ? this.campaign.filters.productDateStartSA.toDate() : undefined;
    this.campaign.filters.productDateStartTR = this.campaign.filters.productDateStartTR ? this.campaign.filters.productDateStartTR.toDate() : undefined;
    this.campaign.filters.productDateStartTRM = this.campaign.filters.productDateStartTRM ? this.campaign.filters.productDateStartTRM.toDate() : undefined;
    this.campaign.filters.productDateEndSA = this.campaign.filters.productDateEndSA ? this.campaign.filters.productDateEndSA.toDate() : undefined;
    this.campaign.filters.productDateEndTR = this.campaign.filters.productDateEndTR ? this.campaign.filters.productDateEndTR.toDate() : undefined;
    this.campaign.filters.productDateEndTRM = this.campaign.filters.productDateEndTRM ? this.campaign.filters.productDateEndTRM.toDate() : undefined;
    this.campaignForm.controls.productType.setValue('productType');
    if (this.campaign.rutsFilePath) {
      this.createWelcomeRutsList(this.campaign.rutsFilePath);
    } else {
      this.createWelcomeRutsList([]);
    }

    if (campaign.screens) {
      if (this.isCopy && campaign.screens.length > 0) {
        await this.loadScreens(campaign.screens);
        this.modalDialogService.openModal('changeScreenName', this.allScreens).then(res => {
          this.newScreenName = res;
          this.changeScreenName(this.newScreenName);
        });
      } else {
        await this.loadScreens(campaign.screens);
      }
    }
    this.minimeForm.controls.imageURLDesktop.setValue(this.previewScreen.imageURLDesktop);
    this.minimeForm.controls.imageURL.setValue(this.previewScreen.imageURL);
    this.minimeForm.controls.pagePWA.setValue(this.screens[0].pagePWA);

    if (this.previewScreen.confirmationBtn && this.previewScreen.confirmationBtn.show) {
      this.minimeForm.controls['pagePWA'].clearValidators();
      this.minimeForm.controls['pagePWA'].updateValueAndValidity({emitEvent: true});
      this.minimeForm.controls['pagePWA'].setValidators([
        Validators.maxLength(2000),
        Validators.minLength(1)]);
      this.minimeForm.controls['pagePWA'].updateValueAndValidity({emitEvent: true});
    }
  }

  changeScreenName(name) {
    this.screens[0].id = name;
    this.campaign.screens[0] = name;
    this.rutsFilePath = [];
    this.campaign.updatedAt = new Date();
  }

  async loadScreens(screens: string[]) {
    for (const screen of screens) {
      const screenToPush = this.allScreens.find(s => s.id === screen);
      if (screenToPush) {
        const firestoreScreen = await this.campaignsEngineService.getScreen(screen);
        if (!firestoreScreen.confirmationBtn) {
          firestoreScreen.confirmationBtn = {show: false, backgroundColor: '#4f2d7f', color: '#ffffff'};
        }
        if (!firestoreScreen.button) {
          firestoreScreen.button = cloneDeep(this.screenDefaultData.button);
        }
        this.screens.push(firestoreScreen);
        this.findRedirectionUrl();
      } else {
        console.error('ERROR: Unexistent screen', screen);
      }
    }
    if (this.screens.length) {
      this.setPreview(this.screens[0]);
      this.disablePwa = true;
    }
  }

  receiveUrl(url: string, inputControl: 'mobileUrl' | 'desktopUrl', screen) {
    const control = inputControl === 'mobileUrl' ? 'imageURL' : 'imageURLDesktop';
    this.minimeForm.controls[control].setValue(url);
    this.minimeForm[control] = url;
    screen[control] = url;
  }

  receiveConfirmationUrl(url: string, inputControl: 'mobileUrl' | 'desktopUrl', screen) {
    const control = inputControl === 'mobileUrl' ? 'confirmationImageURL' : 'confirmationImageURLDesktop';
    this.minimeForm.controls[control].setValue(url);
    this.minimeForm[control] = url;
    screen[control] = url;
  }

  atLeastOneProduct() {
    const productTypeList = [];
    productTypeList.push(this.campaign.filters.hasSA);
    productTypeList.push(this.campaign.filters.hasCA);
    productTypeList.push(this.campaign.filters.hasTR);
    productTypeList.push(this.campaign.filters.hasTRM);
    productTypeList.every(e => {
      if (e) {
        this.campaignForm.controls.productType.setValue('productType');
        return false;
      }
      this.campaignForm.controls.productType.setValue('');
      return true;
    });
  }

  onPagePWAChange() {
    this.minimeForm.controls.pagePWA.setValue(this.redirection);
    if (this.minimeForm.controls.pagePWA.value === 'external') {
      this.disablePwa = false;
      this.screens[0].pagePWA = '';
      this.minimeForm.controls.pagePWA.setValue('');
    } else {
      this.screens[0].pagePWA = this.redirection;
      this.disablePwa = true;
    }
  }

  onUrlPageChange() {
    this.minimeForm.controls.pagePWA.setValue(this.screens[0].pagePWA);
  }

  saveCampaign() {
    this.customTemplate();
    this.campaign.withButton = this.previewScreen.button && this.previewScreen.button.show;
    this.campaign.withConfirmationBtn = this.previewScreen.confirmationBtn && this.previewScreen.confirmationBtn.show;
    Promise.all([
      this.campaignsEngineService.addNewScreen(this.previewScreen, this.templateType),
      this.campaignsEngineService.addNewCampaign(this.campaign, this.campaignType),
    ]).then(() => {
      localStorage.removeItem('welcomeId');
      this.showModalWhenTransactionSaved('saveSuccessCampaign');
    })
      .catch(() => {
        this.showModalWhenError();
      });
  }

  updateCampaign() {
    this.customTemplate();
    this.campaign.withButton = this.previewScreen.button && this.previewScreen.button.show;
    this.campaign.withConfirmationBtn = this.previewScreen.confirmationBtn && this.previewScreen.confirmationBtn.show;
    Promise.all([
      this.campaignsEngineService.addNewScreen(this.previewScreen, this.templateType),
      this.campaignsEngineService.updateCampaign(this.id, this.campaign, this.campaignType)
    ]).then(() => {
      localStorage.removeItem('welcomeId');
      this.showModalWhenTransactionSaved('updateSuccessCampaign');
    })
      .catch((error) => {
        console.error(error);
        this.showModalWhenError();
      });
  }

  customTemplate() {
    if (this.campaign.isCustom) {
      this.templateType = 'page-custom-minime';
      this.previewScreen.button.show = true;
    }
  }

  showModalWhenTransactionSaved(modalType: string) {
    this.modalDialogService.openModal(modalType)
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.router.navigate([this.utils.pathHomeCampaign], {fragment: this.campaignType});
        } else {
          this.cleanCampaign();
        }
      });
  }

  showModalWhenError() {
    this.modalDialogService.openModal('genericError')
      .then((btnPressed) => {
        if (btnPressed === 'right') {
          this.router.navigate([this.utils.pathHomeCampaign], {fragment: this.campaignType});
        }
      });
  }

  cleanCampaign() {
    this.screens = [];
    this.campaign = {
      type: 'welcome' as CampaignType,
      id:'',
      allowSwipeToPrev: false,
      allowTouchMove: false,
      pager: {
        hidden: true
      },
      active: false,
      activePWA: false,
      minime: true,
      isCustom: false,
      filters: {
        allUsers: false,
        devices: {
          mobile: true,
          desktop: true
        },
        segment: false,
        segmentGold: false,
        segmentRipley: false,
        segmentOne: false,
        segmentBronze: false,
        segmentSilver: false,
        hasSA: false,
        hasCA: false,
        hasTR: false,
        hasTRM: false,
        productDateSA: false,
        productDateTR: false,
        productDateTRM: false,
        productDateStartSA: new Date(2020, 1, 1),
        productDateStartTR: new Date(2020, 1, 1),
        productDateStartTRM: new Date(2020, 1, 1),
        productDateEndSA: new Date(2020, 1, 1),
        productDateEndTR: new Date(2020, 1, 1),
        productDateEndTRM: new Date(2020, 1, 1),
        platform: {
          on: false,
          nfc: false,
          allowedPlatforms: []
        }
      },
      screens: [],
    } as any;

    this.previewScreen = {
      imageURL: undefined,
      imageURLDesktop: undefined,
      confirmationImageURL: undefined,
      confirmationImageURLDesktop: undefined
    };
    this.showConfPreview = false;
  }

  async initializeCampaignById() {
    const newVal = this.utilsService.cleanValue(this.campaignForm.get('id').value);
    this.campaignForm.get('id').setValue(newVal);
    this.campaignForm.get('id').updateValueAndValidity({emitEvent:true});
    if (this.campaignForm.get('id').value !== localStorage.getItem('welcomeId')) {
      if (!this.idValidator() && localStorage.getItem('welcomeId')) {
        await this.campaignsEngineService.removeCampaignById(localStorage.getItem('welcomeId'), 'welcomeCampaigns');
        localStorage.removeItem('welcomeId');
      }
      if (!this.idValidator() && this.campaignForm.get('id').value) {
        if (!this.isCopy) {
          this.cleanCampaign();
          this.campaign.priority = 0;
        }
        this.campaign.id = this.campaignForm.get('id').value;
        await this.campaignsEngineService.initializeCampaignById(this.campaign, this.campaignForm.get('id').value, 'welcomeCampaigns');
        localStorage.setItem('welcomeId', this.campaignForm.get('id').value);
      }
    }
    this.disableIdField();
    this.campaign.priority = undefined;
  }

  disableIdField() {
    if (this.campaignForm.get('id').value) {
      this.campaignForm.controls['id'].disable({onlySelf: true});
    }
  }

  addScreen(newId) {
    this.campaign.screens.push(newId);
    this.screens.push({
      id: newId,
      ...cloneDeep(this.screenDefaultData)
    });
  }

  setPreview(screen: any) {
    this.previewScreen = screen;
    if (this.previewScreen.confirmationBtn.show) {
      this.showConfPreview = true;
    }
  }

  showModalConfirmation(event: FileList, isRut: boolean) {
    this.modalDialogService.openModal('confirmation')
      .then((btnPressed) => {
        if (btnPressed === 'right' && isRut) {
          this.uploadCampaignRuts(event);
          if (this.campaign.isCustom) {
            (document.getElementById('uploadInputCustomCampaign') as HTMLInputElement).value = '';
          } else {
            (document.getElementById('uploadInputCampaignRut') as HTMLInputElement).value = '';
          }
        } else if (!isRut) {
          (document.getElementById('uploadInput') as HTMLInputElement).value = '';
        } else if (isRut) {
          (document.getElementById('uploadInputCampaignRut') as HTMLInputElement).value = '';
        }
      });
  }

  get uploadingRuts() {
    return this.campaignsEngineService.uploadingRuts;
  }

  get uploadedCustomCampaign() {
    return this.campaignsEngineService.uploadedCustomCampaign;
  }

  get uploadingCustomCampaigns() {
    return this.campaignsEngineService.uploadingCustomCampaigns;
  }

  async uploadCampaignRuts(event: FileList) {
    try {
      if (this.campaign.isCustom) {
        await this.campaignsEngineService.uploadCustomCampaign(event, this.campaign.id, this.campaignType);
      } else {
        const fileName = event[0].name;
        await this.campaignsEngineService.uploadCampaignRuts(event, this.campaign.id, this.campaignType);
        this.updateRutsFilePath(fileName);
      }
    } catch (error) {
      console.error('ERROR: ', error);
      if (error && error.type && error.type === 'rutBadFormat') {
        await this.modalDialogService.openModal(error.type);
      } else {
        await this.modalDialogService.openModal('csvUploadError');
      }
      this.campaignsEngineService.uploadingRuts = false;
    }
  }

  platformFilterChange(event: MatCheckboxChange): void {
    if (!event.checked) {
      this.campaign.filters.platform.nfc = false;
      this.campaign.filters.platform.allowedPlatforms = [];
    }
  }

  public getHtmlContent(html) {
    return !!html ? html.replace(/<\/?[^>]+(>|$)/g, '') : '';
  }

  clearConfirmationBtn() {
    if (this.previewScreen.confirmationBtn) {
      this.previewScreen.confirmationBtn.show = false;
    }
    this.showConfPreview = false;
  }

  clearPagePWA(event) {
    this.showConfPreview = event;
    this.previewScreen.pagePWA = '';
    this.previewScreen.paramsPWA = '';
  }

  createWelcomeRutsList(array) {
    if (array.length <= 3) {
      this.noToggle = true;
      this.rutsFilePath = array;
    } else {
      this.noToggle = false;
      this.toggleRutListShort = true;
      this.rutsArrayShort = array.slice(0, 3);
      this.rutsFilePath = array;
    }
  }

  toggleRutListMethod() {
    this.toggleRutListShort = !this.toggleRutListShort;
    return false;
  }

  async updateRutsFilePath(name) {
    const userInfo = await this.authService.userInfo();
    if (!this.campaign.rutsFilePath) {
      this.campaign = {...this.campaign, rutsFilePath: []};
    }
    this.campaign.rutsFilePath.unshift(this.utilsService.generateFileRutName(name, userInfo.displayName.toLocaleLowerCase()));
    this.campaignsEngineService.updateCampaign(this.campaign.id, {
      activePWA: this.campaign.activePWA,
      rutsFilePath: this.campaign.rutsFilePath
    }, this.campaignType)
      .then((res) => {
        this.createWelcomeRutsList(this.campaign.rutsFilePath);
      })
      .catch((error) => {
        console.error(error);
        this.showModalWhenError();
      });

  }

  private setValidationsForm() {
    this.campaignForm = new FormGroup({
      id: new FormControl('',
        Validators.compose([
          Validators.maxLength(35),
          Validators.minLength(1),
          Validators.required])),
      priority: new FormControl('',
        Validators.compose([
          Validators.required])),
      maxGoals: new FormControl('',
        Validators.compose([
          Validators.required])),
      maxViews: new FormControl(''),
      startDate: new FormControl('',
        Validators.compose([
          Validators.required])),
      endDate: new FormControl('',
        Validators.compose([
          Validators.required])),
      haveProductCondition: new FormControl('',
        Validators.compose([
          Validators.maxLength(3),
          Validators.minLength(1),
          Validators.required])),
      amount: new FormControl('',
        Validators.compose([])),
      quota: new FormControl('',
        Validators.compose([])),
      backgroundColor: new FormControl('',
        Validators.compose([
          Validators.maxLength(7),
          Validators.minLength(7)])),
      color: new FormControl('',
        Validators.compose([
          Validators.maxLength(7),
          Validators.minLength(7)])),
      buttonText: new FormControl('',
        Validators.compose([
          Validators.maxLength(40),
          Validators.minLength(1)])),
      confirmationBackColor: new FormControl('',
        Validators.compose([
          Validators.maxLength(7),
          Validators.minLength(7)])),
      confirmationColor: new FormControl('',
        Validators.compose([
          Validators.maxLength(7),
          Validators.minLength(7)])),
      productType: new FormControl('', Validators.required)
    });

    this.minimeForm = new FormGroup({
      imageURL: new FormControl('',
        Validators.compose([Validators.required])),
      imageURLDesktop: new FormControl('',
        Validators.compose([Validators.required])),
      confirmationImageURL: new FormControl('',
        Validators.compose([])),
      confirmationImageURLDesktop: new FormControl('',
        Validators.compose([])),
      pagePWA: new FormControl('',
        Validators.compose([
          Validators.maxLength(2000),
          Validators.minLength(1),
          Validators.required])),
      maxViews: new FormControl(''),
    });
  }

  private setCustomValidationsForm() {
    this.campaignForm = new FormGroup({
      id: new FormControl('',
        Validators.compose([
          Validators.maxLength(35),
          Validators.minLength(1),
          Validators.required])),
      priority: new FormControl('',
        Validators.compose([
          Validators.required])),
      maxViews: new FormControl(''),
      maxGoals: new FormControl('',
        Validators.compose([
          Validators.required])),
      startDate: new FormControl('',
        Validators.compose([
          Validators.required])),
      endDate: new FormControl('',
        Validators.compose([
          Validators.required])),
      backgroundColor: new FormControl('',
        Validators.compose([
          Validators.maxLength(7),
          Validators.minLength(7)])),
      color: new FormControl('',
        Validators.compose([
          Validators.maxLength(7),
          Validators.minLength(7)])),
      buttonText: new FormControl('',
        Validators.compose([
          Validators.maxLength(40),
          Validators.minLength(1),
          Validators.required])),
    });
  }

  private findRedirectionUrl() {
    const urlList = ['av', 'sav', 'avsav', 'sg', '/home/beneficios', 'nsa', 'benefit-detail', 'sa', 'acc',
      'cc', 'hdap', 'sdap', 'update', 'credit', 'pay', 'reissue', 'dashboard-rpgo'];
    const url = urlList.includes(this.screens[0].pagePWA);
    if (!url) {
      this.redirection = 'external';
    } else {
      this.redirection = this.screens[0].pagePWA;
    }
  }
}
