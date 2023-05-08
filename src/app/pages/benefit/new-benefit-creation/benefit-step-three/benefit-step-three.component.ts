import { Component, Input, OnInit } from '@angular/core';
import { NewBenefitService } from '@apps/services/newBenefit.service';

@Component({
  selector: 'app-benefit-step-three',
  templateUrl: './benefit-step-three.component.html',
  styleUrls: ['./benefit-step-three.component.scss']
})
export class BenefitStepThreeComponent implements OnInit {
  @Input() selectedTemplate: string;
  address: string;
  phone: string;
  schedule: string;
  addressList: string[] = [];
  phoneList: string[] = [];
  scheduleList: string[] = [];
  constructor(public newBenefitService: NewBenefitService) { }

  ngOnInit() {
    this.setModel();
  }

  setModel() {
    this.addressList = this.newBenefitService.modelBenefitOld.newBenefit.addressList;
    this.phoneList = this.newBenefitService.modelBenefitOld.newBenefit.phoneList;
    this.scheduleList = this.newBenefitService.modelBenefitOld.newBenefit.bussinessHourList;
  }
  addAddress = () => {
    if (this.address === undefined || this.address.trim() === '') {
      return;
    }
    this.addressList.push(this.address);
    this.address = '';
  };

  addPhone = () => {
    if (this.phone === undefined || this.phone.trim() === '') {
      return;
    }
    this.phoneList.push(this.phone);
    this.phone = '';
  };

  addSchedule = () => {
    if (this.schedule === undefined || this.schedule.trim() === '') {
      return;
    }
    this.scheduleList.push(this.schedule);
    this.schedule = '';
  };

  deleteAddress = (index: number) => {
    this.addressList.splice(index, 1);
  };

  deletePhone = (index: number) => {
    this.phoneList.splice(index, 1);
  };

  deleteSchedule = (index: number) => {
    this.scheduleList.splice(index, 1);
  };

  saveStepThree = () => {
    this.newBenefitService.modelBenefitOld.newBenefit.addressList = this.addressList;
    this.newBenefitService.modelBenefitOld.newBenefit.phoneList = this.phoneList;
    this.newBenefitService.modelBenefitOld.newBenefit.bussinessHourList = this.scheduleList;
  };

}
