import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from '../../../services/firebase.service';
import { ModalDialogService } from '../../../services/modal-dialog.service';
import { ClipboardService } from 'ngx-clipboard';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pay-banner',
  templateUrl: './pay-banner.component.html',
  styleUrls: ['./pay-banner.component.scss']
})
export class PayBannerComponent implements OnInit {

  bannerForm: FormGroup;
  bannerInfo: { bannerActive: boolean; bannerAction: string; bannerImageURL: string };
  isUploading: boolean;
  saving: boolean;

  text = 'Subir archivo';
  description = 'Dimensiones: 414x235 px';
  extensions = ['png', 'jpg'];

  constructor(
    private firebaseService: FirebaseService,
    private modalDialogService: ModalDialogService,
    private clipboardService: ClipboardService,
    private location: Location,
    private router: Router
  ) {
    this.bannerInfo = { bannerImageURL: '', bannerActive: false, bannerAction: '' };
    this.isUploading = false;
    this.saving = false;
  }

  async ngOnInit() {
    this.bannerForm = new FormGroup({
      bannerImageURL: new FormControl('',
        Validators.compose([
          Validators.minLength(1),
          Validators.required])),
      bannerActive: new FormControl('',
        Validators.compose([
          Validators.required])),
      bannerAction: new FormControl('',
        Validators.compose([
          Validators.minLength(1),
          Validators.maxLength(50),
          Validators.required])),
    });

    const benefitTypes = await this.firebaseService.getFirebaseCollection('config').doc('pay').ref.get();
    this.bannerInfo = {
      bannerAction: benefitTypes.data().bannerAction,
      bannerActive: benefitTypes.data().bannerActive,
      bannerImageURL: benefitTypes.data().bannerImageURL
    };
    console.log(this.bannerInfo);
    this.bannerForm.setValue(this.bannerInfo);
  }

  goBack() {
    this.location.back();
  }

  async uploadMainImage(event: FileList) {
    if (event.length > 0) {
      this.isUploading = true;
      this.firebaseService.uploadFileToFireStorage(event[0], 'banners')
        .then((urlImage: string) => {
          this.bannerForm.controls.bannerImageURL.setValue(urlImage);
          this.bannerInfo.bannerImageURL = urlImage;
          this.isUploading = false;
        })
        .catch(() => {
          this.isUploading = false;
          this.modalDialogService.openModal('genericError')
            .then((btnPressed) => {
              if (btnPressed === 'right') {
                this.uploadMainImage(event);
              }
            });
        });
    } else {
      this.bannerForm.controls.bannerImageURL.setValue(null);
      this.bannerInfo.bannerImageURL = null;
    }
  }

  async save() {
    this.saving = true;
    await this.firebaseService.update$('config/pay', this.bannerForm.value);
    this.saving = false;
    this.showModalSaved();
  }

  copy(text: string) {
    this.clipboardService.copyFromContent(text);
  }

  showModalSaved() {
    this.modalDialogService.openModal('saveSuccessBannerConfig')
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.router.navigate(['/home']);
        }
      });
  }

}
