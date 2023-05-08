import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { saveAs } from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-download-logs',
  templateUrl: './download-logs.component.html',
  styleUrls: ['./download-logs.component.scss']
})
export class DownloadLogsComponent implements OnInit {

  loading: boolean;
  formGroup: FormGroup;
  logs: Array<any>;
  logsLen: number;
  logsForDownload: Array<any>;
  emails: Array<any>;
  percCommited: number;
  showWarn = false;
  delimiter = ',';
  public ACTION_LOGS = [
    { id: 'create-campaign', tittle: 'Crear motor campaña' },
    { id: 'update-campaign', tittle: 'Actualizar motor campaña' },
    { id: 'load-campaign-ruts', tittle: 'Cargar ruts en motor campaña' },
    { id: 'create-product', tittle: 'Crear producto' },
    { id: 'update-product', tittle: 'Actualizar producto' },
    { id: 'create-product-transaction', tittle: 'Canje producto' },
    { id: 'load-codes', tittle: 'Cargar códigos producto' },
    { id: 'create-category', tittle: 'Crear categoría' },
    { id: 'update-category', tittle: 'Actualizar categoría' },
    { id: 'download-valid-product-codes', tittle: 'Descargar códigos válidos' },
    { id: 'download-invalid-product-codes', tittle: 'Descargar códigos vencidos' }
  ];

  constructor(
    private firebase: FirebaseService,
    private location: Location,
  ) {
    this.loading = false;
    this.percCommited = 0;
    this.logsLen = 0;
    this.emails = ['Todos'];
  }

  async ngOnInit() {
    this.formGroup = new FormGroup({
      log: new FormControl('', Validators.required),
      email: new FormControl({ value: '', disabled: true }, Validators.required)
    });
  }

  goBack() {
    this.location.back();
  }

  cleanForm() {
    this.formGroup.reset();
  }

  cleanData() {
    this.showWarn = false;
    this.logsLen = 0;
    this.emails = ['Todos'];
  }

  changeSelectAction() {
    this.cleanData();
    this.formGroup.get('email').setValue(null);
    this.formGroup.get('email').enable();
    this.getMails();
  }

  async getMails() {
    await this.changeAction();
    if (!this.logs) {
      return new Array<any>();
    }
    this.logs.forEach(element => {
      if (!this.emails.includes(element.executedBy.email)) {
        this.emails.push(element.executedBy.email);
      }
    });
  }

  async changeAction() {
    this.logs = await this.firebase.getLogsByAction(this.formGroup.get('log').value);
    if (!this.logs) {
      this.showWarn = true;
    }
  }

  getFilteredData() {
    if (!this.logs) {
      return new Array<any>();
    }
    if (this.formGroup.get('email').value === 'Todos') {
      this.logsForDownload = this.logs;
    } else {
      this.logsForDownload = this.logs.filter(lg => lg.executedBy.email === this.formGroup.get('email').value);
    }
    this.logsLen = this.logsForDownload.length;
  }

  async downloadFile(allCodes = false) {
    this.loading = true;
    const fileContent = await this.createCSVFile(allCodes);
    const fileName = allCodes ? 'all-logs' :
      'logs-' + this.formGroup.get('log').value;
    this.save(fileName, fileContent);
    this.loading = false;
  }

  save(filename: string, fileContent: string) {
    const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8' });
    saveAs.saveAs(blob, filename + '.csv');
  }

  async createCSVFile(allCodes = false) {
    this.percCommited = 0;
    const logsList = allCodes ?
      await this.firebase.getAllLogs() :
      this.logsForDownload;
    this.percCommited = 30;
    return this.getContent(allCodes, logsList);
  }

  getContent(allCodes = false, logsList: Array<any>) {
    if (allCodes) {
      return this.getGeneralContent(logsList);
    }
    switch (this.formGroup.get('log').value) {
    case 'create-campaign':
    case 'update-campaign':
      return this.getCampaignContent(logsList);
    case 'load-campaign-ruts':
      return this.getLoadRutsContent(logsList);
    case 'create-product':
    case 'update-product':
      return this.getProductContent(logsList);
    case 'create-product-transaction':
      return this.getProductTransactionContent(logsList);
    case 'load-codes':
      return this.getLoadCodesContent(logsList);
    case 'create-category':
    case 'update-category':
      return this.getCategoryContent(logsList);
    case 'download-valid-product-codes':
    case 'download-invalid-product-codes':
      return this.getProductCodesContent(logsList);
    default: return;
    }
  }

  getGeneralContent(logsList: Array<any>) {
    let fileContent = '';
    const maxRowsToUpload = logsList.length;
    console.log(maxRowsToUpload);

    fileContent +=
      'FECHA_LOG' + this.delimiter +
      'TIPO_ACCION' + this.delimiter +
      'ID' + this.delimiter +
      'EJECUTADO_POR\n';

    let counter = 0;
    for (const logDoc of logsList) {
      fileContent +=
        (logDoc['timestamp'] ? this.getParsedDate(logDoc['timestamp'].toDate()) : '') + this.delimiter +
        (logDoc['action'] ? logDoc['action'] : '') + this.delimiter +
        (logDoc['categoryId'] ? logDoc['categoryId'] :
          logDoc['sku'] ? logDoc['sku'] :
            logDoc['campaignId'] ? logDoc['campaignId'] : '') + this.delimiter +
        (logDoc.executedBy.email ? logDoc.executedBy.email : '') + '\n';
      counter++;
      this.percCommited = Math.floor(30 + (counter / maxRowsToUpload * 70));
    }

    return fileContent;
  }

