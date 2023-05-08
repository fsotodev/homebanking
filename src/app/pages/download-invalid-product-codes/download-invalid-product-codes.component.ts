import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ProductTransactionsService } from '../../services/productTransactions.service';
import { Product } from '../../models/product';
import { Location } from '@angular/common';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalDialogComponent } from '../shared-components/modal-dialog/modal-dialog.component';
import { User } from '@apps/shared/models/user.interface';
import { AuthFirebaseService } from '@apps/shared/services/auth/auth-firebase.service';
import { ModalDialogService } from '@apps/services/modal-dialog.service';

@Component({
  selector: 'app-download-product-codes',
  templateUrl: './download-invalid-product-codes.component.html',
  styleUrls: ['./download-invalid-product-codes.component.scss']
})
export class DownloadInvalidProductCodesComponent implements OnInit {
  WAITING_TIME = 10;
  PREFIX_LS = 'invalid-';
  initLoading: boolean;
  loading: boolean;
  formGroup: FormGroup;
  categories: any;
  products: any;
  selectedProducts: any = [];
  percCodesCommited: number;
  validCodes: boolean;
  productQuantity = 0;
  userInfo: User;
  requestReports: Promise<any[]>;
  codeRequested = false;
  invalidStock = 0;

  get percCommited() {
    return this.firebase.percProductsCommited > 0 ? this.firebase.percProductsCommited : this.percCodesCommited;
  }

  get loadingData() {
    return this.percCodesCommited > 0 && this.percCodesCommited < 100;
  }

  constructor(
    private firebase: FirebaseService,
    private productTransactionService: ProductTransactionsService,
    private authService: AuthFirebaseService,
    private location: Location,
    private dialog: MatDialog,
    private modalDialogService: ModalDialogService
  ) {
    this.loading = false;
    this.percCodesCommited = 0;
  }

  async ngOnInit() {
    this.initLoading = true;

    this.formGroup = new FormGroup({
      product: new FormControl({ value: '', disabled: true }, Validators.required),
      category: new FormControl('', Validators.required)
    });
    this.categories = await this.productTransactionService.getCategories();
    this.products = await this.productTransactionService.getProducts(true);
    this.selectedProducts = this.products;
    this.categories = this.categories.sort(
      (a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 :
        ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));
    this.userInfo = await this.authService.userInfo();
    this.getCodeRequested(this.userInfo.uid);

    this.initLoading = false;

  }
  async getProductInvalidStock(product: string) {
    this.invalidStock = await this.productTransactionService.hasCodesStock(product, false);
  }

  getProductsByCategory(): Array<Product> {
    if (!this.products) {
      return new Array<Product>();
    }
    return this.products.filter(p => p.category === this.formGroup.get('category').value);
  }

  changeSelectCategory() {
    this.formGroup.get('product').setValue(null);
    this.formGroup.get('product').enable();
    this.selectedProducts = this.products.filter(p => p.category === this.formGroup.get('category').value);
  }

  async changeSelectProduct() {
    this.initLoading = true;
    await this.getProductInvalidStock(this.formGroup.get('product').value);
    this.initLoading = false;
  }

  goBack() {
    this.location.back();
  }

  cleanForm() {
    this.formGroup.reset();
  }

  async downloadFile() {
    try {
      this.loading = true;
      const fileContent = await this.createCSVFile();
      const fileName = 'invalid-codes' + this.formGroup.get('product').value;
      this.save(fileName, fileContent);
      this.saveLog(true);
      this.loading = false;
    } catch (error) {
      this.modalDialogService.openModal('genericError')
        .then((btnPressed) => {
          this.percCodesCommited = 0;
          this.firebase.percProductsCommited = 0;
          this.loading = false;
          if (btnPressed === 'right') {
            this.downloadFile();
          }
        });
    }
  }

  async saveLog(allCodes = false) {
    let categoryId = 'all';
    let productId = 'all';

    if (!allCodes) {
      categoryId = this.formGroup.get('category').value;
      productId = this.formGroup.get('product').value;
    }
    const lastUpdateInfoRef = await this.firebase.addAdminLog('download-invalid-product-codes', {
      categoryId,
      sku: productId,
      quantity: this.productQuantity
    });
  }


  save(filename: string, fileContent: string) {
    const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8' });
    saveAs.saveAs(blob, filename + '.csv');
  }

  async createCSVFile() {
    this.percCodesCommited = 10;
    const delimiter = ',';
    const codes = await this.firebase.getCodes(this.formGroup.get('product').value, false);

    this.percCodesCommited = 30;
    let fileContent = '';

    const maxRowsToUpload = codes.length;

    fileContent +=
      'CODE' + delimiter +
      'CATEGORIA' + delimiter +
      'NOMBRE_PRODUCTO' + delimiter +
      'FOLIO' + delimiter +
      'FECHA_CARGA' + delimiter +
      'SKU' + delimiter +
      'FECHA_VENCIMIENTO' + delimiter +
      'EXPIRADO_EL\n';

    let counter = 0;
    for (const code of codes) {
      fileContent +=
        (code['code'] ? code['code'] : '') + delimiter +
        (code['category'] ? code['category'] : '') + delimiter +
        (code['fullName'] ? code['fullName'] : '') + delimiter +
        (code['productFolio'] ? code['productFolio'] : '') + delimiter +
        (code['productUploadedAt'] ? this.getParsedDate(new Date(code['productUploadedAt'])) : '') + delimiter +
        (code['sku'] ? code['sku'] : '') + delimiter +
        (code['technicalExpirationDate'] ? this.getParsedDate(new Date(code['technicalExpirationDate'])) : '') + delimiter +
        (code['expiratedAt'] ? this.getParsedDate(new Date(code['expiratedAt'])) : '') + '\n';
      counter++;
      this.percCodesCommited = Math.floor(30 + (counter / maxRowsToUpload * 70));
    }

    if (codes.length === 0) {
      this.percCodesCommited = 100;
    }

    this.productQuantity = codes.length;

    return fileContent;
  }

  getParsedDate(date: any) {
    return !!date ? moment(date).format('DD-MM-YYYY HH:mm:ss') : 'Sin fecha registrada';
  }

  public async requestCodeReport() {
    this.loading = true;
    const request = {
      user: this.userInfo.displayName,
      email: this.userInfo.email,
      type: 'invalidCodes',
      startDate: new Date(),
      status: 'pending',
      uid: this.userInfo.uid
    };
    this.firebase.requestProductCodesReport(request)
      .then(result => {
        this.loading = false;
        this.codeRequested = true;
        this.setCodeRequested(this.userInfo.uid);
        const modalConfig = new MatDialogConfig();
        modalConfig.autoFocus = true;
        modalConfig.data = {
          height: '140px',
          width: '432px',
          modalType: 'codeReportGenerated'
        };
        this.saveLog(true);
        this.dialog.open(ModalDialogComponent, modalConfig);
      });
  }

  private setCodeRequested(uid: string) {
    localStorage.setItem(this.PREFIX_LS + uid, new Date().toString());
  }

  private getCodeRequested(uid: string) {
    const codeRequestedStorage = localStorage.getItem(this.PREFIX_LS + uid);
    const MS_PER_MINUTE = 60000;
    const startDate = new Date(new Date().getTime() - this.WAITING_TIME * MS_PER_MINUTE);
    this.codeRequested = codeRequestedStorage && new Date(codeRequestedStorage) > startDate;
  }

}
