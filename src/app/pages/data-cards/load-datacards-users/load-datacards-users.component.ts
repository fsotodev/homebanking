import { Component, OnInit } from '@angular/core';
import { parse } from 'papaparse';
import { FirebaseService } from '@apps/services/firebase.service';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { Router } from '@angular/router';
import { AuthFirebaseService} from '@apps/shared/services/auth/auth-firebase.service';
import { Location } from '@angular/common';
import { UtilsService } from '@apps/services/utils.service';
import * as moment from 'moment';
import { User } from '@apps/shared/models/user.interface';

@Component({
  selector: 'app-load-datacards-users',
  templateUrl: './load-datacards-users.component.html',
  styleUrls: ['./load-datacards-users.component.scss']
})
export class LoadDatacardsUsersComponent implements OnInit {

  loading: boolean;
  file: FileList;
  csvData: any[];
  validFile: boolean;
  user: User;
  percUsersCommited: number;
  userRutToSearch: string;
  fileName: string;
  loadedRuts: string;
  uploadedAt: string;

  constructor(
    private firebase: FirebaseService,
    private modalDialogService: ModalDialogService,
    private router: Router,
    private authService: AuthFirebaseService,
    private location: Location,
    private utils: UtilsService
  ) { }

  async ngOnInit() {
    this.user = await this.authService.userInfo();
    const date = new Date();
    this.uploadedAt = moment(date).format('DD-MM-YYYY, h:mm:ss');
  }

  async sanitizeData(data: any[]): Promise<any> {
    return data.filter((row) => !!row[0]);
  }

  uploadFile(event: FileList) {
    this.file = null;
    this.loading = true;
    this.csvData = [];
    if (event.length > 0) {
      this.fileName = event[0].name;
      const filename = event[0].name.split('.');
      if (filename[filename.length - 1].toLocaleLowerCase() === 'csv') {
        this.file = event;
        parse(event.item(0), {
          complete: async (result) => {
            if (result.data.length > 1200000) {
              this.loading = false;
              this.validFile = false;
              this.modalDialogService.openModal('csvLimitError');
              return false;
            }
            // @ts-ignore
            if (result.data[0].length > 1) {
              this.loading = false;
              this.validFile = false;
              this.modalDialogService.openModal('csvFormatError');
              return false;
            }
            this.csvData = await this.sanitizeData(result.data);
            this.csvData = await this.utils.formatRutsCsvData(this.csvData);
            this.loadedRuts = this.csvData.length.toString();
            this.loading = false;
            this.validFile = true;
          }
        });
        return;
      } else {
        this.modalDialogService.openModal('csvUploadError');
        return false;
      }
    } else {
      this.loading = false;
      this.validFile = false;
    }
  }

  cleanForm() {
    this.csvData = null;
    this.file = null;
    this.validFile = false;
  }

  goBack() {
    this.location.back();
  }

  async uploadCodes() {
    this.loading = true;
    this.firebase.updloadUsersBatch(
      'datacardUsers',
      this.csvData,
      this.commit,
    ).then(async () => {
      await this.pushFirebaseUploadInformation();
      this.loading = false;
      this.showModalSuccess();
    })
      .catch((error) => {
        console.error(error);
        this.showModalWhenError();
        this.loading = false;
      });
  }

  commit = (percUsersCommited: number) => {
    this.percUsersCommited = percUsersCommited;
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

  async searchRutInCollection(): Promise<any> {
    this.loading = true;
    const isRutInCollection = await this.firebase.searchRutInCollection(this.userRutToSearch, 'datacardUsers');
    if (isRutInCollection) {
      this.loading = false;
      this.userRutToSearch = null;
      this.modalDialogService.openModal('successSearchRut');
    } else {
      this.loading = false;
      this.userRutToSearch = null;
      this.modalDialogService.openModal('errorSearchRut');
    }
  }

  async pushFirebaseUploadInformation(): Promise<void> {
    try {
      if (this.loadedRuts && this.fileName && this.user.email && this.uploadedAt) {
        const historialRutsData = {
          fileName: this.fileName,
          loadedRuts: this.loadedRuts,
          userAccount: this.user.email,
          uploadedAt: this.uploadedAt
        };
        await this.firebase.getFirebaseCollection('dataCardUploadRecord').add(historialRutsData);
      }
      return;
    } catch (error) { }
  }

  openDatacardRecordModal(): void {
    this.modalDialogService.openRecordDatacardModal('modalDataCardRecord');
  }

}
