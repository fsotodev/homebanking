import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { DocumentData } from '@firebase/firestore-types';
import { ModalDialogService } from '../../../services/modal-dialog.service';
import { FirebaseService } from '../../../services/firebase.service';
import { Campaign } from '../../../models/campaign';
import { CampaignService } from '../../../services/campaign.service';
import { stringLength } from '@firebase/util';

@Component({
  selector: 'app-new-campaign',
  templateUrl: './new-campaign.component.html',
  styleUrls: ['./new-campaign.component.scss']
})
export class NewCampaignComponent implements OnInit {

  campaignIdForm: FormGroup;
  campaignForm: FormGroup;
  isUploadingImage = false;
  expirationDate: Date;
  isUploadingPdf: boolean;
  folder: string;
  campaignIds: string[];
  isLoaded: boolean;
  confirmedId: boolean;
  campaignId: string;

  constructor(
    private router: Router,
    private location: Location,
    private modalDialogService: ModalDialogService,
    private campaignService: CampaignService,
  ) {
    this.isUploadingPdf = false;
    this.isLoaded = false;
    this.confirmedId = false;
  }

  ngOnInit() {
    this.folder = 'campaigns/';

    this.campaignIdForm = new FormGroup({
      id: new FormControl('',
        Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(1),
          Validators.required])),
    });

    this.campaignForm = new FormGroup({
      uniqueCode: new FormControl('',
        Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(1)])),
      hasCode: new FormControl(false),
      active: new FormControl(false),
      startDate: new FormControl('',
        Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(1),
          Validators.required])),
      endDate: new FormControl('',
        Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(1),
          Validators.required])),
      campaignTitle: new FormControl('',
        Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(1),
          Validators.required])),
      campaignSubTitle: new FormControl('',
        Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(1),
          Validators.required])),
      headerTitle: new FormControl('',
        Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(1),
          Validators.required])),
      homeText: new FormControl('',
        Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(1),
          Validators.required])),
      campaignDurationText: new FormControl('',
        Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(1),
          Validators.required])),
      codeDescription: new FormControl('',
        Validators.compose([
          Validators.maxLength(15),
          Validators.minLength(0),
          Validators.required])),
      priority: new FormControl('',
        Validators.compose([
          Validators.max(999999),
          Validators.min(0)])),
      campaignConditionsPdfUrl: new FormControl('',
        Validators.compose([
          Validators.maxLength(2000),
          Validators.minLength(10)])),
      campaignLogoUrl: new FormControl('',
        Validators.compose([
          Validators.maxLength(2000),
          Validators.minLength(10),
          Validators.required])),
      campaignMainImage: new FormControl('',
        Validators.compose([
          Validators.maxLength(2000),
          Validators.minLength(10),
          Validators.required])),
      homeLogoUrl: new FormControl('',
        Validators.compose([
          Validators.maxLength(2000),
          Validators.minLength(10)])),
      copyPaste: new FormControl(false),
      openApp: new FormControl('',
        Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(1)])),
      openUrl: new FormControl('',
        Validators.compose([
          Validators.maxLength(2000),
          Validators.minLength(10)])),
    });

    this.getCampaignsIds().then(() => {
      this.isLoaded = true;
    });

  }

  get id() {
    return this.campaignIdForm.controls.id.value;
  }

  async getCampaignsIds() {
    this.campaignIds = await this.campaignService.getCampaignIds();
  }

  isIdValid() {
    return this.campaignIds.filter(id => id === this.id).length === 0;
  }

  saveCampaignId() {
    this.confirmedId = true;
    this.campaignId = this.id;
    this.campaignIdForm.controls.id.disable();
  }

  uploadToForm(event, control: string) {
    this.campaignForm.controls[control].setValue(event);
  }

  goBack() {
    this.location.back();
  }

  saveCampaign() {
    const campaign = this.campaignForm.value as Campaign;
    campaign.id = this.campaignId;
    campaign.typeCode = new Map<string, string>();
    campaign.typeCode['copyPaste'] = this.campaignForm.controls.copyPaste.value;
    campaign.typeCode['openApp'] = this.campaignForm.controls.openApp.value;
    campaign.typeCode['openUrl'] = this.campaignForm.controls.openUrl.value;
    this.campaignService.addNewCampaign(this.campaignForm.value as Campaign)
      .then(() => {
        this.showModalWhenTransactionSaved();
      })
      .catch(() => {
        this.showModalWhenError();
      });
  }

  showModalWhenTransactionSaved() {
    this.modalDialogService.openModal('saveSuccessCampaign')
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.router.navigate(['/home']);
        } else {
          // this.router.navigate([this.router.url]);
          window.location.reload();
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

}
