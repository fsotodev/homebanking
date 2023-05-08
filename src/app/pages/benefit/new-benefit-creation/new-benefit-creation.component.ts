import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Benefit } from '@apps/models/benefit';
import { NewBenefit } from '@apps/models/new-benefit';
import { NewBenefitService } from '@apps/services/newBenefit.service';
import { BehaviorSubject, Observable } from 'rxjs';
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
  sixthFormGroup: FormGroup;
  sevenFormGroup: FormGroup;
  templateType: string;
  uniqueCodeBenefit = new BehaviorSubject<string | null | undefined>(undefined);
  set setUniqueCodeBenefit(uniqueCode: string) {
    this.uniqueCodeBenefit.next(uniqueCode);
  }
  get getUniqueCodeBenefit(): Observable<string | null> {
    return this.uniqueCodeBenefit.asObservable();
  }
  segmentationTypeChange = new BehaviorSubject<string | null | undefined>(undefined);
  set setSegmentationTypeChange(segmentationType: string) {
    this.segmentationTypeChange.next(segmentationType);
  }
  get getSegmentationTypeChange(): Observable<string | null> {
    return this.segmentationTypeChange.asObservable();
  }
  constructor(
    private _formBuilder: FormBuilder,
    public newBenefitService: NewBenefitService,
    public benefitsService: BenefitsService) {}

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
    this.sixthFormGroup = this._formBuilder.group({
      sixthCtrl: ['', Validators.required]
    });
    this.sevenFormGroup = this._formBuilder.group({
      sevenCtrl: ['', Validators.required]
    });
  }

  templateSelected(type: string) {
    this.newBenefitService.modelBenefitOld.newBenefit.templateType = type;
  }

}
