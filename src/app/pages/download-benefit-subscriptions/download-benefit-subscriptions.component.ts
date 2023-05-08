import { Component, OnInit } from '@angular/core';
import { BenefitsService } from '../../services/benefits.service';
import { FirebaseService } from '../../services/firebase.service';
import { Location } from '@angular/common';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-benefit-subscriptions',
  templateUrl: './download-benefit-subscriptions.component.html',
  styleUrls: ['./download-benefit-subscriptions.component.scss']
})

export class DownloadBenefitSubscriptionsComponent implements OnInit {

  loading: boolean;
  fileName = 'benefitSubscriptions';
  formGroup: FormGroup;
  benefitExist = false;
  showWarn = false;
  foundBenefit: any = null;

  constructor(
    private benefitsService: BenefitsService,
    private location: Location,
    private firebase: FirebaseService,
  ) {
    this.loading = false;
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      benefitId: new FormControl('', Validators.required)
    });
  }
  onSearchChange(): void {
    this.showWarn = false;
    this.benefitExist = false;
  }
  async checkBenefit() {
    this.foundBenefit = await this.firebase.getBenefit(this.formGroup.get('benefitId').value);
    if (!!this.foundBenefit) {
      this.benefitExist = true;
    } else {
      this.showWarn = true;
    }
  }

  async downloadFile() {
    this.loading = true;
    const data = await this.benefitsService.getBenefitSubscriptionsById(this.formGroup.get('benefitId').value);
    const headersAndProps = ['id', 'benefitId', 'subscribedAt', 'userId'];
    const fileName = 'benefitSubscriptions_' + this.formGroup.get('benefitId').value;
    await this.benefitsService.createCSVAndDownload(data, headersAndProps, headersAndProps, fileName);
    this.loading = false;
  }

  goBack() {
    this.location.back();
  }
}
