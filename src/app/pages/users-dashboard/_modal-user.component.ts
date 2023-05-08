import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { Utils, ModalDataObject } from '../shared-components/utils/utils';
import { FormGroupDirective, NgForm, FormControl, Validators, FormGroup } from '@angular/forms';
import { User } from '@apps/shared/models/user.interface';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-modal-user',
  templateUrl: './_modal-user.component.html',
  styleUrls: ['./_modal-user.component.scss']
})
export class ModalUserComponent implements OnInit {
  modalData: ModalDataObject;
  user: User;
  matcher = new MyErrorStateMatcher();
  userForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    displayName: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  userTypeList;
  constructor(
    private utils: Utils,
    private dialogRef: MatDialogRef<ModalUserComponent>,
    @Inject(MAT_DIALOG_DATA) modalDataFromService
  ) {
    this.modalData = this.utils.getModalDataObject(modalDataFromService.modalType);
    this.userForm.setValue({
      email: modalDataFromService.user.email,
      displayName: modalDataFromService.user.displayName,
      type: modalDataFromService.user.type,
      password: ''
    });
    this.user = modalDataFromService.user;
    this.userTypeList = [];
  }

  ngOnInit() {
    if (this.modalData.type === 'editUser') {
      this.userForm.removeControl('password');
    }
  }

  closeModal(btnPressed: string) {
    return btnPressed !== 'right' ?
      this.dialogRef.close({ btnPressed })
      :
      Object.assign(this.user, this.userForm.value) && this.dialogRef.close({ btnPressed, user: this.user });
  }
}
