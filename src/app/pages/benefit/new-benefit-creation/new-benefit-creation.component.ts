import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Benefit } from '@apps/models/benefit';
import { NewBenefit } from '@apps/models/new-benefit';
import { NewBenefitService } from '@apps/services/newBenefit.service';
import { BenefitsService } from '../../../services/benefits.service';


@Component({
  selector: 'app-new-benefit-creation',
  templateUrl: './new-benefit-creation.component.html',
  styleUrls: ['./new-benefit-creation.component.scss']
})
export class NewBenefitCreationComponent implements OnInit {
  newBenefitToCreate = new NewBenefit();
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  templateType: string;
  constructor(
    private _formBuilder: FormBuilder,
    public newBenefitService: NewBenefitService,
    public benefitsService: BenefitsService
  ) { }

  ngOnInit() {
    if (this.benefitsService.getIsModifyingBoolean() || this.benefitsService.getIsCreatingAndBackBoolean()) {
      this.newBenefitService.modelBenefitOld = this.benefitsService.getBenefitToCreateData();
    } else {
      this.newBenefitService.modelBenefitOld = new Benefit();
    }
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
    this.fourthFormGroup = this._formBuilder.group({
      fourthCtrl: ['', Validators.required]
    });
    this.fifthFormGroup = this._formBuilder.group({
      fifthCtrl: ['', Validators.required]
    });
  }

  templateSelected(type: string) {
    this.newBenefitService.modelBenefitOld.newBenefit.templateType = type;
  }

}