  getCampaignContent(logsList: Array<any>) {
    let fileContent = '';
    const maxRowsToUpload = logsList.length;

    fileContent +=
      'FECHA_LOG' + this.delimiter +
      'TIPO_ACCION' + this.delimiter +
      'ID' + this.delimiter +
      'ACTIVO_PWA' + this.delimiter +
      'TIPO_CAMP' + this.delimiter +
      'EJECUTADO_POR\n';

    let counter = 0;
    for (const logDoc of logsList) {
      fileContent +=
        (logDoc['timestamp'] ? this.getParsedDate(logDoc['timestamp'].toDate()) : '') + this.delimiter +
        (logDoc['action'] ? logDoc['action'] : '') + this.delimiter +
        (logDoc['campaignId'] ? logDoc['campaignId'] : '') + this.delimiter +
        (logDoc['activePWA'] ? 'SI' : 'NO') + this.delimiter +
        (logDoc['campaigntype'] ? logDoc['campaigntype'] : '') + this.delimiter +
        (logDoc.executedBy.email ? logDoc.executedBy.email : '') + '\n';
      counter++;
      this.percCommited = Math.floor(30 + (counter / maxRowsToUpload * 70));
    }

    return fileContent;
  }

  getLoadRutsContent(logsList: Array<any>) {
    let fileContent = '';
    const maxRowsToUpload = logsList.length;

    fileContent +=
      'FECHA_LOG' + this.delimiter +
      'TIPO_ACCION' + this.delimiter +
      'ID' + this.delimiter +
      'ESTADO' + this.delimiter +
      'NOMBRE_ARCHIVO' + this.delimiter +
      'CANTIDAD_RUTS' + this.delimiter +
      'TIPO_CAMP' + this.delimiter +
      'EJECUTADO_POR\n';

    let counter = 0;
    for (const logDoc of logsList) {
      fileContent +=
        (logDoc['timestamp'] ? this.getParsedDate(logDoc['timestamp'].toDate()) : '') + this.delimiter +
        (logDoc['action'] ? logDoc['action'] : '') + this.delimiter +
        (logDoc['campaignId'] ? logDoc['campaignId'] : '') + this.delimiter +
        (logDoc['status'] ? logDoc['status'] : '') + this.delimiter +
        (logDoc['filename'] ? logDoc['filename'] : '') + this.delimiter +
        (logDoc['ruts'] ? logDoc['ruts'] : '') + this.delimiter +
        (logDoc['campaignType'] ? logDoc['campaignType'] : '') + this.delimiter +
        (logDoc.executedBy.email ? logDoc.executedBy.email : '') + '\n';
      counter++;
      this.percCommited = Math.floor(30 + (counter / maxRowsToUpload * 70));
    }

    return fileContent;
  }

  getProductContent(logsList: Array<any>) {
    let fileContent = '';
    const maxRowsToUpload = logsList.length;

    fileContent +=
      'FECHA_LOG' + this.delimiter +
      'TIPO_ACCION' + this.delimiter +
      'SKU' + this.delimiter +
      'CATEGORIA' + this.delimiter +
      'ACTIVO' + this.delimiter +
      'EJECUTADO_POR\n';

    let counter = 0;
    for (const logDoc of logsList) {
      fileContent +=
        (logDoc['timestamp'] ? this.getParsedDate(logDoc['timestamp'].toDate()) : '') + this.delimiter +
        (logDoc['action'] ? logDoc['action'] : '') + this.delimiter +
        (logDoc['sku'] ? logDoc['sku'] : '') + this.delimiter +
        (logDoc['category'] ? logDoc['category'] : '') + this.delimiter +
        (logDoc['active'] ? 'SI' : 'NO') + this.delimiter +
        (logDoc.executedBy.email ? logDoc.executedBy.email : '') + '\n';
      counter++;
      this.percCommited = Math.floor(30 + (counter / maxRowsToUpload * 70));
    }

    return fileContent;
  }

