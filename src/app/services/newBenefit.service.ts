import { Injectable } from '@angular/core';
import { Benefit } from '@apps/models/benefit';
import { NewBenefit } from '@apps/models/new-benefit';

@Injectable({
  providedIn: 'root'
})
export class NewBenefitService {
  // modelBenefit: NewBenefit = new NewBenefit();
  modelBenefitOld: Benefit = new Benefit();
  isSavingBenefit: boolean;
  isModifyingBenefit: boolean;
  selectedSegmentationType: string;
  selectedIsUniqueCode: boolean;
  constructor() { }

}
