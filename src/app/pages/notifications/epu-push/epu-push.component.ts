import { AuthFirebaseService } from '@apps/shared/services/auth/auth-firebase.service';
import { FirebaseService } from '@apps/services/firebase.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { User } from '@apps/shared/models/user.interface';

@Component({
  selector: 'app-epu-push',
  templateUrl: './epu-push.component.html'
})
export class EpuPushComponent implements OnInit {
  form: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  isLoading: boolean;
  saving: boolean;
  days = [
    {state: '24', due: '05', active: 0},
    {state: '28', due: '10', active: 0},
    {state: '02', due: '15', active: 0},
    {state: '08', due: '20', active: 0},
    {state: '13', due: '25', active: 0},
    {state: '18', due: '30', active: 0}];
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
    {digit: 'K', active: 0},
  ];
  platforms = [
    { platform: 'App', active: 1 },
    { platform: 'PWA', active: 0 }
  ];
  firstFormArray: any;
  secondFormArray: any;
  thirdFormArray: any;
  selected = -1;
  user: User;

  constructor(
    private authService: AuthFirebaseService,
    private formBuilder: FormBuilder,
    private router: Router,
    private modalDialogService: ModalDialogService,
    private firebaseService: FirebaseService,
  ) { }

  async ngOnInit() {
    this.isLoading = true;
    this.form = this.formBuilder.group({
      groups: new FormArray([])
    });
    this.form2 = this.formBuilder.group({
      groups: new FormArray([])
    });
    this.form3 = this.formBuilder.group({
      groups: new FormArray([])
    });
    this.addCheckboxes();
    this.user = await this.authService.userInfo();
  }

  addCheckboxes() {
    this.days.forEach((day, i) => {
      const control = new FormControl(day.active === 1);
      (this.form.controls.groups as FormArray).push(control);
    });
    this.digits.forEach((digit, i) => {
      const control = new FormControl(digit.active === 1);
      (this.form2.controls.groups as FormArray).push(control);
    });
    this.platforms.forEach((platform, i) => {
      const control = new FormControl(platform.active === 1);
      (this.form3.controls.groups as FormArray).push(control);
    });
    this.firstFormArray = this.form.controls.groups.value;
    this.secondFormArray = this.form2.controls.groups.value;
    this.thirdFormArray = this.form3.controls.groups.value;
    this.isLoading = false;
  }

  async submit() {
    this.saving = true;
    this.modalDialogService.openModal('sendEpuPushConfirm').then(async (btnPressed) => {
      if (btnPressed === 'right') {
        this.isLoading = true;
        const digitsChecked = [];
        const appEnabled = this.form3.controls.groups.value[0]; const pwaEnabled = this.form3.controls.groups.value[1];
        for (let index = 0; index < this.form2.controls.groups.value.length; index++) {
          const element = this.form2.controls.groups.value[index];
          if (element) {
            digitsChecked.push(this.digits[index].digit);
          }
        }
        await this.firebaseService.createEpuReport(this.days[this.selected].due, digitsChecked, this.user.email, appEnabled, pwaEnabled);
        this.modalDialogService.openModal('sendedEpuPush').then(async (btn) => {
          if (btn === 'right') {
            this.saving = false;
            this.router.navigate(['/home']);
          }
          if (btn === 'left') {
            this.saving = false;
            this.ngOnInit();
          }
          this.isLoading = false;
        });
      }
      if (btnPressed === 'left') {
        this.saving = false;
        this.ngOnInit();
      }
    });
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  disabledSave() {
    return (JSON.stringify(this.firstFormArray) === JSON.stringify(this.form.controls.groups.value)
      || JSON.stringify(this.secondFormArray) === JSON.stringify(this.form2.controls.groups.value))
      || this.isLoading;
  }

}
