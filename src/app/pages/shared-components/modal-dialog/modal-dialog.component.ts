import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Utils, ModalDataObject } from '../utils/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss']
})
export class ModalDialogComponent implements OnInit {

  modalData: ModalDataObject;
  modalType: string;
  screenName: string;
  isScreenName: boolean;
  disabledRightButton: boolean;
  params: any;

  constructor(
    private utils: Utils,
    private dialogRef: MatDialogRef<ModalDialogComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) modalDataFromService
  ) {
    this.modalType = modalDataFromService.modalType;
    this.params = modalDataFromService.params;
    this.modalData = this.utils.getModalDataObject(this.modalType);
  }

  ngOnInit() {
    if (this.modalType === 'changeScreenName') {
      this.isScreenName = true;
      this.disabledRightButton = true;
    }
  }

  closeModal(btnPressed: string) {
    if (this.modalType === 'changeScreenName') {
      this.router.navigate(['/list-campaigns']);
    }
    this.dialogRef.close({btnPressed});
  }

  doAction() {
    if (this.modalType === 'changeScreenName') {
      this.dialogRef.close({btnPressed: this.screenName});
    } else {
      this.closeModal('right');
    }
  }

  onNameChange() {
    this.disabledRightButton = !(this.screenName.length > 1 && !this.arrayContainsName(this.screenName, this.params));
  }

  arrayContainsName(name, array) {
    return array.find(screen => screen.id === name);
  }
}
