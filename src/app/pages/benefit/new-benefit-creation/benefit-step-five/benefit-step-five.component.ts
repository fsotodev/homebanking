import { Component, OnInit } from '@angular/core';
import { NewBenefitService } from '@apps/services/newBenefit.service';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { Router } from '@angular/router';
import { BenefitsService } from '@apps/services/benefits.service';
import { NewBenefit } from '@apps/models/new-benefit';
import { Benefit } from '@apps/models/benefit';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-benefit-step-five',
  templateUrl: './benefit-step-five.component.html',
  styleUrls: ['./benefit-step-five.component.scss']
})
export class BenefitStepFiveComponent implements OnInit {
  show: boolean;
  linkText: string;
  dynamicUrl: string;
  shareText: string;
  isSavingBenefit: boolean;
  isModifyingBenefit: boolean;
  fifthStepForm: FormGroup;

  constructor(
    private newBenefitService: NewBenefitService,
    private modalDialogService: ModalDialogService,
    private router: Router,
    private benefitsService: BenefitsService) { }

  ngOnInit() {
    this.setModel();
    this.fifthStepForm = new FormGroup({
      linkText: new FormControl('',
        // Validators.compose([
        //   Validators.maxLength(100),
        //   Validators.minLength(1)
        // ])
      ),
      shareText: new FormControl('',
        // Validators.compose([
        //   Validators.maxLength(100),
        //   Validators.minLength(1)
        // ])
      ),
      dynamicUrl: new FormControl('',
        // Validators.compose([
        //   Validators.maxLength(100),
        //   Validators.minLength(1)
        // ])
      ),
      showLink: new FormControl(''),
    });
  }

  setModel = () => {
    this.linkText = this.newBenefitService.modelBenefitOld.newBenefit.linkText;
    this.shareText = this.newBenefitService.modelBenefitOld.newBenefit.shareText;
    this.dynamicUrl = this.newBenefitService.modelBenefitOld.newBenefit.dynamicUrl;
    this.show = this.newBenefitService.modelBenefitOld.newBenefit.showLink;
  };

  setDynamicUrl = (type: string) => {
    this.dynamicUrl = type;
  };

  saveBenefit() {
    if (this.newBenefitService.modelBenefitOld.newBenefit.status
      && this.newBenefitService.modelBenefitOld.newBenefit.status === 'Publicado') {
      this.newBenefitService.modelBenefitOld.status = 'Publicado';
      this.sendBenefitToFirebase();
    } else {
      this.newBenefitService.modelBenefitOld.newBenefit.status = 'No Publicado';
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
    this.saveStepFive();
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
  saveStepFive = () => {
    this.newBenefitService.modelBenefitOld.newBenefit.linkText = this.linkText === undefined ? '' : this.linkText.toString();
    this.newBenefitService.modelBenefitOld.newBenefit.dynamicUrl = this.dynamicUrl === undefined ? '' : this.dynamicUrl.toString();
    this.newBenefitService.modelBenefitOld.newBenefit.shareText = this.shareText === undefined ? '' : this.shareText.toString();
    this.newBenefitService.modelBenefitOld.newBenefit.showLink = !!(this.show);
  };
}
