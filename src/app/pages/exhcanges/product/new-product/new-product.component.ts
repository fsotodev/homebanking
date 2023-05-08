import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Product } from '../../../../models/product';
import { ProductsService } from '../../../../services/products.service';
import { GroupService } from '@apps/services/group.service';
import { Group } from '@apps/models/group';
import { DocumentData } from '@firebase/firestore-types';
import { ModalDialogService } from '../../../../services/modal-dialog.service';
import { FirebaseService } from '../../../../services/firebase.service';
import { AuthFirebaseService } from '@apps/shared/services/auth/auth-firebase.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit {
  product = new Product();
  productForm: FormGroup;
  categories: Array<DocumentData>;
  productGroups: Group[];
  isUploadingImage = false;
  expirationDate: Date;
  id: string;
  text = 'Subir archivo';
  extensions = ['pdf'];
  emitUrl = true;
  urlPdf: string;
  fileFirebaseUrl: string;
  fileUrl: string;

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private modalDialogService: ModalDialogService,
    private firebaseService: FirebaseService,
    private auth: AuthFirebaseService,
    private groupService: GroupService,
  ) {
    this.product.button = {
      show: false,
      text: '',
      url: ''
    };
    this.route.queryParams.subscribe(async (params) => {
      if (params && params.id) {
        this.id = params.id;
        await this.loadProduct();
      }
    });
    this.product.errorMessages = new Map<string, string>();
    this.productForm = new FormGroup({
      categoryMap: new FormControl('',
        Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(1),
          Validators.required])),
      groupMap: new FormControl('',
        Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(1)])),
      fullName: new FormControl('',
        Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(0),
          Validators.required])),
      selectedTitle: new FormControl('',
        Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(0),
          Validators.required])),
      codeType: new FormControl('',
        Validators.compose([
          Validators.required
        ])),
      selectedSubtitle: new FormControl('',
        Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(0)])),
      confirmationSelectedTitle: new FormControl('',
        Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(0),
          Validators.required])),
      successMessage: new FormControl('',
        Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(0),
          Validators.required])),
      actionSelectProduct: new FormControl('',
        Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(0)])),
      value: new FormControl('',
        Validators.compose([
          Validators.maxLength(15),
          Validators.minLength(0),
          Validators.required])),
      points: new FormControl('',
        Validators.compose([
          Validators.maxLength(15),
          Validators.minLength(0),
          Validators.required])),
      limit: new FormControl('',
        Validators.compose([
          Validators.maxLength(15),
          Validators.minLength(0),
          Validators.required])),
      stock: new FormControl('',
        Validators.compose([
          Validators.maxLength(15),
          Validators.required])),
      stockMessage: new FormControl('',
        Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(0),
          Validators.required])),
      deltaForTechnicalDateInDays: new FormControl('',
        Validators.compose([
          Validators.maxLength(3)])),
      giftcardColor: new FormControl('',
        Validators.compose([
          Validators.maxLength(15),
          Validators.minLength(0)])),
      giftcardMultiplier: new FormControl('',
        Validators.compose([
          Validators.maxLength(5),
          Validators.minLength(0)])),
      text: new FormControl('',
        Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(0)])),
      url: new FormControl('',
        Validators.compose([
          Validators.maxLength(2000),
          Validators.minLength(0)])),
      limitExceeded: new FormControl('',
        Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(0),
          Validators.required])),
      outOfStock: new FormControl('',
        Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(0),
          Validators.required])),
      termsAndConditionsPDF: new FormControl('',
        Validators.compose([
          Validators.maxLength(2000),
          Validators.minLength(0),
          Validators.required])),
      termsAndConditionsText: new FormControl('',
        Validators.compose([
          Validators.maxLength(2000),
          Validators.minLength(0)])),
      termsAndConditionsURL: new FormControl('',
        Validators.compose([
          Validators.maxLength(2000),
          Validators.minLength(0)])),
    });
  }

  async ngOnInit() {
    await this.getCategories();
    await this.getProductGroups();
  }

  async getCategories() {
    this.categories = await this.productsService.getCategories();
  }

  getProductGroups = async () => {
    this.productGroups = await this.groupService.getAllCGroups();
  };

  goBack() {
    this.location.back();
  }

  async loadProduct() {
    const product = await this.productsService.getProduct(this.id);
    this.product = product;
    if (!product.button) {
      this.product.button = {
        show: false,
        text: '',
        url: ''
      };
    }
  }

  receiveUrlPdf(url) {
    this.urlPdf = url;
  }

  termsAndConditionsValidator() {
    if (this.product.termsAndConditionsPDF && this.product.termsAndConditionsPDF.length) {
      return true;
    }
    if (this.product.termsAndConditionsText && this.product.termsAndConditionsText.length) {
      return true;
    }
    if (this.product.termsAndConditionsURL && this.product.termsAndConditionsURL.length) {
      return true;
    }
    if (this.urlPdf && this.urlPdf.length) {
      return true;
    }
    return false;
  }

  giftCardFieldsValidator() {
    if (this.product.category === 'gift-card') {
      return !!((this.product.giftcardColor && this.product.giftcardColor.length)
        && (!this.product.hasMultiplier || (this.product.hasMultiplier && this.product.giftcardMultiplier)));
    }
    return true;
  }

  cleanCategoryFields() {
    this.product.giftcardColor = undefined;
    this.product.giftcardMultiplier = undefined;
    this.product.hasMultiplier = undefined;
    this.product.isLatamActive = undefined;
    this.product.isPalumboActive = undefined;
    this.getExpirationDate();
  }

  cleanProduct() {
    this.product = new Product();
    this.product.errorMessages = new Map<string, string>();
    this.product.button = {
      show: false,
      text: '',
      url: ''
    };
    this.fileFirebaseUrl = '';
    this.fileUrl = '';
  }

  getExpirationDate() {
    this.expirationDate = this.categories.find(c => c.categoryId === this.product.category).expirationDate;
  }

  saveProduct() {
    if (this.urlPdf) {
      this.product.termsAndConditionsPDF = this.urlPdf;
    }
    this.productsService.addNewProduct(this.product)
      .then(() => {
        this.showModalWhenTransactionSaved('saveSuccessProduct');
      })
      .catch(() => {
        this.showModalWhenError();
      });
  }

  updateProduct() {
    if (this.urlPdf) {
      this.product.termsAndConditionsPDF = this.urlPdf;
    }
    this.productsService.updateProduct(this.id, this.product)
      .then(() => {
        this.showModalWhenTransactionSaved('updateSuccessProduct');
      })
      .catch(() => {
        this.showModalWhenError();
      });
  }

  async uploadImage(event: FileList, field: string) {
    if (event.length > 0) {
      this.isUploadingImage = true;
      this.firebaseService.uploadFileToFireStorage(event[0], 'products/images')
        .then((urlImage: string) => {
          this.product[field] = urlImage;
          this.isUploadingImage = false;
        })
        .catch(() => {
          this.isUploadingImage = false;
          this.modalDialogService.openModal('genericError')
            .then((btnPressed) => {
              if (btnPressed === 'right') {
                this.uploadImage(event, field);
              }
            });
        });
    } else {
      this.product[field] = null;
    }
  }

  showModalWhenTransactionSaved(modalType: string) {
    this.modalDialogService.openModal(modalType)
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.router.navigate(['/home']);
        } else {
          this.cleanProduct();
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

  validLength(property, maxLength: number) {
    return this.currentLength(property) > maxLength;
  }

  currentLength(property = []) {
    return property ? property.length : 0;
  }

}
