import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { ModalDialogComponent } from '../pages/shared-components/modal-dialog/modal-dialog.component';
import { ModalTableInfoComponent } from '../pages/shared-components/modal-table-info/modal-table-info.component';
import { ModalBalanceComponent } from '../pages/shared-components/modal-balance/modal-balance.component';
import { ModalProductCodesComponent } from '../pages/shared-components/modal-product-codes/modal-product-codes.component';
import { ModalDatacardRecordComponent } from '../pages/shared-components/modal-datacard-record/modal-datacard-record.component';
import { BenefitTagModalComponent } from '@apps/pages/benefit/benefit-tag-modal/benefit-tag-modal.component';

@Injectable()
export class ModalDialogService {
  modalDialogRef: MatDialogRef<any, any>;
  constructor(
    public materialDialog: MatDialog
  ) { }

  // tipos de modal: genericError, deleteConfirm, saveSuccess, updateCancel, publishSuccess, updateCancel, sendEpuPushConfirm
  openModal(modalType: string, params: any = null): Promise<string> {
    if (!this.modalDialogRef) {
      const modalConfig = new MatDialogConfig();
      modalConfig.disableClose = true;
      modalConfig.autoFocus = true;
      modalConfig.data = {
        height: '140px',
        width: '432px',
        modalType,
        params
      };

      this.modalDialogRef = this.materialDialog.open(ModalDialogComponent, modalConfig);
      return new Promise(resolve => {
        this.modalDialogRef.afterClosed().subscribe(data => {
          resolve(data.btnPressed);
          this.modalDialogRef = null;
        });
      });
    }
  }

  openModalTableInfo(modalType: string, params: any = null): Promise<string> {
    if (!this.modalDialogRef) {
      const modalConfig = new MatDialogConfig();
      modalConfig.disableClose = true;
      modalConfig.autoFocus = true;
      modalConfig.data = {
        height: '140px',
        width: '432px',
        modalType,
        params
      };

      this.modalDialogRef = this.materialDialog.open(ModalTableInfoComponent, modalConfig);
      return new Promise(resolve => {
        this.modalDialogRef.afterClosed().subscribe(data => {
          resolve(data.btnPressed);
          this.modalDialogRef = null;
        });
      });
    }
  }

  openModalBalance(modalType: string, params: any = null): Promise<string> {
    if (!this.modalDialogRef) {
      const modalConfig = new MatDialogConfig();
      modalConfig.disableClose = true;
      modalConfig.autoFocus = true;
      modalConfig.data = {
        height: '140px',
        width: '432px',
        modalType,
        params
      };

      this.modalDialogRef = this.materialDialog.open(ModalBalanceComponent, modalConfig);
      return new Promise(resolve => {
        this.modalDialogRef.afterClosed().subscribe(data => {
          resolve(data.btnPressed);
          this.modalDialogRef = null;
        });
      });
    }
  }

  openModalProductCodes(modalType: string, params: any = null): Promise<string> {
    if (!this.modalDialogRef) {
      const modalConfig = new MatDialogConfig();
      modalConfig.disableClose = true;
      modalConfig.autoFocus = true;
      modalConfig.data = {
        height: '140px',
        width: '432px',
        modalType,
        params
      };

      this.modalDialogRef = this.materialDialog.open(ModalProductCodesComponent, modalConfig);
      return new Promise(resolve => {
        this.modalDialogRef.afterClosed().subscribe(data => {
          resolve(data.btnPressed);
          this.modalDialogRef = null;
        });
      });
    }
  }

  openRecordDatacardModal(modalType: string, params: any = null): Promise<string> {
    if (!this.modalDialogRef) {
      const modalConfig = new MatDialogConfig();
      modalConfig.disableClose = true;
      modalConfig.autoFocus = true;
      modalConfig.data = {
        height: '140px',
        width: '432px',
        modalType,
        params
      };

      this.modalDialogRef = this.materialDialog.open(ModalDatacardRecordComponent, modalConfig);
      return new Promise(resolve => {
        this.modalDialogRef.afterClosed().subscribe(data => {
          resolve(data.btnPressed);
          this.modalDialogRef = null;
        });
      });
    }
  }

  openTagBenefitModal(): void {
    const modalConfig = new MatDialogConfig();
    modalConfig.disableClose = false;
    modalConfig.autoFocus = true;
    modalConfig.data = {
      height: '800px',
      width: '800px',
      modalType: 'sendEpuPushConfirm'
    };
    this.modalDialogRef = this.materialDialog.open(BenefitTagModalComponent, modalConfig);
  }

}
