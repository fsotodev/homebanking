import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Promotion } from '../../models/promotion';
import { FirebaseService } from '../../services/firebase.service';
import { ClipboardService } from 'ngx-clipboard';
import { ModalDialogService } from '../../services/modal-dialog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-advance-promo',
  templateUrl: './advance-promo.component.html',
  styleUrls: ['./advance-promo.component.scss']
})
export class AdvancePromoComponent implements OnInit {
  isUploading: boolean;
  promotionForm: FormGroup;
  promoInfo: Promotion;
  saving: boolean;
  advaceType: string;

  text = 'Subir archivo';
  extensions = ['png', 'jpg'];

  constructor(
    private firebaseService: FirebaseService,
    private clipboardService: ClipboardService,
    private modalDialogService: ModalDialogService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) {
    this.promoInfo = new Promotion();
    this.isUploading = false;
    this.saving = false;
    this.route.params.subscribe(params => {
      this.advaceType = params.id;
      this.loadPromotion();
    });
  }

  async ngOnInit() {
    this.promotionForm = new FormGroup({
      promotionTitle: new FormControl('',
        Validators.compose([
          Validators.minLength(1),
          Validators.maxLength(20),
          Validators.required])),
      promotionSubtitle: new FormControl('',
        Validators.compose([
          Validators.minLength(1),
          Validators.maxLength(20),
          Validators.required])),
      mainDescription: new FormControl('',
        Validators.compose([
          Validators.minLength(1),
          Validators.maxLength(50),
          Validators.required])),
      isActive: new FormControl('',
        Validators.compose([
          Validators.required])),
      promotionMainImage: new FormControl('',
        Validators.compose([
          Validators.minLength(1),
          Validators.required])),
      startDate: new FormControl('',
        Validators.compose([
          Validators.minLength(1),
          Validators.required])),
      endDate: new FormControl('',
        Validators.compose([
          Validators.minLength(1),
          Validators.required])),
    });
  }

  async loadPromotion() {
    const promoSnap = await this.firebaseService.getFirebaseCollection('avsavPromotions').doc(this.advaceType).ref.get();
    this.promoInfo = {
      promotionTitle: promoSnap.data().promotionTitle,
      promotionSubtitle: promoSnap.data().promotionSubtitle,
      isActive: promoSnap.data().isActive,
      promotionMainImage: promoSnap.data().promotionMainImage,
      mainDescription: promoSnap.data().mainDescription,
      startDate: promoSnap.data().startDate ? promoSnap.data().startDate.toDate() : '',
      endDate: promoSnap.data().endDate ? promoSnap.data().endDate.toDate() : ''
    };

    this.promotionForm.setValue(this.promoInfo);
    console.log(this.promotionForm);
  }

  async save() {
    this.saving = true;
    await this.firebaseService.update$(`avsavPromotions/${this.advaceType}`, this.promotionForm.value);
    this.saving = false;
    this.showModalSaved();
  }

  copy(text: string) {
    this.clipboardService.copyFromContent(text);
  }

  goBack() {
    this.location.back();
  }

  showModalSaved() {
    this.modalDialogService.openModal('saveSuccessAvSavPromoConfig')
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.router.navigate(['/home']);
        }
      });
  }

  async uploadMainImage(event: FileList) {
    if (event.length > 0) {
      this.isUploading = true;
      this.firebaseService.uploadFileToFireStorage(event[0], 'benefits')
        .then((url: string) => {
          this.promotionForm.controls.promotionMainImage.setValue(url);
          this.promoInfo.promotionMainImage = url;
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
      this.promotionForm.controls.promotionMainImage.setValue(null);
      this.promoInfo.promotionMainImage = null;
    }
  }

}
