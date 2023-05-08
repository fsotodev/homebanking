import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Benefit } from '@apps/models/benefit';
import { NewBenefit } from '@apps/models/new-benefit';
import { BenefitsService } from '@apps/services/benefits.service';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { NewBenefitService } from '@apps/services/newBenefit.service';

@Component({
  selector: 'app-benefit-step-six',
  templateUrl: './benefit-step-six.component.html',
  styleUrls: ['./benefit-step-six.component.scss']
})
export class BenefitStepSixComponent implements OnInit {
  sixthStepForm: FormGroup;
  isSavingBenefit: boolean;
  isModifyingBenefit: boolean;
  isUnique: boolean;
  collapsibles: any;


  constructor(
    public newBenefitService: NewBenefitService,
    private modalDialogService: ModalDialogService,
    private router: Router,
    private benefitsService: BenefitsService) { }

  ngOnInit() {
    this.setModel(); //trae toda la data
  }

  setModel = () => {
    let collapsBackup;
    collapsBackup = JSON.stringify(this.newBenefitService.modelBenefitOld.newBenefit.collapsibles);
    if(collapsBackup === '' || collapsBackup === undefined){
      collapsBackup = [];
      localStorage.setItem('collapsibles', JSON.stringify(collapsBackup));
    } else {
      localStorage.setItem('collapsibles', collapsBackup);

    }
  };

  saveStepSix() {
    const collapsBackup = JSON.parse(localStorage.getItem('collapsibles'));
    this.newBenefitService.modelBenefitOld.newBenefit.collapsibles = collapsBackup === undefined ? '' : collapsBackup;
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

  sendBenefitToFirebase() {
    this.saveStepSix();
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

}

