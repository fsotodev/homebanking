import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import {FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Benefit } from '@apps/models/benefit';
import { NewBenefit } from '@apps/models/new-benefit';
import { BenefitsService } from '@apps/services/benefits.service';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { NewBenefitService } from '@apps/services/newBenefit.service';
import { Obj } from '@popperjs/core';
import { Subject, pipe, takeUntil } from 'rxjs';
import { SegmentationItem } from '../../../../models/segmentationItem';

@Component({
  selector: 'app-benefit-step-seven',
  templateUrl: './benefit-step-seven.component.html',
  styleUrls: ['./benefit-step-seven.component.scss']
})
export class BenefitStepSevenComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() uniqueCodeObservable;
  @Input() segmentationTypeObservable;
  //Pasar a configuration
  segmentationTypes: any;
  //Pasar a comfiguración
  supportOldSegmentation = true;
  segmentationModel: any = {};
  sevenStepFormGroup: FormGroup;
  isSavingBenefit: boolean;
  isModifyingBenefit: boolean;
  isUnique: boolean;
  loadSegmentation = false;
  private unsuscribe$ = new Subject<void>();

  // currentFormControlName: string;

  constructor(
    public newBenefitService: NewBenefitService,
    private modalDialogService: ModalDialogService,
    private router: Router,
    private benefitsService: BenefitsService) { }

  async ngOnInit() {
    await this.setSegmentationsOptions();
    this.setSegmentationFormControls();
    this.loadSegmentation = true;
  }

  ngAfterViewInit() {
    this.uniqueCodeObservable.pipe(takeUntil(this.unsuscribe$)).subscribe(
      (uniqueCodeValue) => {
        if(uniqueCodeValue !== undefined) {
          const activeKeys = this.obtainKeysActiveDiscount();
          if(activeKeys.length === 0) {
            return ;
          }
          if(uniqueCodeValue === 'unique') {
            this.addCodeValidator(activeKeys);
          }else {
            this.deleteCodeValidator(activeKeys);
          }
        }
      }
    );

    this.segmentationTypeObservable.pipe(takeUntil(this.unsuscribe$)).subscribe(
      (segmentationType)=> {
        if(segmentationType !== undefined) {
          const activeKeys = this.obtainKeysActiveDiscount();
          if(activeKeys.length > 0) {
            this.deleteOrAddValidatorsAfterSegmentationChange(activeKeys, segmentationType);
          }
        }
      }
    );
  }

  setSegmentationsOptions = async () => {
    this.segmentationTypes = await this.benefitsService.getSegmentationConfig();
    const planValues = this.segmentationTypes[2].values;
    const newOrderPlanValues = [this.getPlanValue(planValues, 'Black'),
      this.getPlanValue(planValues, 'Pro'),
      this.getPlanValue(planValues, 'Light')];
    this.segmentationTypes[2].values = newOrderPlanValues;
    for (const segmentationType of this.segmentationTypes) {
      for(const item of segmentationType.values ) {
        const actualInfo = this.getIntegratedActualInfoBenefit(segmentationType, item);
        const segmentation: SegmentationItem = {
          type: segmentationType.type,
          id: item.id,
          active: !!actualInfo.active,
          discount: !!actualInfo.discount ? actualInfo.discount : '',
          detail: !!actualInfo.detail ? actualInfo.detail : '',
          code: !!actualInfo.code ? actualInfo.code : ''
        };
        this.segmentationModel[segmentationType.type + item.id] = segmentation;
      }
    }
  };

  getPlanValue(planValues: Record<string, any>[], stringToFilterBy: string): Record<string, string> {
    const planValueObtained = planValues.filter(
      (value)=>value.id.includes(stringToFilterBy)
    );
    return planValueObtained[0];
  }

  getIntegratedActualInfoBenefit(segmentationType, item){
    const benefit = this.newBenefitService.modelBenefitOld.newBenefit;
    let actualInfo: any = {};
    if(!!benefit.segmentationInfo) {
      actualInfo = benefit.segmentationInfo.find(segmentation =>
        segmentation.type === segmentationType.type && segmentation.id === item.id);
      if(!!actualInfo && this.supportOldSegmentation) {
        actualInfo.active = (!!item.has)? benefit[item.has] : actualInfo.active;
        actualInfo.detail = (!!item.detail && !!benefit[item.detail])? benefit[item.detail] : actualInfo.detail;
        actualInfo.discount = (!!item.discount && !!benefit[item.discount])? benefit[item.discount] : actualInfo.discount;
      } else {
        actualInfo = this.setDefaultSegmentedInfo(benefit, item);
      }
    } else {
      actualInfo = this.setDefaultSegmentedInfo(benefit, item);
    }
    return actualInfo;

  }

  setDefaultSegmentedInfo(benefit, item) {
    const actualInfo: any = {};
    actualInfo.active = (!!item.has)? benefit[item.has] : false;
    actualInfo.detail = (!!item.detail && !!benefit[item.detail])? benefit[item.detail] : '';
    actualInfo.discount = (!!item.discount && !!benefit[item.discount])? benefit[item.discount] : '';
    return actualInfo;
  }

  setSegmentationFormControls = () => {
    const formGroupFields = {};
    for(const item of Object.keys(this.segmentationModel)) {
      formGroupFields[item+ 'Discount' ] = new FormControl('', Validators.compose([Validators.maxLength(40)]));
      formGroupFields[item+ 'Detail' ] = new FormControl('');
      formGroupFields[item+ 'Code' ] = new FormControl('');
      formGroupFields[item+ 'Has' ] = new FormControl('');
    }
    this.sevenStepFormGroup = new FormGroup(formGroupFields, this.activeDiscountValidator);
  };

  addValidatorsToActiveDiscount(event, itemName){
    const discountControl = itemName + 'Discount';
    const codeControl = itemName + 'Code';
    if(event.checked) {
      this.addRequiredtoFormControl(discountControl);
      if(this.newBenefitService?.selectedIsUniqueCode) {
        this.addRequiredtoFormControl(codeControl);
      }
    } else {
      this.deleteRequiredfromFormControl(discountControl, [Validators.maxLength(40)]);
      this.deleteRequiredfromFormControl(codeControl);
    }
  }

  addRequiredtoFormControl(formControl: string) {
    this.sevenStepFormGroup.controls[formControl].addValidators([Validators.required]);
    this.sevenStepFormGroup.controls[formControl].updateValueAndValidity();
  }

  deleteRequiredfromFormControl(formControl: string, validatorToKeep: Array<any> | false = false) {
    if(!validatorToKeep) {
      this.sevenStepFormGroup.controls[formControl].clearValidators();
      this.sevenStepFormGroup.controls[formControl].updateValueAndValidity();
    } else {
      this.sevenStepFormGroup.controls[formControl].setValidators(validatorToKeep);
      this.sevenStepFormGroup.controls[formControl].updateValueAndValidity();
    }
  }

  activeDiscountValidator(form: FormGroup) {
    return Object.entries(form.value).some(
      (formControl)=> formControl[0].includes('Has') && formControl[1]
    ) ? null:{noDiscountSelected: true};
  }

  addCodeValidator(activeKeys: Record<string, string>[]) {
    activeKeys.forEach(
      (activeKey) => {
        if(!this.sevenStepFormGroup.get(activeKey.controlCode).hasValidator(Validators.required)) {
          this.addRequiredtoFormControl(activeKey.controlCode);
        }
      }
    );
  }

  deleteCodeValidator(activeKeys: Record<string, string>[]) {
    activeKeys.forEach(
      (activeKey) => {
        if (this.sevenStepFormGroup.get(activeKey.controlCode).hasValidator(Validators.required)) {
          this.deleteRequiredfromFormControl(activeKey.controlCode);
        }
      }
    );
  }

  deleteOrAddValidatorsAfterSegmentationChange(activeKeys: Record<string, string>[], segmentationType: string) {
    activeKeys.forEach(
      (activeKey) => {
        if(!activeKey.controlHas.includes(segmentationType)) {
          this.deleteRequiredfromFormControl(activeKey.controlDiscount, [Validators.maxLength(40)]);
          this.deleteRequiredfromFormControl(activeKey.controlCode);
          this.sevenStepFormGroup.get(activeKey.controlHas).setValue(false);
        } else {
          this.addRequiredtoFormControl(activeKey.controlDiscount);
        }
      }
    );
  }

  obtainKeysActiveDiscount(): Array<Record<string, string>> {
    const keysActiveDiscount = [];
    const entriesSegModel = Object.entries(this.segmentationModel) as entriesSegmentationModel[];
    entriesSegModel.forEach(
      (entries) => entries[1]?.active ? keysActiveDiscount.push(
        {controlHas: entries[0]+'Has', controlDiscount:  entries[0]+'Discount', controlCode: entries[0]+'Code'}
      ): ''
    );
    return keysActiveDiscount.length > 0 ? keysActiveDiscount: [];
  }

  checkFormAndPublish() {
    if(!this.sevenStepFormGroup.valid) {
      this.sevenStepFormGroup.markAsDirty();
      this.sevenStepFormGroup.markAllAsTouched();
      return;
    }
    this.publishBenefit();
  }

  checkFormAndSave() {
    if(!this.sevenStepFormGroup.valid) {
      this.sevenStepFormGroup.markAsDirty();
      this.sevenStepFormGroup.markAllAsTouched();
      return;
    }
    this.saveBenefit();
  }

  saveBenefit() {
    const benefit = this.newBenefitService.modelBenefitOld.newBenefit;

    if (benefit.status && benefit.status === 'Publicado') {
      this.newBenefitService.modelBenefitOld.status = 'Publicado';
      this.sendBenefitToFirebase();
    } else {
      benefit.status = 'No Publicado';
      this.newBenefitService.modelBenefitOld.status = 'No Publicado';
      this.sendBenefitToFirebase();
    }
  }

  publishBenefit() {
    if (this.newBenefitService.modelBenefitOld.newBenefit.type === 'personal') {
      this.newBenefitService.modelBenefitOld.newBenefit.statusPersonalBenefit = 'Publicado';
      this.newBenefitService.modelBenefitOld.statusPersonalBenefit = 'Publicado';
      this.newBenefitService.modelBenefitOld.newBenefit.status = 'No Publicado';
      this.newBenefitService.modelBenefitOld.status = 'No Publicado';
    } else {
      this.newBenefitService.modelBenefitOld.newBenefit.status = 'Publicado';
      this.newBenefitService.modelBenefitOld.status = 'Publicado';
    }
    this.sendBenefitToFirebase();
  }

  sendBenefitToFirebase() {
    this.saveStepSeven();
    this.isSavingBenefit = true;
    const benefit = Object.assign({}, this.newBenefitService.modelBenefitOld.newBenefit);
    this.newBenefitService.modelBenefitOld.newBenefit = benefit;
    if (this.benefitsService.getIsModifyingBoolean()) {
      this.benefitsService.updateBenefit(this.newBenefitService.modelBenefitOld)
        .then(() => {
          this.succesBenefitResponse();
        })
        .catch(() => {
          this.failedBenefitResponse();
        });
    } else {
      this.benefitsService.addNewBenefit(this.newBenefitService.modelBenefitOld)
        .then(() => {
          this.succesBenefitResponse();
        })
        .catch(() => {
          this.failedBenefitResponse();
        });
    }
  }

  succesBenefitResponse = () => {
    this.newBenefitService.modelBenefitOld.newBenefit = new NewBenefit();
    this.isSavingBenefit = false;
    this.showModalWhenBenefitIsSaved();
  };

  failedBenefitResponse = () => {
    this.newBenefitService.modelBenefitOld.newBenefit = new NewBenefit();
    this.isSavingBenefit = false;
    this.showModalWhenError();
  };

  showModalWhenBenefitIsSaved() {
    const modalType = this.newBenefitService.modelBenefitOld.newBenefit.status === 'Publicado' ? 'publishSuccess' : 'saveSuccess';
    this.modalDialogService.openModal(modalType)
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.router.navigate(['/home']);
        } else {
          this.goBack();
          this.cleanBenefitToCreate();
        }
      });
  }

  goBack() {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    !this.isModifyingBenefit && this.benefitsService.setIsCreatingAndBackBoolean(true);
    this.router.navigate(['/benefit-creation-step-one']);
  }

  cleanBenefitToCreate() {
    this.newBenefitService.modelBenefitOld = new Benefit();
    this.benefitsService.setBenefitToCreateData(this.newBenefitService.modelBenefitOld);
    this.isModifyingBenefit = false;
    this.benefitsService.setIsModifyingBoolean(false);
  }

  showModalWhenError() {
    this.modalDialogService.openModal('genericError')
      .then((btnPressed) => {
        if (btnPressed === 'right') {
          this.sendBenefitToFirebase();
        }
      });
  }
  saveStepSeven() {
    this.updateOldSegmentationModel();
    this.newBenefitService.modelBenefitOld.newBenefit.segmentationInfo = this.segmentationModelToList();
  }

  segmentationModelToList(): SegmentationItem[] {
    const items: SegmentationItem[] = [];
    const keys = Object.keys(this.segmentationModel);
    for(const key of keys) {
      if(key.includes(this.newBenefitService.selectedSegmentationType)){
        items.push(this.segmentationModel[key]);
      }
    }
    return items;
  }

  updateOldSegmentationModel() {
    for (const type of this.segmentationTypes) {
      for(const item of type.values) {
        //deactivate other segmentations

        if(this.newBenefitService.modelBenefitOld.newBenefit.selectedSegmentation !==  type.type) {
          this.segmentationModel[type.type + item.id].active = false;
        }

        if( item.has !== undefined) {
          this.newBenefitService.modelBenefitOld.newBenefit[item.has] = this.segmentationModel[type.type + item.id].active;
        }
        if( item.discount !== undefined) {
          this.newBenefitService.modelBenefitOld.newBenefit[item.discount] = this.segmentationModel[type.type + item.id].discount;
        }
        if( item.detail !== undefined) {
          this.newBenefitService.modelBenefitOld.newBenefit[item.detail] = this.segmentationModel[type.type + item.id].detail;
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.unsuscribe$?.next();
    this.unsuscribe$?.complete();
  }

}

interface valueSegmentationModel {
  active: boolean;
  code: string;
  detail: string;
  discount: string;
  id: string;
  type: string;
}

type entriesSegmentationModel = [string, valueSegmentationModel];
