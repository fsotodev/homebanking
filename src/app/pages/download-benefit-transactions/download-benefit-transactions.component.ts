import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
@Component({
  selector: 'app-download-benefit-transactions',
  templateUrl: './download-benefit-transactions.component.html',
  styleUrls: ['./download-benefit-transactions.component.scss']
})
export class DownloadBenefitTransactionsComponent implements OnInit {

  loading: boolean;
  formGroup: FormGroup;
  benfit: any;
  benefitExist = false;
  showWarn = false;
  percTransactionsCommited: number;

  constructor(
    private firebase: FirebaseService,
    private location: Location,
  ) {
    this.loading = false;
    this.percTransactionsCommited = 0;
  }

  async ngOnInit() {
    this.formGroup = new FormGroup({
      benefit: new FormControl('', Validators.required)
    });
  }

  goBack() {
    this.location.back();
  }

  cleanForm() {
    this.formGroup.reset();
  }

  onSearchChange(): void {
    this.showWarn = false;
    this.benefitExist = false;
  }

  benefitCompany(): string {
    if (this.benefitExist) {
      return this.benfit.companyName;
    }
    return '';
  }

  async changeBenefit() {
    this.benfit = await this.firebase.getBenefit(this.formGroup.get('benefit').value);
    if (!!this.benfit) {
      this.benefitExist = true;
    } else {
      this.showWarn = true;
    }
  }

  async downloadFile() {
    this.loading = true;
    const fileContent = await this.createCSVFile();
    const fileName = 'benefit_transactions_' + this.formGroup.get('benefit').value;
    this.save(fileName, fileContent);
    this.loading = false;
  }

  save(filename: string, fileContent: string) {
    const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8' });
    saveAs.saveAs(blob, filename + '.csv');
  }

  async createCSVFile() {
    this.percTransactionsCommited = 10;
    const delimiter = ',';
    const transactions = await this.firebase.getBenefitTransactions(this.formGroup.get('benefit').value);
    this.percTransactionsCommited = 30;
    let fileContent = '';

    const maxRowsToUpload = transactions.length;

    fileContent +=
      'ID_BENEFICIO' + delimiter +
      'CODIGO' + delimiter +
      'FECHA_CREACION' + delimiter +
      'ID_EVENTO' + delimiter +
      'PERIODO' + delimiter +
      'STATUS' + delimiter +
      'RUT\n';

    let counter = 0;
    for (const transactionRef of transactions) {
      const transaction = transactionRef.data();
      fileContent +=
        (transaction['benefitId'] ? transaction['benefitId'] : '') + delimiter +
        (transaction['code'] ? transaction['code'] : '') + delimiter +
        (transaction['createdAt'] ? this.getParsedDate(transaction['createdAt'].toDate()) : '') + delimiter +
        (transaction['eventId'] ? transaction['eventId'] : '') + delimiter +
        (transaction['period'] ? transaction['period'] : '') + delimiter +
        (transaction['status'] ? transaction['status'] : '') + delimiter +
        (transaction['userId'] ? transaction['userId'] : '') + '\n';
      counter++;
      this.percTransactionsCommited = Math.floor(30 + (counter / maxRowsToUpload * 70));
    }

    if (!maxRowsToUpload) {
      this.percTransactionsCommited = 100;
    }

    return fileContent;
  }

  getParsedDate(date: any) {
    return !!date ? moment(date).format('DD-MM-YYYY') : 'Sin fecha registrada';
  }

}
