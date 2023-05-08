import { Component, OnInit } from '@angular/core';
import { BenefitsService } from '../../../services/benefits.service';
import { BenefitCode, Benefit } from '../../../models/benefit';
import { Router } from '@angular/router';
import { ModalDialogService } from '../../../services/modal-dialog.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-benefit-periods',
  templateUrl: './benefit-periods.component.html',
  styleUrls: ['./benefit-periods.component.scss']
})
export class BenefitPeriodsComponent implements OnInit {

  benefit: Benefit;
  benefitCodes: Array<BenefitCode>;
  periods: Array<string>;
  loading: boolean;
  savingCodes: string;
  benefitPeriodsForm: FormGroup;

  constructor(
    private benefitsService: BenefitsService,
    private modalDialogService: ModalDialogService,
    private router: Router,
  ) {
    this.loading = true;
    this.savingCodes = null;
  }

  async ngOnInit() {
    this.benefit = this.benefitsService.getBenefitToModifyPeriodData();
    this.benefitPeriodsForm = new FormGroup({});
    if (!this.benefitCodes) {
      await this.getBenefitCodes();
    }
    this.searchPeriods();
    for (const period of this.periods) {
      this.benefitPeriodsForm.addControl(
        period,
        new FormControl(this.toMonthString(period),
          Validators.compose([Validators.required]))
      );
    }
    this.loading = false;
  }

  async updateCodes(period: string) {
    this.savingCodes = period;
    try {
      const newPeroid = this.stringToMonth(period);
      await this.benefitsService.updateCodesPeriod(this.benefitCodes, period, newPeroid);
      this.benefitCodes.map(b => {
        if (b.period === period) {
          b.period = newPeroid;
        }
      });
      this.showModalWhenUpdate();
    } catch (error) {
      this.showModalWhenError();
    }
    this.savingCodes = null;
  }

  toMonthString(period: string) {
    const month = period.split('-')[1].length === 1 ? '0' + period.split('-')[1] : period.split('-')[1];
    return period.split('-')[0] + '-' + month;
  }

  stringToMonth(period: string) {
    const newPeriod = this.benefitPeriodsForm.controls[period].value as string;
    return newPeriod.split('-')[0] + '-' + Number(newPeriod.split('-')[1]);
  }

  searchPeriods() {
    this.periods = new Array<string>();
    for (const benefit of this.benefitCodes) {
      if (benefit.period.length > 0 && this.periods.find(p => p === benefit.period) === undefined ) {
        this.periods.push(benefit.period);
      }
    }
  }

  countCodesOfPeriod(period: string) {
    return this.benefitCodes.filter(b => b.period === period).length;
  }

  async getBenefitCodes() {
    this.benefitCodes = await this.benefitsService.getCodes(this.benefit.id);
  }

  showModalWhenUpdate() {
    this.modalDialogService.openModal('updateSuccessBenefitCodesPeriod')
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.router.navigate(['/home']);
        }
        if (btnPressed === 'left') {
          this.loading = true;
          this.ngOnInit();
        }
      });
  }

  showModalWhenError() {
    this.modalDialogService.openModal('genericError')
      .then((btnPressed) => {
        if (btnPressed === 'right') {
          this.router.navigate(['/home']);
        }
      });
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
