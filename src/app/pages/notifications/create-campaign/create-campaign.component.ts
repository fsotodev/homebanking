import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { PushCampaignsService } from '@apps/services/push-campaigns.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignPush, Options } from '@apps/models/campaign';
import { FirebaseService } from '@apps/services/firebase.service';
import { AuthFirebaseService} from '@apps/shared/services/auth/auth-firebase.service';
import * as firebase from 'firebase';
import DocumentReference = firebase.firestore.DocumentReference;
import { User } from '@apps/shared/models/user.interface';

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.scss']
})
export class CreateCampaignComponent implements OnInit {
  campaign: CampaignPush;
  campaignForm: FormGroup;
  campaignInfo: CampaignPush;
  file: any;
  hasToShowDateBox: boolean;
  id: string;
  newId: string;
  isUploadingImage: boolean;
  isUploadingRuts: boolean;
  newCampaignRef: DocumentReference;
  showRutsButton = false;
  showTestButton = false;
  successCountTest: number;
  failureCountTest: number;
  saving = false;
  sendMethods: any;
  allowedSystems: any;
  uploadedRuts = false;
  user: User;
  isPushPWA: boolean;
  isPushAPP: boolean;

  constructor(
    private authService: AuthFirebaseService,
    private firebaseService: FirebaseService,
    private campaignsService: PushCampaignsService,
    private modalDialogService: ModalDialogService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.campaignInfo = new CampaignPush();
  }

  async ngOnInit() {
    this.campaign = {} as CampaignPush;
    this.campaign.options = {} as Options;
    this.campaignForm = new FormGroup({
      name: new FormControl('',
        Validators.compose([
          Validators.minLength(1),
          Validators.maxLength(20),
          Validators.required])),
      title: new FormControl('',
        Validators.compose([
          Validators.minLength(1),
          Validators.maxLength(100),
          Validators.required])),
      subtitle: new FormControl('',
        Validators.compose([
          Validators.minLength(1),
          Validators.maxLength(180),
          Validators.required])),
      redirectType: new FormControl('',
        Validators.compose([
          Validators.maxLength(50)])),
      redirectPath: new FormControl('',
        Validators.compose([
          Validators.maxLength(50)])),
      redirectWebPush: new FormControl('',
        Validators.compose([
          Validators.maxLength(100)])),
      checkboxes: new FormGroup({
        checkboxApp: new FormControl(false),
        checkboxPWA: new FormControl(false),
        checkboxApple: new FormControl(false),
        checkboxAndroid: new FormControl(false),
      }, this.requireCheckboxesToBeCheckedValidator(),
      ),
      isAutomaticCharge: new FormControl(false),
      performAt: new FormControl('',
        Validators.compose([
          Validators.minLength(1)])),
      expirationDate: new FormControl('',
        Validators.compose([
          Validators.minLength(1),
          Validators.required])),
      status: new FormControl('',
        Validators.compose([
          Validators.maxLength(20),
          Validators.minLength(1),
          Validators.required])),
    });
    this.route.queryParams.subscribe(params => {
      this.id = params.id;
    });
    this.campaignForm.patchValue({checkboxes: {checkboxApp: true}});
    this.campaignForm.patchValue({checkboxes: {checkboxApple: true}});
    this.campaignForm.patchValue({checkboxes: {checkboxAndroid: true}});
    this.campaign.isAutomaticCharge = false;
    this.isPushAPP = true;
    if (this.id) {
      await this.loadPreviousData();
      if (this.campaign.performAt) {
        this.hasToShowDateBox = true;
      } else {
        this.hasToShowDateBox = false;
      }
    }
    this.user = await this.authService.userInfo();
    this.isUploadingImage = false;
  }

  async loadPreviousData() {
    this.campaign = await this.campaignsService.getPushCampaign(this.id);
    this.campaignForm.patchValue({name: this.campaign.name});
    this.campaignForm.patchValue({title: this.campaign.options.pushTitle});
    this.campaignForm.patchValue({subtitle: this.campaign.options.pushDescription});
    this.campaignForm.patchValue({redirectType: this.campaign.redirectType});
    this.campaignForm.patchValue({redirectPath: this.campaign.redirectPath});
    this.campaignForm.patchValue({redirectWebPush: this.campaign.redirectWebPush});
    this.campaignForm.patchValue({status: this.campaign.status});
    this.campaignForm.patchValue({checkboxes: {checkboxApp: this.campaign.sendMethods.App}});
    this.campaignForm.patchValue({checkboxes: {checkboxPWA: this.campaign.sendMethods.PWA}});
    this.campaignForm.patchValue({checkboxes: {checkboxApple: this.campaign.allowedSystems.Apple}});
    this.campaignForm.patchValue({checkboxes: {checkboxAndroid: this.campaign.allowedSystems.Android}});
    this.campaignForm.patchValue({expirationDate: this.campaign.expirationDate});
    this.campaignForm.patchValue({performAt: this.campaign.performAt});
    this.campaignForm.patchValue({isAutomaticCharge: this.campaign.isAutomaticCharge });
    this.showTestButton = true;
    this.showRutsButton = this.campaign.status === 'tested' || !this.campaign.hasToPerformTest;
    this.campaignInfo = {...this.campaign};
    this.isPushPWA = this.campaign.sendMethods.PWA;
    this.isPushAPP = this.campaign.sendMethods.App;
  }

