import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { Router } from '@angular/router';
import { PromotionalBanner } from '@apps/models/campaign';
import { FirebaseService } from '@apps/services/firebase.service';

@Component({
  selector: 'app-promotion-banner',
  templateUrl: './create-promotion-banner.component.html',
  styleUrls: ['./create-promotion-banner.component.scss']
})
export class CreatePromotionBannerComponent implements OnInit {
  banners: Array<any>;
  banner: PromotionalBanner;
  bannerForm: FormGroup;
  file: any;
  id: string;
  isUploadingImage: boolean;
  public BANNER_TYPE = [
    {id: 'home', tittle: 'Home'},
    {id: 'movimientosCV', tittle: 'Movimientos CV'},
    {id: 'movimientosTC', tittle: 'Movimientos TC'},
    {id: 'popup', tittle: 'Popup'}
  ];

  constructor(
    private firebaseService: FirebaseService,
    private modalDialogService: ModalDialogService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.banner = {} as PromotionalBanner;
    this.loadPreviousData();
    this.bannerForm = new FormGroup({
      id: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      onOff: new FormControl(false, Validators.required),
      redirect: new FormControl('', Validators.required),
      activeSeconds: new FormControl('')
    });
  }

  changeSelectType(event: any) {
    const selectBanner = this.banners.find(b => b.id === event.value);
    if (!!selectBanner) {
      this.banner = selectBanner;
      this.bannerForm.patchValue({id: this.banner.id});
      this.bannerForm.patchValue({url: this.banner.url});
      this.bannerForm.patchValue({type: this.banner.type});
      this.bannerForm.patchValue({onOff: this.banner.onOff});
      this.bannerForm.patchValue({redirect: this.banner.redirect});
      this.bannerForm.patchValue({activeSeconds: this.banner.activeSeconds});
    }
  }

  async loadPreviousData() {
    this.banners = await this.firebaseService.getBanners();
  }

  uploadNotificationImage(event: FileList, type: string) {
    if (event.length > 0) {
      this.isUploadingImage = true;
      this.firebaseService.uploadFileToFireStorage(event[0], 'PromotionalBanners')
        .then((urlImage: string) => {
          this.banner.url = urlImage;
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
      this.banner.url = null;
    }
  }

  async saveBanner() {
    if (this.banner.id !== 'popup') {
      delete this.banner.activeSeconds;
    }
    const docID = this.banner.id;
    delete this.banner.id;
    await this.firebaseService.updateBanner(docID, this.banner);
  }

  handleRedirect() {
    this.modalDialogService.openModal('newPromotionalBanner').then((btnPressed) => {
      if (btnPressed === 'right') {
        this.saveBanner().then(() => this.router.navigate(['/home']));
      }
    });
  }

  async goBack() {
    await this.router.navigate(['/home']);
  }
}
