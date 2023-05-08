import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';
import { ModalDialogService } from '../../../services/modal-dialog.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ProductTransactionsService } from '../../../services/productTransactions.service';

@Component({
  selector: 'app-dashboard-banner',
  templateUrl: './dashboard-banner.component.html',
  styleUrls: ['./dashboard-banner.component.scss']
})
export class DashboardBannerComponent implements OnInit {

  bannersList: any;
  selectedBanner: any;
  isUploading: boolean;
  saving: boolean;
  segmentBannerSelected: string;
  categories: any[];

  text = 'Subir archivo';
  description = 'Dimensiones: 880x440 px';
  extensions = ['png', 'jpg'];

  constructor(
    private firebaseService: FirebaseService,
    private modalDialogService: ModalDialogService,
    private location: Location,
    private router: Router,
    private productTransactionService: ProductTransactionsService,
  ) {
    this.isUploading = false;
    this.saving = false;
  }

  async ngOnInit() {
    const bannersData = await this.firebaseService.getFirebaseCollection('appData').doc('dashboardPointsConfig')
      .ref.get();
    this.bannersList = bannersData.data().banners;
    this.categories = await this.productTransactionService.getCategories();
  }

  uploadBannerData() {
    for (const banner of this.bannersList) {
      if (banner.segment === this.segmentBannerSelected) {
        this.selectedBanner = banner;
      }
    }
  }
  goBack() {
    this.location.back();
  }

  async uploadMainImage(event: FileList) {
    if (event.length > 0) {
      this.isUploading = true;
      this.firebaseService.uploadFileToFireStorage(event[0], 'banners')
        .then((urlImage: string) => {
          this.selectedBanner.imageUrl = urlImage;
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
      this.selectedBanner.bannerImageURL = null;
    }
  }

  async save() {
    this.saving = true;
    for (const value of this.bannersList) {
      if (value.segment === this.selectedBanner.segment) {
        value.redirectPath = this.selectedBanner.redirectPath;
        value.imageUrl = this.selectedBanner.imageUrl;
        value.categoryId = this.selectedBanner.categoryId;
        value.benefitId = this.selectedBanner.benefitId;
      }
    }
    await this.firebaseService.getFirebaseCollection('appData').doc('dashboardPointsConfig').set
    ({
      banners: this.bannersList
    }, {merge: true});
    this.saving = false;
    this.showModalSaved();
  }

  showModalSaved() {
    this.modalDialogService.openModal('saveSuccessBannerConfig')
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.router.navigate(['/home']);
        }
      });
  }

  public get validBannerData(): boolean {
    if (this.selectedBanner && this.selectedBanner.redirectPath === 'clientBenefits') {
      return this.selectedBanner.benefitId;
    } else if (this.selectedBanner && this.selectedBanner.redirectPath === 'redeem') {
      return this.selectedBanner.categoryId;
    }
  }
}
