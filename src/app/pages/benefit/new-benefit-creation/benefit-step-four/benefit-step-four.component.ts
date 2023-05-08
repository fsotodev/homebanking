import { Component, OnInit } from '@angular/core';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { NewBenefitService } from '@apps/services/newBenefit.service';
import { parse } from 'papaparse';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '@apps/services/firebase.service';
import { NewBenefit } from '@apps/models/new-benefit';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-benefit-step-four',
  templateUrl: './benefit-step-four.component.html',
  styleUrls: ['./benefit-step-four.component.scss']
})
export class BenefitStepFourComponent implements OnInit {
  isGold: boolean;
  isSilver: boolean;
  optType: string;
  optCode: string;
  siteUrl: string;
  termsAndConditions: string;
  goldBenefitDiscount: string;
  goldBenefitDetail: string;
  silverBenefitDiscount: string;
  silverBenefitDetail: string;
  additionalDescriptionGoldSilver: string;
  startDate: any;
  endDate: any;
  orderPriority: number;
  uniqueCode: string;

  benefitDataCsv: Array<any> = [];
  csvData: any[];
  id: string;
  isUploadingCodes;
  percCodesCommited: number;
  newBenefit: NewBenefit;
  isUploadingRuts: boolean;
  variable: boolean;
  unique: boolean;
  showCodeSection: boolean;
  durationText: string;
  listBenefitPathcode: string[] = [];
  months = {
    1: 'Enero',
    2: 'Febrero',
    3: 'Marzo',
    4: 'Abril',
    5: 'Mayo',
    6: 'Junio',
    7: 'Julio',
    8: 'Agosto',
    9: 'Septiembre',
    10: 'Octubre',
    11: 'Noviembre',
    12: 'Diciembre'
  };
  fourthStepForm: FormGroup;

  constructor(
    public newBenefitService: NewBenefitService,
    private modalDialogService: ModalDialogService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService) { }

