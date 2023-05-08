import { Component, OnInit } from '@angular/core';
import { ConfigUpload } from '@apps/models/config-upload';
import { FirebaseService } from '@apps/services/firebase.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalUploadConfigComponent } from '@apps/pages/shared-components/modal-upload-config/modal-upload-config.component';
import { ModalDialogComponent } from '@apps/pages/shared-components/modal-dialog/modal-dialog.component';

export const COLLECTION_CONFIG = 'listUploadConfig';

@Component({
  selector: 'app-upload-config-component',
  templateUrl: './upload-config.component.html',
  styleUrls: ['./upload-config.component.scss']
})
export class UploadConfigComponent implements OnInit {
  displayedColumns: string[] = ['idConfig', 'collection', 'documentId', 'automaticId', 'overlaps', 'menu'];
  public isLoading = true;
  private lstUploadConfig: Array<ConfigUpload> = [];

  constructor(private firebaseService: FirebaseService, public dialog: MatDialog) {
  }

  async ngOnInit() {
    await this.getLstUploadConfig().finally(() => {
      this.isLoading = false;
    });
  }

  async getLstUploadConfig() {
    this.lstUploadConfig = [];
    const querySnapshot = await this.firebaseService.getFirebaseCollection(COLLECTION_CONFIG)
      .ref.get();
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach(doc => {
        const configUpload = doc.data() as ConfigUpload;
        configUpload.idConfig = doc.id;
        this.lstUploadConfig.push(configUpload);
      });
    }
  }

  newConfig() {
    this.callModalEditAndCreate(null);
  }

  editConfig(configUpload) {
    this.callModalEditAndCreate(configUpload);
  }

  callModalEditAndCreate(configUpload: ConfigUpload) {
    this.isLoading = true;
    let promiseupd = Promise.resolve();
    this.dialog.open(ModalUploadConfigComponent, {width: '550px', data: configUpload}).afterClosed().toPromise().then(dataFromModal => {
      if (dataFromModal.btnPressed === 'accept') {
        if (dataFromModal.docId !== null) {
          promiseupd = this.updateDocument(dataFromModal);
        } else {
          promiseupd = this.createDocument(dataFromModal);
        }
      }
    }).finally(() => {
      promiseupd.then(() => {
        this.ngOnInit();
      }).catch((error) => {
        console.error(error);
        this.isLoading = false;
      });
    });
  }

  async deleteCollection(configUpload) {
    return await this.firebaseService.getFirebaseCollection(COLLECTION_CONFIG).doc(configUpload.idConfig).delete();
  }

  deleteFields(dataFromModal) {
    delete dataFromModal.form.idConfig;
    if (typeof dataFromModal.form.onLoaded === 'undefined' || dataFromModal.form.onLoaded === null || dataFromModal.form.onLoaded === '') {
      delete dataFromModal.form.onLoaded;
    }
    if (typeof dataFromModal.form.objectCreated === 'undefined'
      || dataFromModal.form.objectCreated === null
      || dataFromModal.form.objectCreated === '') {
      delete dataFromModal.form.objectCreated;
    }
    return dataFromModal;
  }

  updateDocument(dataFromModal) {
    dataFromModal = this.deleteFields(dataFromModal);
    return this.firebaseService.getFirebaseCollection(COLLECTION_CONFIG)
      .doc(dataFromModal.docId)
      .set(dataFromModal.form, {merge: true});
  }

  createDocument(dataFromModal) {
    const collectionName = dataFromModal.form.idConfig;
    dataFromModal = this.deleteFields(dataFromModal);
    return this.firebaseService.getFirebaseCollection(COLLECTION_CONFIG)
      .doc(collectionName)
      .set(dataFromModal.form);
  }

  async deleteConfig(configUpload) {
    let promisedel = Promise.resolve();
    this.isLoading = true;
    const modalConfig = new MatDialogConfig();
    modalConfig.disableClose = true;
    modalConfig.autoFocus = true;
    modalConfig.data = {
      height: '140px',
      width: '432px',
      modalType: 'confirmDeleteConfigUpload'
    };
    this.dialog.open(ModalDialogComponent, modalConfig).afterClosed().toPromise().then(data => {
      if (data.btnPressed === 'right') {
        promisedel = this.deleteCollection(configUpload);
      }
    }).finally(() => {
      promisedel.then(() => {
        this.ngOnInit();
      }).catch((error) => {
        console.error(error);
        this.isLoading = false;
      });
    });
  }

}
