import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { FirebaseService } from '../../../services/firebase.service';
import { ModalDialogService } from '../../../services/modal-dialog.service';
import { sha256 } from 'js-sha256';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IDataLoaded, ICampaignCode } from '../../../models/interfaces/campaign-code';

@Component({
  selector: 'app-load-campaign-codes',
  templateUrl: './load-campaign-codes.component.html',
  styleUrls: ['./load-campaign-codes.component.scss']
})
export class LoadCampaignCodesComponent implements OnInit {

  @ViewChild('inputFile', {static: false}) inputFileButton: ElementRef;
  isUploading: boolean;
  file: FileList;
  formGroup: FormGroup;
  isFileUploadedToFirebase: IDataLoaded;

  get code() {
    return this.formGroup.controls.code;
  }
  get campaignId() {
    return this.formGroup.controls.campaignId;
  }

  constructor(
    private location: Location,
    private firebaseService: FirebaseService,
    private modalDialogService: ModalDialogService,
  ) {
    this.isFileUploadedToFirebase = {
      isLoaded: true,
      hasErrors: false,
    };
    this.isUploading = false;
    this.file = null;
  }

  async ngOnInit() {
    this.formGroup = new FormGroup({
      code: new FormControl('',
        Validators.compose([
          Validators.maxLength(100),
          Validators.minLength(1),
          Validators.required,
        ])),
      campaignId: new FormControl('',
        Validators.compose([
          Validators.maxLength(100),
          Validators.minLength(1),
          Validators.required,
        ])),
    });
  }

  goBack() {
    this.location.back();
  }

  uploadFile(event: FileList) {
    this.file = null;
    if (event.length > 0) {
      const filename = event[0].name.split('.');
      if (filename[filename.length - 1].toLocaleLowerCase() === 'csv') {
        this.file = event;
        return;
      }
    }
  }

  async uploadToFirebase() {
    this.isUploading = true;
    try {
      await this.firebaseService.uploadCSVFile(
        this.file, this.codesCsvRowFormater, { code: this.code.value, campaignId: this.campaignId.value });
      this.modalDialogService.openModal('csvUploadSuccess');
    } catch (error) {
      if (error.code === 'columnUploadError') {
        this.modalDialogService.openModal('columnUploadError');
      } else {
        this.modalDialogService.openModal('uploadError');
      }
    }
    this.isUploading = false;
  }

  codesCsvRowFormater(row: Array<string>, parameters: any): ICampaignCode {
    if (!(row && row.length === 1)) {
      throw { code: 'columnUploadError' };
    }
    return {
      rutHash: sha256(row[0].replace(/[.-]/g, '')),
      code: parameters.code,
      campaignId: parameters.campaignId,
    };
  }

}
