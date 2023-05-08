import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ProductTransactionsService } from '../../services/productTransactions.service';
import { Product } from '../../models/product';
import { Location } from '@angular/common';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
@Component({
  selector: 'app-download-rut-campaign',
  templateUrl: './download-rut-campaign.component.html',
  styleUrls: ['./download-rut-campaign.component.scss']
})
export class DownloadRutCampaignComponent implements OnInit {

  loading: boolean;
  formGroup: FormGroup;
  categories: any;
  products: any;
  percCodesCommited: number;
  params: any[];

  constructor(
    private firebase: FirebaseService,
    private productTransactionService: ProductTransactionsService,
    private location: Location,
  ) {
    this.loading = false;
    this.percCodesCommited = 0;
  }

  async ngOnInit() {
    this.formGroup = new FormGroup({
      product: new FormControl({ value: '', disabled: true }, Validators.required),
      category: new FormControl('', Validators.required)
    });

    this.categories = await this.productTransactionService.getCategories();
    this.products = await this.productTransactionService.getProducts();
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
  }

  goBack() {
    this.location.back();
  }

  cleanForm() {
    this.formGroup.reset();
  }

  async downloadFile() {
    this.loading = true;
    const fileContent = await this.createCSVFile();
    this.save(this.formGroup.get('product').value, fileContent);
    this.loading = false;
  }

  save(sku: string, fileContent: string) {
    const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8' });
    saveAs.saveAs(blob, 'codes ' + sku + '.csv');
  }

  async createCSVFile() {
    const delimiter = ',';
    const codes = await this.firebase.getCodes(this.formGroup.get('product').value);
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
      'FECHA_VENCIMIENTO\n';

    let counter = 0;
    for (const code of codes) {
      fileContent +=
        (code['code'] ? code['code'] : '') + delimiter +
        (code['category'] ? code['category'] : '') + delimiter +
        (code['fullName'] ? code['fullName'] : '') + delimiter +
        (code['productFolio'] ? code['productFolio'] : '') + delimiter +
        (code['productUploadedAt'] ? this.getParsedDate(code['productUploadedAt'].toDate()) : '') + delimiter +
        (code['sku'] ? code['sku'] : '') + delimiter +
        (code['technicalExpirationDate'] ? this.getParsedDate(code['technicalExpirationDate'].toDate()) : '') + '\n';
      counter++;
      this.percCodesCommited = Math.floor(30 + (counter / maxRowsToUpload * 70));
    }
    return fileContent;
  }

  getParsedDate(date: any) {
    return !!date ? moment(date).format('DD-MM-YYYY') : 'Sin fecha registrada';
  }

}
