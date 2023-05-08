import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '@apps/services/firebase.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { parse } from 'papaparse';
import { UtilsService } from '@apps/services/utils.service';

@Component({
  selector: 'app-login-config',
  templateUrl: './login-config.component.html',
  styleUrls: ['./login-config.component.scss']
})
export class LoginConfigComponent implements OnInit {
  loading: boolean;
  loadingWhiteList: boolean;
  loadDigits: boolean;
  loginConfig: any;
  tabSelected = 0;
  platformName: string;
  platformForm: FormGroup;
  digits = [
    {digit: '0', active: 0},
    {digit: '1', active: 0},
    {digit: '2', active: 0},
    {digit: '3', active: 0},
    {digit: '4', active: 0},
    {digit: '5', active: 0},
    {digit: '6', active: 0},
    {digit: '7', active: 0},
    {digit: '8', active: 0},
    {digit: '9', active: 0},
    {digit: 'k', active: 0},
  ];
  firstFormArray: any;
  digitsArray: any;
  saving: boolean;
  platform: string;
  loadingCsv: boolean;
  file: FileList;
  csvData: any[];
  fileName: string;
  validFile: boolean;
  loadedRuts: string;
  percUsersCommited: number;
  progressWhiteList: number;

  constructor(
    public firebaseService: FirebaseService,
    private router: Router,
    private modalDialogService: ModalDialogService,
    private utils: UtilsService
  ) {
    this.loading = true;
    this.loadingWhiteList = false;
    this.loadDigits = true;
    this.saving = false;
    this.platformForm = new FormGroup({
      platformMap: new FormControl('',
        Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(1),
          Validators.required])),
      groups: new FormArray([]),
      countLimit: new FormControl('',
        Validators.compose([])),
      collection: new FormControl('',
        Validators.compose([
          Validators.minLength(1)])),
    });
  }

  async ngOnInit() {
    this.loading = true;
    this.loadDigits = true;
    this.saving = false;
    await this.loadLoginConfig();
    this.addCheckBoxes();
    this.loading = false;
  }

  public async loadLoginConfig() {
    const doc = await this.firebaseService.getConfig('login');
    this.loginConfig = doc.data();
  }

  public tabChanged(tabEvent: MatTabChangeEvent) {
    this.tabSelected = tabEvent.index;
  }

  public addCheckBoxes() {
    if (!this.firstFormArray) {
      this.digits.forEach((digit, i) => {
        const control = new FormControl(digit.active === 1);
        (this.platformForm.controls.groups as FormArray).push(control);
      });
      this.firstFormArray = this.platformForm.controls.groups.value;
    }
  }

  public select(value: any) {
    this.loadDigits = true;
    this.platformForm.controls.groups.reset();
    switch (value) {
    case 'android':
      this.digitsArray = this.loginConfig.throttling.androidExcludedDV;
      this.platform = 'androidExcludedDV';
      break;
    case 'ios':
      this.digitsArray = this.loginConfig.throttling.iosExcludedDV;
      this.platform = 'iosExcludedDV';
      break;
    case 'desktop':
      this.digitsArray = this.loginConfig.throttling.desktopExcludedDV;
      this.platform = 'desktopExcludedDV';
      break;
    }
    this.digitsArray.forEach((digit: string) => {
      if (digit === 'k') {
        digit = '10';
      }
      this.platformForm.controls.groups.get(digit.toLowerCase()).setValue(true);
    });
    this.loadDigits = false;
  }

  submit() {
    this.saving = true;
    this.modalDialogService.openModal('loginDigitsConfirm').then(async (btnPressed) => {
      if (btnPressed === 'right') {
        this.saving = true;
        const digitsChecked = [];
        for (let index = 0; index < this.platformForm.controls.groups.value.length; index++) {
          const element = this.platformForm.controls.groups.value[index];
          if (element) {
            digitsChecked.push(this.digits[index].digit);
          }
        }
        await this.firebaseService.updateLoginDigits(digitsChecked, this.platform);
        await this.loadLoginConfig();
        this.saving = false;
        this.modalDialogService.openModal('updateSuccessLoginDigits').then(async (btnPressed2) => {
          if (btnPressed2 === 'right') {
            this.router.navigate(['/home']);
          }
        });
      }
      if (btnPressed === 'left') {
        this.saving = false;
      }
    });
    this.saving = false;
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  disabledSave() {
    return (JSON.stringify(this.firstFormArray) === JSON.stringify(this.platformForm.controls.groups.value)
      || this.loadDigits || this.saving);
  }

  disable() {
    this.saving = true;
    this.modalDialogService.openModal('disableDigitsConfirm').then(async (btnPressed) => {
      if (btnPressed === 'right') {
        this.platformForm.controls.platformMap.reset();
        await this.firebaseService.updateLoginDigits([], 'androidExcludedDV');
        await this.firebaseService.updateLoginDigits([], 'iosExcludedDV');
        await this.firebaseService.updateLoginDigits([], 'desktopExcludedDV');
        await this.loadLoginConfig();
        this.modalDialogService.openModal('updateSuccessLoginDigits').then(async (btnPressed2) => {
          if (btnPressed2 === 'right') {
            this.router.navigate(['/home']);
          }
        });
      }
    });
    this.saving = false;
  }

  submitPlatforms() {
    this.saving = true;
    this.modalDialogService.openModal('platformsConfirm').then(async (btnPressed) => {
      if (btnPressed === 'right') {
        await this.firebaseService.updateLoginConfig(this.loginConfig);
        this.modalDialogService.openModal('updateSuccessConfigLogin').then(async (btnPressed2) => {
          if (btnPressed2 === 'right') {
            this.router.navigate(['/home']);
          }
        });
        this.saving = false;
      }
    });
  }

  uploadFile(event: FileList) {
    this.file = null;
    this.loadingCsv = true;
    this.csvData = [];
    if (event.length > 0) {
      this.fileName = event[0].name;
      const filename = event[0].name.split('.');
      if (filename[filename.length - 1].toLocaleLowerCase() === 'csv') {
        this.file = event;
        parse(event.item(0), {
          complete: async (result) => {
            if (result.data.length > 1200000) {
              this.loadingCsv = false;
              this.validFile = false;
              this.modalDialogService.openModal('csvLimitError');
              return false;
            }
            // @ts-ignore
            if (result.data[0].length > 1) {
              this.loadingCsv = false;
              this.validFile = false;
              this.modalDialogService.openModal('csvFormatError');
              return false;
            }
            this.csvData = await this.sanitizeData(result.data);
            this.csvData = await this.utils.formatRutsCsvData(this.csvData);
            this.loadedRuts = this.csvData.length.toString();
            this.loadingCsv = false;
            this.validFile = true;
          }
        });
        return;
      } else {
        this.modalDialogService.openModal('csvUploadError');
        return false;
      }
    } else {
      this.loadingCsv = false;
      this.validFile = false;
    }
  }

  async sanitizeData(data: any[]): Promise<any> {
    return data.filter((row) => !!row[0]);
  }

  async uploadCodes() {
    this.loadingWhiteList = true;
    const whiteList = `whiteList/${this.firebaseService.getTimestamp()}/list`;
    this.firebaseService.updloadWhiteListBatch(whiteList, this.csvData, this.commit,
    ).then(async () => {
      this.loadingWhiteList = false;
      this.firebaseService.update$('config/login', { whiteListCollection: whiteList });
      this.loginConfig.whiteListCollection = whiteList;
      this.showModalSuccess();
    })
      .catch((error) => {
        console.error(error);
        this.showModalWhenError();
        this.loadingWhiteList = false;
      });
  }

  commit = (percUsersCommited: number) => {
    this.progressWhiteList = percUsersCommited;
  };

  showModalWhenError() {
    this.modalDialogService.openModal('genericError')
      .then((btnPressed) => {
        if (btnPressed === 'right') {
          this.router.navigate(['/home']);
        }
      });
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

  cleanForm() {
    this.csvData = null;
    this.file = null;
    this.validFile = false;
  }
}
