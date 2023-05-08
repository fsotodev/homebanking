import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
@Component({
  selector: 'app-download-benefit-codes',
  templateUrl: './download-benefit-codes.component.html',
  styleUrls: ['./download-benefit-codes.component.scss']
})
export class DownloadBenefitCodesComponent implements OnInit {

  loading: boolean;
  formGroup: FormGroup;
  benfit: any;
  benefitExist = false;
  showWarn = false;
  percCodesCommited: number;

  constructor(
    private firebase: FirebaseService,
    private location: Location,
  ) {
    this.loading = false;
    this.percCodesCommited = 0;
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
    const fileName = 'benefit_codes_' + this.formGroup.get('benefit').value;
    this.save(fileName, fileContent);
    this.loading = false;
  }

  save(filename: string, fileContent: string) {
    const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8' });
    saveAs.saveAs(blob, filename + '.csv');
  }

  async createCSVFile() {
    this.percCodesCommited = 10;
    const delimiter = ',';
    const codes = await this.firebase.getBenefitCodes(this.formGroup.get('benefit').value);
    this.percCodesCommited = 30;
    let fileContent = '';

    const maxRowsToUpload = codes.length;

    fileContent +=
      'ID_BENEFICIO' + delimiter +
      'CODIGO' + delimiter +
      'PERIODO\n';

    let counter = 0;
    for (const codeRef of codes) {
      const code = codeRef.data();
      fileContent +=
        (code['benefitId'] ? code['benefitId'] : '') + delimiter +
        (code['code'] ? code['code'] : '') + delimiter +
        (code['period'] ? code['period'] : '') + '\n';
      counter++;
      this.percCodesCommited = Math.floor(30 + (counter / maxRowsToUpload * 70));
    }

    if (!maxRowsToUpload) {
      this.percCodesCommited = 100;
    }

    return fileContent;
  }

  getParsedDate(date: any) {
    return !!date ? moment(date).format('DD-MM-YYYY') : 'Sin fecha registrada';
  }

}