  requireCheckboxesToBeCheckedValidator(minRequired: number = 1): ValidatorFn {
    const validate = (formGroup: FormGroup) => {
      let checked = 0;

      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.controls[key];
        if (control.value === true) {
          checked ++;
        }
      });
      if (checked < minRequired) {
        return {
          requireCheckboxesToBeChecked: true,
        };
      }
      return null;
    };
    return validate;
  }

  async saveCampaign() {
    this.saving = true;
    const checkboxAppIsChecked = this.campaignForm.get('checkboxes.checkboxApp').value;
    const checkboxPWAIsChecked = this.campaignForm.get('checkboxes.checkboxPWA').value;
    const checkboxAppleIsChecked = this.campaignForm.get('checkboxes.checkboxApple').value;
    const checkboxAndroidIsChecked = this.campaignForm.get('checkboxes.checkboxAndroid').value;
    this.sendMethods = {App: checkboxAppIsChecked, PWA: checkboxPWAIsChecked};
    this.allowedSystems = {Apple: checkboxAppleIsChecked, Android: checkboxAndroidIsChecked};
    this.campaignInfo = {
      name: this.campaignForm.getRawValue().name,
      options: {
        pushTitle: this.campaignForm.getRawValue().title,
        pushDescription: this.campaignForm.getRawValue().subtitle,
        pushImg: this.campaign.options.pushImg,
        url: '',
      },
      lastModifiedBy: this.user.email,
      redirectType: this.campaignForm.getRawValue().redirectType,
      redirectPath: this.campaignForm.getRawValue().redirectPath,
      imgWebPush: this.campaign.imgWebPush,
      redirectWebPush: this.getUrlForWebNotification(),
      expirationDate: this.campaignForm.getRawValue().expirationDate,
      performAt: this.campaignForm.getRawValue().performAt,
      status: this.campaignForm.getRawValue().status,
      sendMethods: this.sendMethods,
      allowedSystems: this.allowedSystems,
      uploadedRuts: this.uploadedRuts,
      isAutomaticCharge: this.campaignForm.getRawValue().isAutomaticCharge
    } as CampaignPush;
    if (this.id || this.newId) {
      this.campaignInfo.hasToPerformTest = this.campaign.hasToPerformTest;
      await this.campaignsService.updateCampaign(this.id ? this.id : this.newId, this.campaignInfo);
    } else {
      this.campaignInfo.createdBy = this.user.email;
      this.campaignInfo.hasToPerformTest = true;
      this.newCampaignRef = await this.campaignsService.createCampaign(this.campaignInfo);
    }
    this.saving = false;
  }

  async sendTestNotification() {
    if (!this.id) {
      this.newId = this.newCampaignRef.id;
      this.campaign = await this.campaignsService.getPushCampaign(this.newId);
    }
    this.campaign.hasToPerformTest = true;
    this.saveCampaign();
    this.showRutsButton = true;
  }

  toggleWebUrlInput(checkContext: any) {
    this.isPushPWA = checkContext.target.checked;
  }

  toggleAllowedSystems(checkContext: any) {
    this.isPushAPP = checkContext.target.checked;
  }

  getUrlForWebNotification() {
    const redirect = this.campaignForm.getRawValue().redirectWebPush;
    if (this.isPushPWA && !redirect) {
      return 'https://web.bancoripley.cl/home';
    }
    if (String(redirect).includes('https') || !redirect) {
      return redirect;
    }
    return 'https://' + redirect;
  }

  newRedirect() {
    if (this.campaignForm.get('isAutomaticCharge').value) {
      if ( this.isCreate() ) {
        this.actionsSaveCampaign();
        this.router.navigate(['/campaigns']);
      } else if ( this.isUpdate() ) {
        this.actionsUpdateCampaign();
      }
    } else {
      this.handleRedirect();
    }
  }

  actionsSaveCampaign() {
    this.saveCampaign();
    this.showTestButton = true;
  }

  actionsUpdateCampaign() {
    this.saveCampaign();
    this.showTestButton = this.campaignInfo.hasToPerformTest;
    this.modalDialogService.openModal('updateSuccessCreateCampaign').then((btnPressed) => {
      if (btnPressed === 'right') {
        this.router.navigate(['/campaigns']);
      }
      if (btnPressed === 'left') {
        this.goBack();
      }
    });
  }

  isCreate(): boolean {
    return this.campaignInfo && !this.id;
  }

  isUpdate(): boolean {
    return !!(this.campaignInfo && this.campaign && this.id);
  }

  handleRedirect() {
    if (this.isCreate()) {
      this.modalDialogService.openModal('newCampaign').then((btnPressed) => {
        if (btnPressed === 'right') {
          this.actionsSaveCampaign();
        }
        if (btnPressed === 'left') {
          this.campaignForm.patchValue({status: 'draft'});
          this.saveCampaign();
          this.goBack();
        }
      });
    } else if (this.isUpdate()) {
      this.actionsUpdateCampaign();
    }
  }

  uploadRutsFile(event: File) {
    this.firebaseService.uploadFileToFireStorage(event, 'usersCampaigns', this.campaignInfo.status)
      .then((url: string) => {
        this.uploadedRuts = true;
        this.modalDialogService.openModal('saveSuccessCampaign').then(() => {
          this.router.navigate(['/campaigns']);
        });
      })
      .catch(() => {
        this.isUploadingRuts = false;
        this.modalDialogService.openModal('uploadError')
          .then((btnPressed) => {
            if (btnPressed === 'right') {
              this.uploadRutsFile(event);
            }
          });
      });
  }

  uploadNotificationImage(event: FileList, type: string, pushImg: boolean = false) {
    if (event.length > 0) {
      this.isUploadingImage = true;
      this.firebaseService.uploadFileToFireStorage(event[0], 'notifications')
        .then((urlImage: string) => {
          if (pushImg) {
            this.campaign.imgWebPush = urlImage;
          } else {
            this.campaign.options.pushImg = urlImage;
          }
          this.isUploadingImage = false;
        })
        .catch(() => {
          this.isUploadingImage = false;
          this.modalDialogService.openModal('genericError')
            .then((btnPressed) => {
              if (btnPressed === 'right') {
                this.uploadNotificationImage(event, type);
              }
            });
        });
    } else {
      this.campaign.options.pushImg = null;
    }
  }

  select() {
    this.campaignInfo.status = this.campaignForm.getRawValue().status;
    if (this.campaignInfo.status === 'scheduled') {
      this.hasToShowDateBox = true;
      this.campaignForm.controls['performAt'].setValidators(
        Validators.compose([
          Validators.minLength(1),
          Validators.required])
      );
      this.campaignForm.controls['performAt'].updateValueAndValidity();
    } else {
      this.hasToShowDateBox = false;
      this.campaignForm.patchValue({performAt: ''});
      this.campaignInfo.performAt = this.campaignForm.getRawValue().performAt;
      this.campaignForm.controls['performAt'].setValidators(
        Validators.compose([Validators.minLength(1)]));
      this.campaignForm.controls['performAt'].updateValueAndValidity();
    }
  }

  async showModalConfirmation(event: FileList, isRut: boolean) {
    const campaignToSearch = event[0].name.split('.').shift();
    if (this.campaignForm.getRawValue().name !== campaignToSearch) {
      this.modalDialogService.openModal('uploadErrorCampaign')
        .then((btnPressed) => {
        });
    } else {
      this.file = event[0];
      (document.getElementById('fileName') as HTMLInputElement).textContent = event[0].name;
      if (this.campaignInfo.status === 'immediate') {
        this.modalDialogService.openModal('inmediateCampaign').then(async (btnPressed) => {
          if (btnPressed === 'right') {
            this.uploadRutsFile(this.file);
          }
          if (btnPressed === 'left') {}
        });
      } else {
        const uploadEvent = await this.uploadRutsFile(this.file);
        this.modalDialogService.openModal('saveSuccessCampaign').then(() => {
          this.router.navigate(['/campaigns']);
        });
      }
      (document.getElementById('uploadInputRut') as HTMLInputElement).value = '';
    }
  }

  async goBack() {
    this.campaignInfo.status = 'draft';
    await this.router.navigate(['/campaigns']);
  }
}
