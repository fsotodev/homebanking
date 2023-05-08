import { Component, OnInit } from '@angular/core';
import { ModalDialogService } from '../../../services/modal-dialog.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CampaignsEngineService } from '../../../services/campaigns-engine.service';
import { Utils } from '@apps/pages/shared-components/utils/utils';
import {CampaignType} from '@apps/models/types/types';

@Component({
  selector: 'app-new-avsav-campaign',
  templateUrl: './new-avsav-campaign.component.html',
  styleUrls: ['./new-avsav-campaign.component.scss']
})
export class NewAvSavCampaignComponent implements OnInit {

  campaignForm: FormGroup;
  id: string;
  campaign: any;
  extensions = ['svg', 'png', 'jpg', 'jpeg'];
  isUploadingImage = false;
  fileFirebaseUrl: string;
  fileUrl: string;
  uploadFolder = 'avsavCampaignsImages';
  campaignType = 'avsav' as CampaignType;
  campaigns: any[];

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
          Validators.maxLength(40),
          Validators.minLength(1),
          Validators.required])),
      buttonText: new FormControl('',
        Validators.compose([
          Validators.maxLength(20),
          Validators.minLength(1)])),
      labelText: new FormControl('',
        Validators.compose([
          Validators.maxLength(20),
          Validators.minLength(1),
          Validators.required])),
      labelDescription: new FormControl('',
        Validators.compose([
          Validators.maxLength(40)])),
      quotasText: new FormControl('',
        Validators.compose([
          Validators.maxLength(40),
          Validators.minLength(1),
          Validators.required])),
      rateText: new FormControl('',
        Validators.compose([
          Validators.maxLength(20)])),
      totalCostText: new FormControl('',
        Validators.compose([
          Validators.maxLength(30),
          Validators.minLength(1),
          Validators.required])),
      page: new FormControl('',
        Validators.compose([
          Validators.maxLength(6),
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
      amount: new FormControl('',
        Validators.compose([
          Validators.min(1),
          Validators.required])),
      quota: new FormControl('',
        Validators.compose([
          Validators.min(1),
          Validators.required])),
      bgButtonColor: new FormControl('',
        Validators.compose([
          Validators.maxLength(7),
          Validators.minLength(7),
          Validators.required])),
      bgHeadColor: new FormControl('',
        Validators.compose([
          Validators.maxLength(7),
          Validators.minLength(7),
          Validators.required])),
      bgLabelColor: new FormControl('',
        Validators.compose([
          Validators.maxLength(7),
          Validators.minLength(7),
          Validators.required])),
      borderBoxColor: new FormControl('',
        Validators.compose([
          Validators.maxLength(30),
          Validators.minLength(3),
          Validators.required])),
      textCostColor: new FormControl('',
        Validators.compose([
          Validators.maxLength(7),
          Validators.minLength(7),
          Validators.required])),
      textDescLabelColor: new FormControl('',
        Validators.compose([
          Validators.maxLength(7),
          Validators.minLength(7),
          Validators.required])),
      textLabelColor: new FormControl('',
        Validators.compose([
          Validators.maxLength(7),
          Validators.minLength(7),
          Validators.required])),
      textTitleColor: new FormControl('',
        Validators.compose([
          Validators.maxLength(7),
          Validators.minLength(7),
          Validators.required])),
    });
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
        console.log('err');
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
    this.campaign = {
      type: 'avsav' as CampaignType,
      details: { active: false },
      styles: {},
      activePWA: false,
      filters: {
        allUsers: false,
        av: { active: false },
        sav: { active: false },
        consumer: { active: false },
        hasSA: false,
        hasTR: false,
        hasTRM: false,
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
}
