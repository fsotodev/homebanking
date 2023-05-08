import { ProductTransactionsService } from './../../../services/productTransactions.service';
import { Product } from './../../../models/product';
import { Component, OnInit } from '@angular/core';
import { ModalDialogService } from '../../../services/modal-dialog.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CampaignsEngineService } from '../../../services/campaigns-engine.service';
import { Utils } from '@apps/pages/shared-components/utils/utils';
import {CampaignType} from '@apps/models/types/types';

@Component({
  selector: 'app-new-dashboard-campaign',
  templateUrl: './new-dashboard-campaign.component.html',
  styleUrls: ['./new-dashboard-campaign.component.scss']
})
export class NewDashboardCampaignComponent implements OnInit {

  campaignForm: FormGroup;
  id: string;
  campaign: any;
  extensions = ['svg', 'png', 'jpg', 'jpeg'];
  isUploadingImage = false;
  fileFirebaseUrl: string;
  fileUrl: string;
  uploadFolder = 'dashboardCampaignsImages';
  campaignType = 'dashboard' as CampaignType;
  campaigns: any[];
  categories: any[];
  products: any;

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private campaignsEngineService: CampaignsEngineService,
    private modalDialogService: ModalDialogService,
    private productTransactionService: ProductTransactionsService,
    public utils: Utils,
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

  public get rutUploadingProgress(): number {
    return this.campaignsEngineService.rutUploadingProgress;
  }

  async ngOnInit() {
    this.campaignsEngineService.rutUploadingProgress = 0;
    this.campaignForm = new FormGroup({
      id: new FormControl('',
        Validators.compose([
          Validators.maxLength(35),
          Validators.minLength(1),
          Validators.required])),
      priority: new FormControl('',
        Validators.compose([
          Validators.required])),
      page: new FormControl('',
        Validators.compose([
          Validators.maxLength(2000),
          Validators.minLength(1),
          Validators.required])),
      params: new FormControl('',
        Validators.compose([
          Validators.maxLength(2000)])),
      paramsId: new FormControl('',
        Validators.compose([
          Validators.maxLength(50)])),
      paramsRef: new FormControl('',
        Validators.compose([
          Validators.maxLength(50)])),
      imageUrl: new FormControl('',
        Validators.compose([
          Validators.maxLength(2000),
          Validators.minLength(1),
          Validators.required])),
      pointsMax: new FormControl('',
        Validators.compose([
          Validators.required])),
      pointsMin: new FormControl('',
        Validators.compose([
          Validators.required])),
    });
    this.campaigns = await this.campaignsEngineService.getCampaigns(this.campaignType);
    this.categories = await this.productTransactionService.getCategories();
    this.products = await this.productTransactionService.getProducts();
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
    this.campaignForm.controls.imageUrl.setValue(campaign.imageUrl);
    if (campaign.page === 'redeem') {
      this.campaign.redeemParams = campaign.params;
    }
    if (!this.campaign.redeemParams) {
      this.campaign.redeemParams = {};
    }
  }

  receiveUrl(url: string) {
    this.campaignForm.controls.imageUrl.setValue(url);
    this.campaign.imageUrl = url;
  }

  fixCampaignParams() {
    if (this.campaign.page === 'redeem') {
      if (!this.campaign.redeemParams.id || !this.campaign.redeemParams.ref) {
        this.campaign.redeemParams = { id: '', ref: '' };
      }
      this.campaign.params = this.campaign.redeemParams;
    }
    delete this.campaign.redeemParams;
  }

  saveCampaign() {
    this.fixCampaignParams();
    this.campaignsEngineService.addNewCampaign(this.campaign, this.campaignType)
      .then(() => {
        this.showModalWhenTransactionSaved('saveSuccessCampaign');
      })
      .catch(() => {
        this.showModalWhenError();
      });
  }

  updateCampaign() {
    this.fixCampaignParams();
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
      type: 'dashboard' as CampaignType,
      activePWA: false,
      filters: {
        allUsers: false,
        segment: false,
        segmentGold: false,
        segmentOne: false,
        segmentBronze: false,
        segmentRipley: false,
        segmentSilver: false,
        points: {
          active: false,
        }
      },
      redeemParams: {},
    } as any;
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

  get uploadingRuts() {
    return this.campaignsEngineService.uploadingRuts;
  }

  uploadCampaignRuts(event: FileList) {
    this.campaignsEngineService.uploadCampaignRuts(event, this.campaign.id, this.campaignType)
      .catch((error) => {
        console.error('ERROR: ', error);
        this.modalDialogService.openModal('csvUploadError');
        this.campaignsEngineService.uploadingRuts = false;
      });
  }

  getProductsByCategory(): Array<Product> {
    if (!this.products) {
      return new Array<Product>();
    }
    return this.products.filter(p => p.category === this.campaignForm.get('paramsId').value);
  }

  changeSelectCategory() {
    this.campaignForm.get('paramsRef').setValue(null);
    this.campaignForm.get('paramsRef').enable();
  }

}
