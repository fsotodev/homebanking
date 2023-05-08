import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '@apps/services/firebase.service';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { ChildActivationStart } from '@angular/router';

@Component({
  selector: 'app-download-product-transactions',
  templateUrl: './download-product-transactions.component.html',
  styleUrls: ['./download-product-transactions.component.scss']
})
export class DownloadProductTransactionsComponent implements OnInit {
  DELIMETER = ',';
  FILE_SUFFIX = 'super_canje_transactions_';
  FILE_TYPE = 'text/csv;charset=utf-8';
  loading: boolean;
  formGroup: FormGroup;
  category: any;
  showWarn = '';
  percTransactionsCommited: number;
  loadingCategory: boolean;
  loadedCategory: boolean;
  creationDate: string;
  categoryStatus: any;
  dateAsk: any;

  constructor(
    private location: Location,
    private firebase: FirebaseService
  ) {
    this.loading = false;
    this.loadingCategory = false;
    this.loadedCategory = false;
    this.percTransactionsCommited = 0;
    this.creationDate = '';
    this.categoryStatus = {};
  }

  ngOnInit(): void {
    const today = new Date();
    this.dateAsk = new Date(today.getFullYear(), today.getMonth(), 1);
    this.formGroup = new FormGroup({
      category: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required)
    });
  }

  public setDate(event, dp) {
    this.dateAsk = event;
    dp.close();
  }

  public goBack() {
    this.location.back();
  }

  public onSearchChange(): void {
    this.showWarn = '';
  }

  public async changeCategory() {
    this.cleanSearch();
    this.loadingCategory = true;
    this.setCategoryInfo(await this.firebase.getCategoryByCategoryId(this.formGroup.get('category').value));
    this.loadingCategory = false;
  }

  public async downloadFile() {
    this.loading = true;
    this.percTransactionsCommited = 10;

    const from = this.dateAsk.toISOString().slice(0, 10);
    const toDate = new Date(this.dateAsk);
    toDate.setMonth(toDate.getMonth() + 1);
    const to = toDate.toISOString().slice(0, 10);

    const transactionsSnapshot = await this.firebase.getProductTransactionsByCategoryIdApi(this.formGroup.get('category').value, from, to);
    const fileContent = await this.createCSVInfo(transactionsSnapshot);
    const fileName = this.FILE_SUFFIX + this.formGroup.get('category').value;
    this.save(fileName, fileContent);
    this.loading = false;
  }

  private save(filename: string, fileContent: string) {
    const blob = new Blob([fileContent], { type: this.FILE_TYPE });
    saveAs.saveAs(blob, filename + '.csv');
  }

  private async createCSVInfo(transactionsSnapshot) {
    this.percTransactionsCommited = 20;
    let fileContent = '';
    const maxRowsToUpload = transactionsSnapshot.length;
    fileContent += this.getHeaderRow();
    let counter = 0;
    for (const transaction of transactionsSnapshot) {
      fileContent +=
        this.getStringRow(transaction['userId']) +
        this.getDateRow(transaction['createdAt']) +
        this.getHourRow(transaction['createdAt']) +
        this.getStringRow(transaction['id']) +
        this.getStringRow(transaction['productFolio']) +
        this.getStringRow(transaction['fullName']) +
        this.getStringRow(transaction['status']) +
        this.getStringRow(transaction['points']) +
        this.getTransactionCode(transaction) + '\n';
      counter++;
      this.percTransactionsCommited = Math.floor(20 + (counter / maxRowsToUpload * 80));
    }

    if (!maxRowsToUpload) {
      this.percTransactionsCommited = 100;
    }

    return fileContent;
  }

  private getStringRow(text: string): string {
    return (text || '') + this.DELIMETER;
  }

  private getDateRow(date: any): string {
    return (date ? this.getParsedDate(date) : '') + this.DELIMETER;
  }

  private getHourRow(date: any): string {
    return (date ? this.getParsedHour(date) : '') + this.DELIMETER;
  }

  private getHeaderRow(): string {
    return 'RUT' + this.DELIMETER +
      'FECHA' + this.DELIMETER +
      'HORA' + this.DELIMETER +
      'PRODUCTO' + this.DELIMETER +
      'FOLIO' + this.DELIMETER +
      'NOMBRE' + this.DELIMETER +
      'STATUS' + this.DELIMETER +
      'PUNTOS' + this.DELIMETER +
      'CODIGO\n';
  }
  private getParsedDate(createdAt: any): string {
    if (createdAt) {
      const date = new Date(this.getSeconds(createdAt) * 1000);
      return moment(date).format('DD-MM-YYYY');
    }
    return 'Sin fecha registrada';
  }

  private getParsedHour(createdAt: any): string {
    if (createdAt) {
      const date = new Date(this.getSeconds(createdAt) * 1000);
      return moment(date).format('HH:mm:ss');
    }
    return 'Sin fecha registrada';
  }

  private getSeconds(date) {
    return date.seconds || date._seconds;
  }

  private cleanSearch() {
    this.showWarn = '';
    this.category = undefined;
    this.loadedCategory = false;
    this.categoryStatus = {};
  }

  private setCategoryInfo(categories) {
    const categoryStatus = {
      true: { class: 'category-active', text: 'Activo' },
      false: { class: 'category-inactive', text: 'Inactivo' },
    };
    if (!categories.length) {
      this.showWarn = 'Categoría no existe';
      return;
    }
    this.category = categories[0].data();
    this.creationDate = this.getParsedDate(this.category.createdAt);
    this.categoryStatus = categoryStatus[this.category.active.toString()];
    this.loadedCategory = true;
  }

  private getTransactionCode(transaction: any) {
    return transaction.codeEncripted || transaction.code || '';
  }
}
