import { Component, OnInit } from '@angular/core';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CampaignsEngineService } from '@apps/services/campaigns-engine.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { UtilsService } from '@apps/services/utils.service';
import { Utils } from '@apps/pages/shared-components/utils/utils';
import { AuthFirebaseService } from '@apps/shared/services/auth/auth-firebase.service';
import { CampaignType } from '@apps/models/types/types';
import { ICampaingSlider } from '@apps/models/interfaces/campaign-slider';

@Component({
  selector: 'app-new-slider-campaign',
  templateUrl: './new-slider-campaign.component.html',
  styleUrls: ['./new-slider-campaign.component.scss']
})
export class NewSliderCampaignComponent implements OnInit {

  campaignForm: FormGroup;
  id: string;
  campaign: ICampaingSlider;
  original = {
    id: '',
    type: 'slider' as CampaignType,
    totem: false,
    activePWA: false,
    isCustom:  false,
    priority: 0,
    maxViews: 0,
    goalType: '',
    maxGoals: 0,
    textColor: '',
    buttonColor: '',
    buttonText: '',
    page: '',
    params: '',
    mobileUrl: '',
    desktopUrl: '',
    details: {
      active: false,
      details: {active: false},
      amount: 0,
      quota: 0},
    rutsFilePath: [],
    filters: {
      allUsers: false,
      haveProductCondition: '',
      av: {
        active: false,
        max: 0,
        min: 0,
      },
      sav: {
        active: false,
        max: 0,
        min: 0,
      },
      consumer: {
        active: false,
        max: 0,
        min: 0,
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
      devices: {
        mobile: true,
        desktop: true,
      },
      platform: {
        on: false,
        nfc: false,
        allowedPlatforms: []
      }
    }} as ICampaingSlider;
  extensions = ['svg', 'png', 'jpg', 'jpeg'];
  isUploadingImage = false;
  fileFirebaseUrl: string;
  fileUrl: string;
  uploadFolder = 'sliderCampaignsImages';
  campaignType = 'slider' as CampaignType;
  campaigns: any[];
  platformsList: string[] = ['iosApp', 'androidApp', 'iosWeb', 'androidWeb', 'desktop'];
  rutsFilePath: Array<string> = [];
  rutsArrayShort: Array<string> = [];
  toggleRutListShort: boolean;
  noToggle: boolean;
  isCopy = false;
  emptyMobile = false;
  emptyDesktop = false;
  isValidDevices = true;
  isValidProducts = true;

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private campaignsEngineService: CampaignsEngineService,
    private modalService: ModalDialogService,
    public utils: Utils,
    public utilsService: UtilsService,
    private authService: AuthFirebaseService
  ) {
    this.cleanCampaign();
    this.route.queryParams.subscribe((params) => {
      if (params) {
        if (params.id) {
          this.id = params.id;
          this.loadCampaign().then(() => { });
        } else if (params.copyId) {
          this.isCopy = true;
          this.id = params.copyId;
          this.loadCampaign().then(() => {
            this.campaign = this.campaignsEngineService.setCopiedCampaignDefaultData(this.campaign, this.id);
            this.rutsFilePath = [];
            this.id = undefined;
          });
        }
      }
    });
  }

  public get rutUploadingProgress(): number {
    return this.campaignsEngineService.rutUploadingProgress;
  }

  public get customCampaignsUploadingProgress(): number {
    return this.campaignsEngineService.customCampaignsUploadingProgress;
  }

  async ngOnInit() {
    this.campaignsEngineService.rutUploadingProgress = 0;
    this.setValidationsForm();
    this.campaigns = await this.campaignsEngineService.getCampaigns(this.campaignType);
    if (this.id && !this.isCopy) {
      this.campaignForm.controls['id'].setValue(this.id);
      this.disableIdField();
    }
  }

