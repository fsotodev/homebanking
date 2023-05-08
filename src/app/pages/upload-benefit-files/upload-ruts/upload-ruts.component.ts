import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NewBenefit } from '@apps/models/new-benefit';
import { BenefitsService } from '@apps/services/benefits.service';
import { FirebaseService } from '@apps/services/firebase.service';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { parse } from 'papaparse';

@Component({
  selector: 'app-upload-ruts',
  templateUrl: './upload-ruts.component.html',
  styleUrls: ['./upload-ruts.component.scss']
})
export class UploadRutsComponent implements OnInit {

  csvData: any[];
  id: string;
  listBenefitPathRut: string[] = [];
  rutsUnassignFilePath: string[] = [];
  benefitDataCsv: Array<any> = [];
  newBenefit: NewBenefit;
  isUploadingCodes = true;
  percCodesCommited: number;
  benefitData: NewBenefit;
  loader = false;

  constructor(
    private modalDialogService: ModalDialogService,
    private activatedRoute: ActivatedRoute,
    private benefitService: BenefitsService,
    private firebaseService: FirebaseService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.checkRutsFilesPath();
    this.rutsUnassignFilePath = this.benefitService.benefitData.benefitCodes;
    this.benefitData = this.benefitService.benefitData.benefitInfo;
  }

  async checkRutsFilesPath() {
    await this.firebaseService.getFirebaseCollection('benefits').ref.doc(this.id).onSnapshot((snap) => {
      this.listBenefitPathRut = snap.data().rutsFilePath;
      this.rutsUnassignFilePath = typeof snap.data().rutsUnassignFilePath == 'undefined' ? [] : snap.data().rutsUnassignFilePath;
    });
  }

  async uploadBenefitRuts(event: FileList, unassign: boolean, inputElement) {
    this.loader = true;
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
          this.csvData = this.parseData(result.data, 'benefitRuts');
          inputElement.value = null;
          if (this.benefitDataCsv[0] !== this.id) {
            this.loader = false;
            this.modalDialogService.openModal('idUploadError');
            return false;
            // @ts-ignore
          } else if (result.data[0].length !== 2) {
            this.loader = false;
            this.modalDialogService.openModal('columnUploadError');
            return false;
          }
          this.isUploadingCodes = true;
          const batchFnc = unassign ? this.firebaseService.unassignBenefitsBatch : this.firebaseService.uploadBenefitsBatch;
          batchFnc('benefitRuts', this.csvData, this.commit, file.name)
            .then(() => {
              this.isUploadingCodes = false;
              this.loader = false;
              this.modalDialogService.openModal('csvUploadSuccess');
              // inputElement.value = null;
            })
            .catch(() => {
              this.isUploadingCodes = false;
              this.loader = false;
              this.modalDialogService.openModal('uploadError')
                .then((btnPressed) => {
                  if (btnPressed === 'right') {
                    // @ts-ignore
                    this.uploadBenefitRuts(file, unassign);
                  }
                });
            });
        }
      });
    } else {
      if (unassign) {
        this.newBenefit.rutsUnassignFilePath.push(null);
      } else {
        this.newBenefit.rutsFilePath.push(null);
      }
      this.loader = false;
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

  public sanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
