import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '@apps/services/firebase.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { parse } from 'papaparse';
import { UtilsService } from '@apps/services/utils.service';
@Component({
  selector: 'app-card-reissue',
  templateUrl: './card-reissue.component.html',
  styleUrls: ['./card-reissue.component.scss']
})
export class CardReissueComponent implements OnInit {
  loadingCardReissue: boolean;
  cardReissueConfig: any;
  tabSelectedCard = 0;
  savingCard: boolean;
  loadingCardReissueCsv: boolean;
  fileCard: FileList;
  csvData: any[];
  fileNameCard: string;
  validFileCard: boolean;
  loadedRutsCard: string;
  percUsersCommitedCard: number;

  constructor(
    public firebaseService: FirebaseService,
    private router: Router,
    private modalDialogCardService: ModalDialogService,
    private utils: UtilsService
  ) {
    this.loadingCardReissue = true;
    this.savingCard = false;
  }

  async ngOnInit() {
    this.loadingCardReissue = true;
    this.savingCard = false;
    this.cardReissueConfig = 'userConfig';
    this.loadingCardReissue = false;
  }



  public tabChanged(tabEvent: MatTabChangeEvent) {
    this.tabSelectedCard = tabEvent.index;
  }


  goHome() {
    this.router.navigate(['/home']);
  }

  uploadFile(event: FileList) {
    this.fileCard = null;
    this.loadingCardReissueCsv = true;
    this.csvData = [];
    if (event.length > 0) {
      this.fileNameCard = event[0].name;
      const filenamecard = event[0].name.split('.');
      if (filenamecard[filenamecard.length - 1].toLocaleLowerCase() === 'csv') {
        this.fileCard = event;
        parse(event.item(0), {
          complete: async (result) => {
            if (result.data.length > 1200000) {
              this.loadingCardReissueCsv = false;
              this.validFileCard = false;
              this.modalDialogCardService.openModal('csvLimitError');
              return false;
            }
            // @ts-ignore
            if (result.data[0].length > 1) {
              this.loadingCardReissueCsv = false;
              this.validFileCard = false;
              this.modalDialogCardService.openModal('csvFormatError');
              return false;
            }
            this.csvData = await this.sanitizeData(result.data);
            this.csvData = await this.utils.formatRutsCsvData(this.csvData);
            this.loadedRutsCard = this.csvData.length.toString();
            this.loadingCardReissueCsv = false;
            this.validFileCard = true;
          }
        });
        return;
      } else {
        this.modalDialogCardService.openModal('csvUploadError');
        return false;
      }
    } else {
      this.loadingCardReissueCsv = false;
      this.validFileCard = false;
    }
  }

  async sanitizeData(data: any[]): Promise<any> {
    return data.filter((row) => !!row[0]);
  }

  async uploadCodes() {
    this.loadingCardReissue = true;
    this.firebaseService.updloadUserConfigBatch(this.cardReissueConfig, this.csvData, this.commit,
    ).then(async () => {
      this.loadingCardReissue = false;
      this.showModalCardSuccess();
    })
      .catch((error) => {
        console.error(error);
        this.showModalCardWhenError();
        this.loadingCardReissue = false;
      });
  }

  commit = (percUsersCommitedCard: number) => {
    this.percUsersCommitedCard = percUsersCommitedCard;
  };

  showModalCardWhenError() {
    this.modalDialogCardService.openModal('genericError')
      .then((btnPressed) => {
        if (btnPressed === 'right') {
          this.router.navigate(['/home']);
        }
      });
  }

  showModalCardSuccess() {
    this.modalDialogCardService.openModal('uploadCodesSuccess')
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.cleanFormCard();
        } else {
          this.router.navigate(['/home']);
        }
      });
  }

  cleanFormCard() {
    this.csvData = null;
    this.fileCard = null;
    this.validFileCard = false;
  }
}