  getProductTransactionContent(logsList: Array<any>) {
    let fileContent = '';
    const maxRowsToUpload = logsList.length;

    fileContent +=
      'FECHA_LOG' + this.delimiter +
      'TIPO_ACCION' + this.delimiter +
      'SKU' + this.delimiter +
      'CATEGORIA' + this.delimiter +
      'ACTIVO' + this.delimiter +
      'RUT CLIENTE' + this.delimiter +
      'ID TRANSACCION' + this.delimiter +
      'EJECUTADO_POR\n';

    let counter = 0;
    for (const logDoc of logsList) {
      fileContent +=
        (logDoc['timestamp'] ? this.getParsedDate(logDoc['timestamp'].toDate()) : '') + this.delimiter +
        (logDoc['action'] ? logDoc['action'] : '') + this.delimiter +
        (logDoc['sku'] ? logDoc['sku'] : '') + this.delimiter +
        (logDoc['category'] ? logDoc['category'] : '') + this.delimiter +
        (logDoc['active'] ? 'SI' : 'NO') + this.delimiter +
        (logDoc['userId'] ? logDoc['userId'] : '') + this.delimiter +
        (logDoc['transactionRef'] ? logDoc['transactionRef'].id : '') + this.delimiter +
        (logDoc.executedBy.email ? logDoc.executedBy.email : '') + '\n';
      counter++;
      this.percCommited = Math.floor(30 + (counter / maxRowsToUpload * 70));
    }

    return fileContent;
  }

  getLoadCodesContent(logsList: Array<any>) {
    let fileContent = '';
    const maxRowsToUpload = logsList.length;

    fileContent +=
      'FECHA_LOG' + this.delimiter +
      'TIPO_ACCION' + this.delimiter +
      'SKU' + this.delimiter +
      'ESTADO' + this.delimiter +
      'NOMBRE_ARCHIVO' + this.delimiter +
      'CANTIDAD_CODIGOS' + this.delimiter +
      'FECHA_EXPIRACION' + this.delimiter +
      'CATEGORIA' + this.delimiter +
      'EJECUTADO_POR\n';

    let counter = 0;
    for (const logDoc of logsList) {
      fileContent +=
        (logDoc['timestamp'] ? this.getParsedDate(logDoc['timestamp'].toDate()) : '') + this.delimiter +
        (logDoc['action'] ? logDoc['action'] : '') + this.delimiter +
        (logDoc['sku'] ? logDoc['sku'] : '') + this.delimiter +
        (logDoc['status'] ? logDoc['status'] : '') + this.delimiter +
        (logDoc['filename'] ? logDoc['filename'] : '') + this.delimiter +
        (logDoc['codes'] ? logDoc['codes'] : '') + this.delimiter +
        (logDoc['technicalExpirationDate'] ? this.getParsedDate(logDoc['technicalExpirationDate'].toDate()) : '') + this.delimiter +
        (logDoc['category'] ? logDoc['category'] : '') + this.delimiter +
        (logDoc.executedBy.email ? logDoc.executedBy.email : '') + '\n';
      counter++;
      this.percCommited = Math.floor(30 + (counter / maxRowsToUpload * 70));
    }

    return fileContent;
  }

  getCategoryContent(logsList: Array<any>) {
    let fileContent = '';
    const maxRowsToUpload = logsList.length;

    fileContent +=
      'FECHA_LOG' + this.delimiter +
      'TIPO_ACCION' + this.delimiter +
      'ID' + this.delimiter +
      'ACTIVO' + this.delimiter +
      'EJECUTADO_POR\n';

    let counter = 0;
    for (const logDoc of logsList) {
      fileContent +=
        (logDoc['timestamp'] ? this.getParsedDate(logDoc['timestamp'].toDate()) : '') + this.delimiter +
        (logDoc['action'] ? logDoc['action'] : '') + this.delimiter +
        (logDoc['categoryId'] ? logDoc['categoryId'] : '') + this.delimiter +
        (logDoc['active'] ? 'SI' : 'NO') + this.delimiter +
        (logDoc.executedBy.email ? logDoc.executedBy.email : '') + '\n';
      counter++;
      this.percCommited = Math.floor(30 + (counter / maxRowsToUpload * 70));
    }

    return fileContent;
  }

  getProductCodesContent(logsList: Array<any>) {
    let fileContent = '';
    const maxRowsToUpload = logsList.length;

    fileContent +=
      'FECHA_LOG' + this.delimiter +
      'TIPO_ACCION' + this.delimiter +
      'CATEGORIA' + this.delimiter +
      'SKU' + this.delimiter +
      'CANTIDAD' + this.delimiter +
      'EJECUTADO_POR\n';

    let counter = 0;
    for (const logDoc of logsList) {
      fileContent +=
        (logDoc['timestamp'] ? this.getParsedDate(logDoc['timestamp'].toDate()) : '') + this.delimiter +
        (logDoc['action'] ? logDoc['action'] : '') + this.delimiter +
        (logDoc['categoryId'] ? (logDoc['categoryId'] === 'all' ? 'TODAS' : logDoc['categoryId']) : '') + this.delimiter +
        (logDoc['sku'] ? (logDoc['sku'] === 'all' ? 'TODOS' : logDoc['sku']) : '') + this.delimiter +
        (logDoc['quantity'] ? logDoc['quantity'] : 0) + this.delimiter +
        (logDoc.executedBy.email ? logDoc.executedBy.email : '') + '\n';
      counter++;
      this.percCommited = Math.floor(30 + (counter / maxRowsToUpload * 70));
    }

    return fileContent;
  }

  getParsedDate(date: any) {
    return !!date ? moment(date).format('DD-MM-YYYY HH:mm:ss') : 'Sin fecha registrada';
  }

}
