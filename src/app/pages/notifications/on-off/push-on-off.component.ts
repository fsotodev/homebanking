import { Component, OnInit } from '@angular/core';
import { PushCampaignsService } from '@apps/services/push-campaigns.service';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-push-on-off',
  templateUrl: './push-on-off.component.html',
  styleUrls: ['./push-on-off.component.scss']
})
export class PushOnOffComponent implements OnInit {
  form: FormGroup;
  saving: boolean;
  isLoading: boolean;
  groupsData = [];
  firstFormArray: any;

  constructor(
    private modalDialogService: ModalDialogService,
    private campaignsService: PushCampaignsService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
  }

  async ngOnInit() {
    this.groupsData = [];
    this.isLoading = true;
    this.form = this.formBuilder.group({
      groups: new FormArray([])
    });

    await this.getGroups();
    await this.getEvents();
    this.addCheckboxes();
  }

  addCheckboxes() {
    this.groupsData.forEach((group, i) => {
      const control = new FormControl(group.status === 1);
      (this.form.controls.groups as FormArray).push(control);
    });
    this.firstFormArray = this.form.controls.groups.value;
    this.isLoading = false;
  }

  async getGroups() {
    await this.campaignsService.getConfig()
      .then((result) => {
        result.data.forEach((group) => {
          group.name = `Group => ${group.name}`;
          this.groupsData.push(group);
        });
      })
      .catch((e) => {
        console.error('error in getConfig', e);
      });
  }

  async getEvents() {
    await this.campaignsService.getEventsConfig()
      .then((result) => {
        result.data.forEach((event) => {
          event.name = `Event Nº${event.code} => ${event.name}`;
          this.groupsData.push(event);
        });
      })
      .catch((e) => {
        console.error('error in getEvents', e);
      });
  }

  async submit() {
    this.saving = true;
    await this.update();
    this.modalDialogService.openModal('updateConfiguration').then((btnPressed) => {
      if (btnPressed === 'right') {
        this.saving = false;
        this.router.navigate(['/home']);
      }
      if (btnPressed === 'left') {
        this.saving = false;
        this.ngOnInit();
      }
    });
  }

  async update() {
    for (let i = 0; i < this.firstFormArray.length; i++) {
      if (this.firstFormArray[i] !== this.form.controls.groups.value[i]) {
        this.groupsData[i].status = this.form.controls.groups.value[i];
      }
    }
    for (const data of this.groupsData) {
      if (data.id && (data.status === true || data.status === false) && !data.code) {
        await this.campaignsService.updateConfig(data.id, data.status);
      } else if (data.id && (data.status === true || data.status === false) && data.code) {
        await this.campaignsService.updateEventConfig(data.code, data.status);
      }
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  disabledSave() {
    return JSON.stringify(this.firstFormArray) === JSON.stringify(this.form.controls.groups.value)
      || this.saving || this.isLoading;
  }

}
