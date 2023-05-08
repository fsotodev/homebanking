import { Component, OnChanges, OnInit } from '@angular/core';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { FirebaseService } from '@apps/services/firebase.service';
import { NewBenefitService } from '@apps/services/newBenefit.service';
import { parse } from 'papaparse';
import { NewBenefit } from '@apps/models/new-benefit';
import { ActivatedRoute } from '@angular/router';
import { BenefitsService } from '@apps/services/benefits.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-upload-codes',
  templateUrl: './upload-codes.component.html',
  styleUrls: ['./upload-codes.component.scss']
})

export class UploadCodesComponent implements OnInit {

  isUploadingCodes = true;
  benefitDataCsv: Array<any> = [];
  csvData: any[];
  percCodesCommited: number;
  newBenefit: NewBenefit;
  id: string;
  resultFile: File;
  listBenefitPathcode: string[] = [];
  benefitData: NewBenefit;
  loader = false;
  loading = true;
  uploadedCodes = [];
  segmentation = {
    segments: [
      'R_GOLD',
      'R_SILVER',
      'R_BRONZE',
      'RIPLEY_BAJA'
    ],
    products: [
      'MCBLACK'
    ]
  };

  constructor(
    public newBenefitService: NewBenefitService,
    private modalDialogService: ModalDialogService,
    private activatedRoute: ActivatedRoute,
    private firebaseService: FirebaseService,
    private benefitService: BenefitsService,
    public sanitizer: DomSanitizer,
  ) { }

  async ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    await this.setUploadedCodes();
    if (this.benefitService.benefitData.benefitInfo.startDate === '') {
      await this.loadInfo();
    } else {
      this.listBenefitPathcode = this.benefitService.benefitData.benefitCodes;
      this.benefitData = this.benefitService.benefitData.benefitInfo;
    }
    this.loading = false;
  }
  loadInfo = async () => {
    const benefitRef = await this.firebaseService.getFirebaseCollection('benefits').ref.doc(this.id).get();
    const benefit = {
      ...benefitRef.data().newBenefit,
      id: benefitRef.id,
      codesStock: benefitRef.data().codesStock,
      rutsStock: benefitRef.data().rutsStock,
      codesFilePath: benefitRef.data().codesFilePath
    } as NewBenefit;
    const path = benefit.codesFilePath;
    this.benefitService.setBenefitCodeRut(benefit, path);
    this.benefitData = benefit;
    this.listBenefitPathcode = path;
  };
  setUploadedCodes = async () => {
    this.uploadedCodes = [];
    for (const segmentationType of Object.keys(this.segmentation)) {
      for (const segment of this.segmentation[segmentationType]) {
        const codes = await this.firebaseService.getBenefitSegmentCodes(this.id, segment);
        this.uploadedCodes = this.uploadedCodes.concat(codes);
      }
    }
    this.uploadedCodes = this.uploadedCodes.map(u => u.id);
  };
  async uploadBenefitCode(event: FileList, segment: string, inputElement) {
    this.loader = true;
    this.resultFile = null;
    this.benefitDataCsv = [];
    this.csvData = [];

    if (event.length > 0) {
      const fileExtension = event[0].name.split('.').pop();
      if (fileExtension !== 'csv') {
        this.loader = false;
        this.modalDialogService.openModal('csvUploadError');
        inputElement.value = null;
        return false;
      }
      parse(event.item(0), {
        complete: (result, file) => {
          // @ts-ignore
          this.benefitDataCsv.push(...result.data[0]);
          this.csvData = this.parseData(result.data, 'benefitCodes');
          inputElement.value = null;
          if (this.someCodeIsDuplicated()) {
            this.loader = false;
            this.modalDialogService.openModal('duplicatedBenefitCodeError');
            return false;
          }
          if (this.benefitDataCsv[0] !== this.id) {
            this.loader = false;
            this.modalDialogService.openModal('idUploadError');
            return false;
            // @ts-ignore
          } else if (result.data[0].length !== 3) {

            this.loader = false;
            this.modalDialogService.openModal('columnUploadError');
            return false;
          }
          this.isUploadingCodes = false;
          this.resultFile = file;
          this.modalDialogService.openModal('csvUploadFileSuccess');
          this.loader = false;
        }
      });
    } else {
      this.newBenefit.codesFilePath.push(null);
      this.loader = false;
    }
  }

  async checkCodesFilesPath() {
    await this.firebaseService.getFirebaseCollection('benefits').ref.doc(this.id).onSnapshot(async (snap) => {
      this.listBenefitPathcode = await snap.data().codesFilePath;
    });
  }
  someCodeIsDuplicated(){
    return this.csvData.some(d => this.uploadedCodes.includes(`${d.benefitId}${d.code}`));
  }
  uploadFile = async (segment: string) => {
    this.firebaseService.uploadBenefitsBatch(`benefits/${this.id}/${segment}`, this.csvData, this.commit, this.resultFile.name, segment)
      .then(async () => {
        this.isUploadingCodes = false;
        await this.checkCodesFilesPath();
        this.modalDialogService.openModal('csvUploadFileSuccess');
        await this.setUploadedCodes();
        await this.loadInfo();
        this.isUploadingCodes = true;
      })
      .catch((e) => {
        console.log(e);
        this.isUploadingCodes = false;
        setTimeout(() => {
          this.modalDialogService.openModal('uploadError')
            .then((btnPressed) => {
              if (btnPressed === 'right') {
                // @ts-ignore
                this.uploadFile(file);
              }
            });
        }, 500);
      });
  };

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

  public sanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