  async ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.showCodeSection = this.id !== null && this.newBenefitService.modelBenefitOld.newBenefit.type !== 'restofan';
    this.fourthStepForm = new FormGroup({
      hasAdditionalGoldBenefit: new FormControl(''),
      goldBenefitDetail: new FormControl('',
        // Validators.compose([
        //   Validators.maxLength(80),
        //   Validators.minLength(1)
        // ])
      ),
      goldBenefitDiscount: new FormControl('',
        // Validators.compose([
        //   Validators.maxLength(40),
        //   Validators.minLength(1)
        // ])
      ),
      hasAdditionalSilverBenefit: new FormControl(''),
      silverBenefitDetail: new FormControl('',
        // Validators.compose([
        //   Validators.maxLength(80),
        //   Validators.minLength(1)
        // ])
      ),
      silverBenefitDiscount: new FormControl('',
        // Validators.compose([
        //   Validators.maxLength(40),
        //   Validators.minLength(1)
        // ])
      ),
      durationText: new FormControl('',
        // Validators.compose([
        //   Validators.maxLength(40),
        //   Validators.minLength(1),
        //   Validators.required
        // ])
      ),
      orderPriority: new FormControl('',
        // Validators.compose([
        //   Validators.maxLength(2),
        //   Validators.minLength(1),
        //   Validators.pattern('^[0-9]*$'),
        //   Validators.required
        // ])
      ),
      uniqueCode: new FormControl('',
        // Validators.compose([
        //   Validators.maxLength(100)
        // ])
      ),
      termsAndCondition: new FormControl('',
        // Validators.compose([
        //   Validators.maxLength(2000)
        // ])
      ),
      codeType: new FormControl(''),
      optCode: new FormControl(),
      siteUrl: new FormControl('',
        // Validators.compose([
        //   Validators.maxLength(100)
        // ])
      ),
      startDate: new FormControl('', [
        // Validators.minLength(1),
        // Validators.required,
        // this.validateDate
      ]),
      endDate: new FormControl('', [
        // Validators.minLength(1),
        // Validators.required,
        // this.validateDate
      ]),
    });
    this.setModel();
    this.startDate = this.newBenefitService.modelBenefitOld.newBenefit.startDate;
    this.endDate = this.newBenefitService.modelBenefitOld.newBenefit.endDate;
  }

  setModel = () => {
    this.isGold = this.newBenefitService.modelBenefitOld.newBenefit.hasAdditionalGoldBenefit;
    this.goldBenefitDetail = this.newBenefitService.modelBenefitOld.newBenefit.goldBenefitDetail;
    this.goldBenefitDiscount = this.newBenefitService.modelBenefitOld.newBenefit.goldBenefitDiscount;
    this.isSilver = this.newBenefitService.modelBenefitOld.newBenefit.hasAdditionalSilverBenefit;
    this.silverBenefitDetail = this.newBenefitService.modelBenefitOld.newBenefit.silverBenefitDetail;
    this.silverBenefitDiscount = this.newBenefitService.modelBenefitOld.newBenefit.silverBenefitDiscount;
    this.durationText = this.newBenefitService.modelBenefitOld.newBenefit.durationText;
    this.orderPriority = this.newBenefitService.modelBenefitOld.newBenefit.orderPriority;
    this.uniqueCode = this.newBenefitService.modelBenefitOld.newBenefit.uniqueCode;
    this.termsAndConditions = this.newBenefitService.modelBenefitOld.newBenefit.termsAndCondition;
    this.optType = this.newBenefitService.modelBenefitOld.newBenefit.codeType;
    this.optCode = this.newBenefitService.modelBenefitOld.newBenefit.codeSubType;
    this.siteUrl = this.newBenefitService.modelBenefitOld.newBenefit.siteUrl;
    this.listBenefitPathcode = this.newBenefitService.modelBenefitOld.newBenefit.codesFilePath;
  };
  validateDate(e): any {
    return e.value !== '' && e.value instanceof Date ? null : { notValid: true };
  }

  transformDate = (dateInput) => {
    if (!dateInput) {
      return '';
    }
    const dateSplit = dateInput.toLocaleDateString().split('/');
    this.newBenefitService.modelBenefitOld.newBenefit.durationText =
      `hasta el ${dateSplit[0]} de ${this.months[dateSplit[1]]} ${dateSplit[2]}`;
  };

  async uploadBenefitCode(event: FileList) {
    this.benefitDataCsv = [];
    this.csvData = [];
    if (event.length > 0) {
      const fileExtension = event[0].name.split('.').pop();
      if (fileExtension !== 'csv') {
        this.modalDialogService.openModal('csvUploadError');
        return false;
      }
      parse(event.item(0), {
        complete: (result, file) => {
          // @ts-ignore
          this.benefitDataCsv.push(...result.data[0]);
          this.csvData = this.parseData(result.data, 'benefitCodes');
          if (this.benefitDataCsv[0] !== this.id) {
            this.modalDialogService.openModal('idUploadError');
            return false;
            // @ts-ignore
          } else if (result.data[0].length !== 3) {
            this.modalDialogService.openModal('columnUploadError');
            return false;
          }
          this.isUploadingCodes = true;
          this.firebaseService.uploadBenefitsBatch('benefitCodes', this.csvData, this.commit, file.name)
            .then(() => {
              this.isUploadingCodes = false;
            })
            .catch((e) => {
              console.log(e);
              this.isUploadingCodes = false;
              this.modalDialogService.openModal('uploadError')
                .then((btnPressed) => {
                  if (btnPressed === 'right') {
                    // @ts-ignore
                    this.uploadBenefitCodes(file);
                  }
                });
            });
        }
      });
    } else {
      this.newBenefit.codesFilePath.push(null);
    }
  }

  async uploadBenefitRuts(event: FileList) {
    this.benefitDataCsv = [];
    this.csvData = [];
    if (event.length > 0) {
      const fileExtension = event[0].name.split('.').pop();
      if (fileExtension !== 'csv') {
        this.modalDialogService.openModal('csvUploadError');
        return false;
      }
      parse(event.item(0), {
        complete: (result, file) => {
          // @ts-ignore
          this.benefitDataCsv.push(...result.data[0]);
          this.csvData = this.parseData(result.data, 'benefitRuts');
          if (this.benefitDataCsv[0] !== this.id) {
            this.modalDialogService.openModal('idUploadError');
            return false;
            // @ts-ignore
          } else if (result.data[0].length !== 2) {
            this.modalDialogService.openModal('columnUploadError');
            return false;
          }
          this.isUploadingRuts = true;
          this.firebaseService.uploadBenefitsBatch('benefitRuts', this.csvData, this.commit, file.name)
            .then(() => {
              this.isUploadingRuts = false;
            })
            .catch(() => {
              this.isUploadingRuts = false;
              this.modalDialogService.openModal('uploadError')
                .then((btnPressed) => {
                  if (btnPressed === 'right') {
                    // @ts-ignore
                    this.uploadBenefitRuts(file);
                  }
                });
            });
        }
      });
    } else {
      this.newBenefitService.modelBenefitOld.newBenefit.rutsFilePath.push(null);
    }
  }
  parseData(data: any[], objectType: string) {
    data = this.sanatizeData(data);
    switch (objectType) {
    case 'benefitRuts': {
      return data.map((row) => ({ benefitId: row[0], userId: row[1] }));
    }
    case 'benefitCodes': {
      return data.map((row) => ({ benefitId: row[0], code: row[1], period: row[2] }));
    }
    }
  }

  sanatizeData(data: any[]) {
    return data.filter((row) => (row[0] != null && row[0] !== ''));
  }

  commit = (percCodesCommited: number) => {
    this.percCodesCommited = Number(percCodesCommited.toFixed(2));
  };

  selectOptCode = () => {
    this.optCode = null;
    this.uniqueCode = '';
  };

  saveStepFour = () => {
    this.newBenefitService.modelBenefitOld.newBenefit.siteUrl =
      this.siteUrl === undefined ? '' : this.siteUrl.toString();
    this.newBenefitService.modelBenefitOld.newBenefit.termsAndCondition =
      this.termsAndConditions === undefined ? '' : this.termsAndConditions.toString();
    this.newBenefitService.modelBenefitOld.newBenefit.hasAdditionalGoldBenefit = this.isGold;
    this.newBenefitService.modelBenefitOld.newBenefit.hasAdditionalSilverBenefit = this.isSilver;
    this.newBenefitService.modelBenefitOld.newBenefit.goldBenefitDiscount =
      this.goldBenefitDiscount === undefined ? '' : this.goldBenefitDiscount.toString();
    this.newBenefitService.modelBenefitOld.newBenefit.goldBenefitDetail =
      this.goldBenefitDetail === undefined ? '' : this.goldBenefitDetail.toString();
    this.newBenefitService.modelBenefitOld.newBenefit.silverBenefitDiscount =
      this.silverBenefitDiscount === undefined ? '' : this.silverBenefitDiscount.toString();
    this.newBenefitService.modelBenefitOld.newBenefit.silverBenefitDetail =
      this.silverBenefitDetail === undefined ? '' : this.silverBenefitDetail.toString();
    this.newBenefitService.modelBenefitOld.newBenefit.additionalDescriptionGoldSilver =
      this.additionalDescriptionGoldSilver === undefined ? '' : this.additionalDescriptionGoldSilver.toString();
    this.newBenefitService.modelBenefitOld.newBenefit.startDate =
      this.startDate === undefined ? '' : this.startDate;
    this.newBenefitService.modelBenefitOld.startDate =
      this.startDate === undefined ? '' : this.startDate;
    this.newBenefitService.modelBenefitOld.newBenefit.endDate =
      this.endDate === undefined ? '' : this.endDate;
    this.newBenefitService.modelBenefitOld.endDate =
      this.endDate === undefined ? '' : this.endDate;
    this.newBenefitService.modelBenefitOld.newBenefit.orderPriority = this.orderPriority;
    this.newBenefitService.modelBenefitOld.order = this.orderPriority;
    this.newBenefitService.modelBenefitOld.newBenefit.codeType = this.optType;
    this.newBenefitService.modelBenefitOld.newBenefit.codeSubType = this.optCode;
    this.newBenefitService.modelBenefitOld.newBenefit.uniqueCode =
      this.uniqueCode === undefined ? '' : this.uniqueCode.toString();
    this.newBenefitService.modelBenefitOld.newBenefit.hasCode =
      this.newBenefitService.modelBenefitOld.newBenefit.codeType === 'normal'
      || this.newBenefitService.modelBenefitOld.newBenefit.codeType === 'barcode';
    this.newBenefitService.modelBenefitOld.newBenefit.codesFilePath = this.listBenefitPathcode;
  };

}
