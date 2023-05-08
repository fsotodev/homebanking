import { Component, OnInit } from '@angular/core';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CampaignsEngineService } from '@apps/services/campaigns-engine.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Utils } from '@apps/pages/shared-components/utils/utils';
import {CampaignType} from '@apps/models/types/types';

@Component({
  selector: 'app-new-avsav-sim-campaign',
  templateUrl: './new-avsav-sim-campaign.component.html',
  styleUrls: ['./new-avsav-sim-campaign.component.scss']
})
export class NewAvsavSimulationCampaignComponent implements OnInit {

  campaignForm: FormGroup;
  id: string;
  campaign: any;
  extensions = ['svg', 'png', 'jpg', 'jpeg'];
  isUploadingImage = false;
  fileFirebaseUrl: string;
  fileUrl: string;
  uploadFolder = 'avsavSimulationCampaignsImages';
  campaignType = 'avsavSimulation' as CampaignType;
  campaigns: any[];
  isUploadingRuts = false;
  platformsList: string[] = ['iosApp', 'androidApp', 'iosWeb', 'androidWeb', 'desktop'];
  titleSimulation: string;
  typeSimulation: string;
  offerType: [];
  description: string;

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private campaignsEngineService: CampaignsEngineService,
    private modalDialogService: ModalDialogService,
    private utils: Utils
  ) {
    this.cleanCampaign();
    this.route.queryParams.subscribe((params) => {
      if (params) {
        if (params.type) {
          this.typeSimulation = params.type;
        }
        if (params.id) {
          this.id = params.id;
          this.loadCampaign();
        } else if (params.copyId) {
          this.id = params.copyId;
          this.loadCampaign().then(() => {
            this.campaign = this.campaignsEngineService.setCopiedCampaignDefaultData(this.campaign, this.id);
            this.id = undefined;
          });
        }
      }
    });
  }

  async ngOnInit() {
    this.campaignForm = new FormGroup({
      id: new FormControl('',
        Validators.compose([
          Validators.maxLength(35),
          Validators.minLength(1),
          Validators.required])),
      priority: new FormControl('',
        Validators.compose([
          Validators.required])),
      title: new FormControl('',
        Validators.compose([
          Validators.maxLength(30),
          Validators.minLength(1)])),
      amount: new FormControl('',
        Validators.compose([
          Validators.required])),
      quota: new FormControl('',
        Validators.compose([
          Validators.required])),
      offerType: new FormControl('',
        Validators.compose([
          Validators.maxLength(30),
          Validators.minLength(1),
          Validators.required])),
      mobileUrl: new FormControl('',
        Validators.compose([
          Validators.maxLength(2000),
          Validators.minLength(1)])),
      desktopUrl: new FormControl('',
        Validators.compose([
          Validators.maxLength(2000),
          Validators.minLength(1),
          Validators.required])),
      avMax: new FormControl('',
        Validators.compose([
          Validators.required])),
      avMin: new FormControl('',
        Validators.compose([
          Validators.required])),
      savMax: new FormControl('',
        Validators.compose([
          Validators.required])),
      savMin: new FormControl('',
        Validators.compose([
          Validators.required])),
      consumerMax: new FormControl('',
        Validators.compose([
          Validators.required])),
      consumerMin: new FormControl('',
        Validators.compose([
          Validators.required])),
      haveProductCondition: new FormControl('',
        Validators.compose([
          Validators.maxLength(3),
          Validators.minLength(1),
          Validators.required])),
    });
    this.setTypeSimulation();
    this.campaigns = await this.campaignsEngineService.getCampaigns(this.campaignType);
  }

  idValidator() {
    if (this.campaigns) {
      return this.campaignsEngineService.campaignIdValidator(this.campaign.id, this.campaigns);
    }
    return true;
  }

  goBack() {
    this.location.back();
  }

  async loadCampaign() {
    const campaign = await this.campaignsEngineService.getCampaign(this.id, this.campaignType);
    this.campaign = campaign;
    this.campaignForm.controls.mobileUrl.setValue(campaign.mobileUrl);
    this.campaignForm.controls.desktopUrl.setValue(campaign.desktopUrl);
  }

  receiveUrl(url: string, control: 'mobileUrl' | 'desktopUrl') {
    this.campaignForm.controls[control].setValue(url);
    this.campaign[control] = url;
  }

  saveCampaign() {
    this.campaignsEngineService.addNewCampaign(this.campaign, this.campaignType)
      .then(() => {
        this.showModalWhenTransactionSaved('saveSuccessCampaign');
      })
      .catch(() => {
        this.showModalWhenError();
      });
  }

  updateCampaign() {
    this.campaignsEngineService.updateCampaign(this.id, this.campaign, this.campaignType)
      .then(() => {
        this.showModalWhenTransactionSaved('updateSuccessCampaign');
      })
      .catch((error) => {
        console.error(error);
        this.showModalWhenError();
      });
  }

  showModalWhenTransactionSaved(modalType: string) {
    this.modalDialogService.openModal(modalType)
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.router.navigate([this.utils.pathHomeCampaign], {fragment: this.campaignType});
        } else {
          this.router.navigateByUrl('/new-credit-sim-campaign?type=ccSimulation');
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
    this.campaign = {
      type: 'avsavSimulation' as CampaignType,
      activePWA: false,
      filters: {
        allUsers: false,
        av: { active: false },
        sav: { active: false },
        consumer: { active: false },
        segment: false,
        segmentGold: false,
        segmentOne: false,
        segmentBronze: false,
        segmentRipley: false,
        segmentSilver: false,
        hasSA: false,
        hasTR: false,
        hasTRM: false,
        platform: {
          on: false,
          nfc: false,
          allowedPlatforms: []
        }
      }
    } as any;
  }

  get uploadingRuts() {
    return this.campaignsEngineService.uploadingRuts;
  }

  public get rutUploadingProgress(): number {
    return this.campaignsEngineService.rutUploadingProgress;
  }

  showModalConfirmation(event: FileList, isRut: boolean) {
    this.modalDialogService.openModal('confirmation')
      .then((btnPressed) => {
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
    this.campaignsEngineService.uploadCampaignRuts(event, this.campaign.id, this.campaignType)
      .catch((error) => {
        console.error('ERROR: ', error);
        this.modalDialogService.openModal('csvUploadError');
        this.campaignsEngineService.uploadingRuts = false;
      });
  }

  platformFilterChange(event: MatCheckboxChange): void {
    if (!event.checked) {
      this.campaign.filters.platform.nfc = false;
      this.campaign.filters.platform.allowedPlatforms = [];
    }
  }

  setTypeSimulation() {
    if (this.typeSimulation === 'ccSimulation') {
      this.titleSimulation = 'Crédito Consumo';
      this.description = 'consumo';
      this.campaignType = this.typeSimulation as CampaignType;
      this.campaign.offerType = 'cc';
      this.campaignForm.controls['offerType'].setValue(  'cc');
    } else if (this.typeSimulation === 'avsavSimulation') {
      this.titleSimulation = 'Av/Sav';
      this.description = 'avance';
    }
  }

}
