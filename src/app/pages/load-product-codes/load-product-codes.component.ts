import { parse } from 'papaparse';

import { Location } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Product } from '../../models/product';
import { AuthFirebaseService} from '@apps/shared/services/auth/auth-firebase.service';
import { FirebaseService } from '../../services/firebase.service';
import { ModalDialogService } from '../../services/modal-dialog.service';
import { ProductTransactionsService } from '../../services/productTransactions.service';
import { MatTableDataSource } from '@angular/material/table';
import { ProductsService } from '@apps/services/products.service';
import { User } from '@apps/shared/models/user.interface';

@Component({
  selector: 'app-load-product-codes',
  templateUrl: './load-product-codes.component.html',
  styleUrls: ['./load-product-codes.component.scss']
})
export class LoadProductCodesComponent implements OnInit {
  @ViewChild('fileUpload', {static: false}) inputFile: ElementRef;
  CODES_GROUPS_SIZE = 100;
  productsDataSource = new MatTableDataSource();
  displayedProductsColumns = [
    'category', 'fullName', 'sku', 'active'
  ];
  selectedProduct: any;
  csvData: any[];
  loading: boolean;
  file: FileList;
  filename: string;
  percCodesCommited: number;
  uploadedCodes: number;
  validFile: boolean;
  formGroup: FormGroup;
  products: Product[];
  inactiveProducts: Product[];
  user: User;
  errorMessage: string;
  isGifcard: boolean;
  isExperienceKey: boolean;
  isImgLoaded: boolean;
  errorUploadingCodes: boolean;
  groupCodeSize: number;

  constructor(
    private modalDialogService: ModalDialogService,
    private firebase: FirebaseService,
    private productTransactionService: ProductTransactionsService,
    private authService: AuthFirebaseService,
    private location: Location,
    private router: Router,
    private productService: ProductsService
  ) {
    this.loading = true;
    this.isImgLoaded = false;
    this.percCodesCommited = 0;
    this.uploadedCodes = 0;
    this.groupCodeSize = 0;
    this.errorUploadingCodes = false;
    this.validFile = false;
  }

  async ngOnInit() {
    this.formGroup = new FormGroup({
      technicalDate: new FormControl('', Validators.required)
    });
    this.products = await this.productTransactionService.getProducts();
    this.products.sort((a, b) => a.fullName.toLowerCase().localeCompare(b.fullName.toLowerCase()));
    this.inactiveProducts = this.products.filter(product => !product.active);
    this.products = this.products.filter(product => product.active);
    this.productsDataSource.data = this.products;
    this.user = await this.authService.userInfo();
    this.loading = false;
  }

  public uploadFile(event: FileList) {
    this.errorMessage = '';
    this.file = null;
    this.loading = true;
    this.csvData = [];

    if (this.checkInputFile(event)) {
      this.file = event;
      parse(event.item(0), {
        complete: async (result, file) => {
          await this.completeValidateFile(result, file);
        }
      });
    }
  }

  sanatizeData(data: any[]) {
    return data.filter((row) => row[0] != null);
  }


  async uploadCodes() {
    this.loading = true;
    if (this.file && this.file.length > 0) {
      if ( await this.uploadGroupsCodes() ) {
        this.showProductCodes();
        this.cleanForm();
        this.loading = false;
      }
    }
  }

  async uploadGroupsCodes() {
    const csvDataGroups = this.getCodesGroups();
    this.groupCodeSize = csvDataGroups.length;
    const perc =  100 * (1 / csvDataGroups.length);

    for (const csvDataGroup of csvDataGroups) {
      await this.uploadGroupCode(csvDataGroup, perc);
      if (this.errorUploadingCodes) {
        this.loading = false;
        this.showModalWhenError();
        return false;
      }
    }
    return true;
  }

  goBack() {
    this.location.back();
  }