  public setValidationsForm() {
    if (!this.campaign.isCustom) {
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
        amount: new FormControl('',
          Validators.compose([])),
        quota: new FormControl('',
          Validators.compose([])),
        textColor: new FormControl('',
          Validators.compose([
            Validators.maxLength(7),
            Validators.minLength(7),
            Validators.required])),
        buttonColor: new FormControl('',
          Validators.compose([
            Validators.maxLength(7),
            Validators.minLength(7),
            Validators.required])),
        buttonText: new FormControl('',
          Validators.compose([
            Validators.maxLength(20),
            Validators.minLength(1),
            Validators.required])),
        page: new FormControl('',
          Validators.compose([
            Validators.maxLength(2000),
            Validators.minLength(1),
            Validators.required])),
        params: new FormControl('',
          Validators.compose([
            Validators.maxLength(2000)])),
        mobileUrl: new FormControl('',
          Validators.compose([
            Validators.maxLength(2000),
            Validators.minLength(1),
            Validators.required])),
        desktopUrl: new FormControl('',
          Validators.compose([
            Validators.maxLength(2000),
            Validators.minLength(1),
            Validators.required])),
        avMax: new FormControl('',
          Validators.compose([])),
        avMin: new FormControl('',
          Validators.compose([])),
        savMax: new FormControl('',
          Validators.compose([])),
        savMin: new FormControl('',
          Validators.compose([])),
        consumerMax: new FormControl('',
          Validators.compose([])),
        consumerMin: new FormControl('',
          Validators.compose([])),
        haveProductCondition: new FormControl('',
          Validators.compose([Validators.required])),
        goalType: new FormControl('', []),
        maxGoals: new FormControl(''),
        fieldCheckProducts: new FormControl(''),
        fieldCheckDevices:  new FormControl(true, [Validators.requiredTrue]),
        checkCustom: new FormControl('')
      });
    } else {
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
        textColor: new FormControl('',
          Validators.compose([
            Validators.maxLength(7),
            Validators.minLength(7),
            Validators.required])),
        buttonColor: new FormControl('',
          Validators.compose([
            Validators.maxLength(7),
            Validators.minLength(7),
            Validators.required])),
        buttonText: new FormControl('',
          Validators.compose([
            Validators.maxLength(20),
            Validators.minLength(1),
            Validators.required])),
        desktopUrl: new FormControl('',
          Validators.compose([
            Validators.maxLength(2000),
            Validators.minLength(1),
            Validators.required])),
        mobileUrl: new FormControl('',
          Validators.compose([
            Validators.maxLength(2000),
            Validators.minLength(1),
            Validators.required])),
        goalType: new FormControl('', [
          Validators.required]),
        maxGoals: new FormControl(''),
        checkCustom: new FormControl('')
      });
    }
  }

  idValidator() {
    if (this.campaigns) {
      return this.campaignsEngineService.campaignIdValidator(this.campaignForm.get('id').value, this.campaigns);
    }
    return true;
  }

  goBack() {
    this.location.back();
  }

  async initializeCampaignById() {
    const newVal = this.utilsService.cleanValue(this.campaignForm.get('id').value);
    this.campaignForm.get('id').setValue(newVal);
    this.campaignForm.get('id').updateValueAndValidity({emitEvent:true});
    if (this.campaignForm.get('id').value !== localStorage.getItem('sliderId')) {
      if (!this.idValidator() && localStorage.getItem('sliderId')) {
        await this.campaignsEngineService.removeCampaignById(localStorage.getItem('sliderId'), 'sliderCampaigns');
        localStorage.removeItem('sliderId');
      }
      if (!this.idValidator() && this.campaignForm.get('id').value) {
        if (!this.isCopy) {
          if (this.campaignForm.controls['checkCustom'].touched) {
            this.cleanCampaign(this.campaign.isCustom);
          } else {
            this.cleanCampaign();
          }
          this.campaign.priority = 0;
        }
        this.campaign.id = this.campaignForm.get('id').value;
        await this.campaignsEngineService.initializeCampaignById(this.campaign,  this.campaignForm.get('id').value, 'sliderCampaigns');
        localStorage.setItem('sliderId', this.campaignForm.get('id').value);
      }
    }
    this.disableIdField();
  }

  disableIdField() {
    if (this.campaignForm.get('id').value) {
      this.campaignForm.controls['id'].disable({onlySelf: true});
      this.campaignForm.controls['checkCustom'].disable({onlySelf: true});
    }
  }

  async loadCampaign() {
    const campaign = await this.campaignsEngineService.getCampaign(this.id, this.campaignType);
    this.campaign = campaign;
    this.setValidationsForm();
    this.campaignForm.controls['desktopUrl'].setValue(campaign.desktopUrl);
    this.campaignForm.controls['mobileUrl'].setValue(campaign.mobileUrl);
    this.campaign = this.utils.completeCampaing(this.original,this.campaign);
    if (this.campaign.rutsFilePath) {
      this.createSliderRutsList(this.campaign.rutsFilePath);
    } else {
      this.createSliderRutsList([]);
    }
  }

  receiveUrl(url: string, control: 'mobileUrl' | 'desktopUrl') {
    this.campaignForm.controls[control].setValue(url);
    this.campaign[control] = url;

    if (control ===  'mobileUrl') {
      this.emptyMobile = false;
    }
    if (control ===  'desktopUrl') {
      this.emptyDesktop = false;
    }
  }

  validateForm(form: FormGroup): boolean {
    if (!form.valid) {
      if (!this.campaignForm.get('desktopUrl').value) {
        this.emptyDesktop = true;
      }
      if (!this.campaignForm.get('mobileUrl').value) {
        this.emptyMobile = true;
      }
      for (const i in form.controls) {
        if (form.controls[i]) {
          form.controls[i].markAsTouched();
        }
      }
      return false;
    } else {
      return true;
    }
  }

  saveCampaign() {
    this.validateForm(this.campaignForm);
    if(this.campaignForm.valid !== false){
      this.campaignsEngineService.addNewCampaign(this.campaign, this.campaignType).then(() => {
        localStorage.removeItem('sliderId');
        this.showModalWhenTransactionSaved('saveSuccessCampaign');
      }).catch(() => {
        this.showModalWhenError();
      });
    } else {
      this.showValidationModal();
    }

  }

  updateCampaign() {
    this.validateForm(this.campaignForm);
    if(this.campaignForm.valid !== false){
      this.campaignsEngineService.updateCampaign(this.id, this.campaign, this.campaignType)
        .then(() => {
          localStorage.removeItem('sliderId');
          this.showModalWhenTransactionSaved('updateSuccessCampaign');
        })
        .catch((error) => {
          console.error(error);
          this.showModalWhenError();
        });
    }
  }

  showModalWhenTransactionSaved(modalType: string) {
    this.modalService.openModal(modalType)
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.router.navigate([this.utils.pathHomeCampaign], {fragment: this.campaignType});
        } else {
          this.cleanCampaign();
        }
      });
  }

  showModalWhenError() {
    this.modalService.openModal('genericError')
      .then((btnPressed) => {
        if (btnPressed === 'right') {
          this.router.navigate([this.utils.pathHomeCampaign], {fragment: this.campaignType});
        }
      });
  }

  cleanCampaign(isCustom = false) {
    this.campaign = {
      type : 'slider' as CampaignType,
      activePWA: false,
      details: { active: false },
      isCustom,
      filters: {
        allUsers: false,
        av: { active: false },
        sav: { active: false },
        consumer: { active: false },
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
        devices: {
          mobile: true,
          desktop: true
        },
        platform: {
          on: false,
          nfc: false,
          allowedPlatforms: []
        }
      }
    } as any;
  }

  showConfirmationModal(event: FileList, isRut: boolean) {
    this.modalService.openModal('confirmation')
      .then((confirmBtnPressed) => {
        if (confirmBtnPressed === 'right' && isRut) {
          this.uploadCampaignRuts(event);
          (document.getElementById('uploadInputCampaignRut') as HTMLInputElement).value = '';
        } else if (!isRut) {
          (document.getElementById('uploadInput') as HTMLInputElement).value = '';
        } else if (isRut) {
          (document.getElementById('uploadInputCampaignRut')  as HTMLInputElement).value = '';
        }
      });
  }

  showValidationModal() {
    this.modalService.openModal('validationError');
  }

  get uploadingRuts() {
    return this.campaignsEngineService.uploadingRuts;
  }

  get uploadingCustomCampaigns() {
    return this.campaignsEngineService.uploadingCustomCampaigns;
  }

  uploadCampaignRuts(event: FileList) {
    const fileName = event[0].name;
    this.campaignsEngineService.uploadCampaignRuts(event, this.campaign.id, this.campaignType)
      .then((res) => {
        this.updateRutsFilePath(fileName);
      })
      .catch((error) => {
        console.error('ERROR: ', error);
        if (error && error.type && error.type === 'rutBadFormat') {
          this.modalService.openModal(error.type).catch();
        } else {
          this.modalService.openModal('csvUploadError');
        }
        this.campaignsEngineService.uploadingRuts = false;
      });
  }

  platformFilterChange(event: MatCheckboxChange): void {
    if (!event.checked) {
      this.campaign.filters.platform.nfc = false;
      this.campaign.filters.platform.allowedPlatforms = [];
    }
  }

  public toggleCustomSliderChange(event: MatSlideToggleChange) {
    this.cleanCampaign();
    this.campaign.isCustom = event.checked;
    this.campaign.filters.allUsers = true;
    this.setValidationsForm();
  }

  public uploadCustomCampaign(event: FileList) {
    this.modalService.openModal('confirmation')
      .then((btnPressed) => {
        if (btnPressed === 'right') {
          this.campaignsEngineService.uploadCustomCampaign(event, this.campaign.id, this.campaignType)
            .catch((error) => {
              console.error('ERROR: ', error);
              this.modalService.openModal('csvUploadError');
              this.campaignsEngineService.uploadingRuts = false;
            });
        }
        (document.getElementById('uploadCustomCampaign') as HTMLInputElement).value = '';
      });
  }

  createSliderRutsList(rutArray) {
    if (rutArray.length <= 3) {
      this.noToggle = true;
      this.rutsFilePath = rutArray;
    } else {
      this.noToggle = false;
      this.toggleRutListShort = true;
      this.rutsArrayShort = rutArray.slice(0, 3);
      this.rutsFilePath = rutArray;
    }
  }

  toggleRutListMethod() {
    this.toggleRutListShort = !this.toggleRutListShort;
    return false;
  }

  async updateRutsFilePath(name) {
    const userInfo = await this.authService.userInfo();
    if (!this.campaign.rutsFilePath) {
      this.campaign = { ...this.campaign, rutsFilePath: [] };
    }
    this.campaign.rutsFilePath.unshift(this.utilsService.generateFileRutName(name, userInfo.displayName.toLocaleLowerCase()));
    this.campaignsEngineService.updateCampaign(this.campaign.id, {
      activePWA: this.campaign.activePWA,
      rutsFilePath: this.campaign.rutsFilePath
    }, this.campaignType)
      .then((res) => {
        this.createSliderRutsList(this.campaign.rutsFilePath);
      })
      .catch((error) => {
        console.error(error);
        this.showModalWhenError();
      });

  }

  checkDevices() {
    const devices = this.campaign.filters.devices;
    this.isValidDevices = devices.mobile || devices.desktop;
    this.campaignForm.controls['fieldCheckDevices'].setValue(this.isValidDevices);
    this.campaignForm.controls['fieldCheckDevices'].updateValueAndValidity({emitEvent: true});
    return this.isValidDevices;
  }

  checkFilters(type: string) {
    const nameValidators = {
      av: {fieldA: 'avMin', fieldB: 'avMax', rule: 'amount'},
      sav: {fieldA: 'savMin', fieldB: 'savMax', rule: 'amount'},
      consumer: {fieldA: 'consumerMin', fieldB: 'consumerMax', rule: 'amount'},
      details: {fieldA: 'amount', fieldB: 'quota', rule: 'quota'},
    };
    const objValidators = {
      fx: {
        addValidators: (fieldMax, fieldMin) => {
          this.campaignForm.controls[fieldMax].setValidators([Validators.required, Validators.min(1)]);
          this.campaignForm.controls[fieldMin].setValidators([Validators.required, Validators.min(1)]);
          this.campaignForm.controls[fieldMax].updateValueAndValidity({emitEvent: true});
          this.campaignForm.controls[fieldMin].updateValueAndValidity({emitEvent: true});
        },
        clearValidators: (fieldMax, fieldMin) => {
          this.campaignForm.controls[fieldMax].clearValidators();
          this.campaignForm.controls[fieldMin].clearValidators();
          this.campaignForm.controls[fieldMax].updateValueAndValidity({emitEvent: true});
          this.campaignForm.controls[fieldMin].updateValueAndValidity({emitEvent: true});
        },
        checkRule: {
          amount: (typeName, fieldMax, fieldMin) => {
            const isValid = this.campaign.filters[typeName]?.max > this.campaign.filters[typeName]?.min;
            if (!isValid) {
              this.campaignForm.controls[fieldMin].setErrors({error: 'debe ser menor que monto máximo'});
            }
            return isValid;
          },
          quota: (fieldAmount, fieldQuota) => this.campaign.details[fieldAmount].amount && this.campaign.details[fieldQuota].quota
        }
      }
    };
    const nameFieldMax = nameValidators[type].fieldB;
    const nameFieldMin = nameValidators[type].fieldA;
    const nameRule = nameValidators[type].rule;
    const isActive = type!=='details' ? this.campaign.filters[type].active : this.campaign[type].details.active;
    if (isActive) {
      objValidators.fx.addValidators(nameFieldMax, nameFieldMin);
      return objValidators.fx.checkRule[nameRule](type, nameFieldMax, nameFieldMin);
    } else {
      objValidators.fx.clearValidators(nameFieldMax, nameFieldMin);
    }
    return false;
  }

  checkProducts() {
    const conditionProducts = this.campaign.filters.hasCA || this.campaign.filters.hasSA
      || this.campaign.filters.hasTR || this.campaign.filters.hasTRM;
    if (!!this.campaign.filters.haveProductCondition) {
      this.campaignForm.controls['fieldCheckProducts'].setValidators([Validators.requiredTrue]);
      this.isValidProducts = conditionProducts;
    } else {
      this.campaignForm.controls['fieldCheckProducts'].clearValidators();
    }
    this.campaignForm.controls['fieldCheckProducts'].setValue(this.isValidProducts);
    return this.isValidProducts;
  }
}