  showModalSuccess() {
    this.modalDialogService.openModal('uploadCodesSuccess')
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.cleanForm();
        } else {
          this.router.navigate(['/home']);
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

  cleanForm() {
    this.formGroup.reset();
    this.csvData = null;
    this.file = null;
    this.validFile = false;
    this.percCodesCommited = 0;
    this.uploadedCodes = 0;
  }

  async showProductCodes() {
    const sku = this.selectedProduct.sku;
    if (!sku) {
      this.errorMessage = 'Debes seleccionar un producto';
      return;
    }
    this.errorMessage = '';
    this.modalDialogService.openModalProductCodes('modalTableCodes', { sku });
  }

  showModalErrorUpload(error: string) {
    this.loading = false;
    this.errorMessage = '';
    this.modalDialogService.openModal(error)
      .then((btnPressed) => {
        if (btnPressed === 'right') {
          this.router.navigate(['/home']);
        } else {
          this.inputFile.nativeElement.value = '';
          this.validFile = false;
        }
      });
  }

  applyFilterProduct(filterValue: string) {
    this.productsDataSource.filter = filterValue.trim().toLowerCase();
  }


  public selectProduct(product) {
    this.selectedProduct = product;
    this.isGifcard = product.category === 'gift-card';
    this.isExperienceKey = product.codeType && product.codeType === 'normalmasclave' && !this.isGifcard;
  }

  public returnToProduct() {
    this.selectedProduct = undefined;
    this.applyFilterProduct('');
    this.cleanForm();
  }

  public setActiveProducts(active: boolean) {
    this.productsDataSource.data = active ? this.products : this.inactiveProducts;
  }

  private checkInputFile(event: FileList) {
    if (event.length <= 0) {
      this.loading = false;
      this.validFile = false;
      return false;
    }

    const filename = event[0].name.split('.');
    if (filename[filename.length - 1].toLocaleLowerCase() !== 'csv') {
      this.modalDialogService.openModal('csvUploadError');
      this.loading = false;
      this.validFile = false;
      return false;
    }
    return true;
  }

  private async completeValidateFile(result, file) {
    this.filename = file.name;
    if (!this.validateRows(result.data, this.getColumnsLength(), this.isGifcard ? 20 : 19)) {
      this.showModalErrorUpload(this.errorMessage);
      return;
    }

    this.csvData = this.sanatizeData(result.data);
    const validCodes = await this.firebase.validCodes(this.csvData, this.user, this.selectedProduct.sku);
    if (!validCodes) {
      this.showModalErrorUpload('duplicatedCodeError');
      return;
    }
    this.loading = false;
    this.validFile = true;
  }

  private validateRows(rows: any[], columnsLength: number, maxLen: number): boolean {
    for (const row of rows) {
      if (!this.validateRow(row, columnsLength, maxLen)) {
        return false;
      }
    }
    return true;
  }

  private validateRow(row: any[], columnsLength: number, maxLen: number): boolean {
    return this.validateColumnsLength(row, columnsLength)
      && this.validateMaxLength(row, maxLen)
      && this.validateMinLength(row, maxLen)
    ;
  }

  private validateColumnsLength(row: any[], columnsLength: number) {
    if (row.length !== columnsLength) {
      this.errorMessage = 'errorTypeCodeAssociate';
    }
    return !this.errorMessage;
  }

  private validateMaxLength(row: any[], maxLen: number): boolean {
    if (row.some((x) => x.trim().length > maxLen)) {
      this.errorMessage = 'errorTypeMaxLength';
    }
    return !this.errorMessage;
  }

  private validateMinLength(row: any[], maxLen: number): boolean {
    if (row.some((x) => x.trim().length < 1)) {
      this.errorMessage = 'errorTypeMinLength';
    }
    return !this.errorMessage;
  }

  private getColumnsLength(): number {
    return 1 + (this.isGifcard ? 2 : 0) + (this.isExperienceKey ? 1 : 0);
  }

  private getCodesGroups(): any[] {
    const csvDataGroups = [];
    let size = this.CODES_GROUPS_SIZE;
    if (this.csvData.length < this.CODES_GROUPS_SIZE) {
      size = this.csvData.length;
    }
    for (let i = 0; i < this.csvData.length; i += size) {
      csvDataGroups.push(this.csvData.slice(i, i + size));
    }
    return csvDataGroups;
  }

  private async uploadGroupCode(csvDataGroup, perc: number) {
    const body = {
      data: csvDataGroup,
      sku: this.selectedProduct.sku,
      category: this.selectedProduct.category,
      technicalExpirationDate: new Date(this.formGroup.get('technicalDate').value),
      filename: this.filename
    };
    await this.productService.postLoadProductCodes(body)
      .then(() => {
        this.uploadedCodes = this.uploadedCodes + csvDataGroup.length;
        this.percCodesCommited = Math.round(100 * (this.uploadedCodes / this.csvData.length));
      })
      .catch((error) => {
        console.error(error);
        this.errorUploadingCodes = true;
      });
  }
}
