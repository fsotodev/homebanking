import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FirebaseService } from '@apps/services/firebase.service';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { NewBenefitService } from '@apps/services/newBenefit.service';
import { BenefitsService } from '@apps/services/benefits.service';

import { FormControl, Validators, FormGroup } from '@angular/forms';
import { BenefitCategory, BenefitType } from '@apps/models/benefit';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';

@Component({
  selector: 'app-benefit-step-one',
  templateUrl: './benefit-step-one.component.html',
  styleUrls: ['./benefit-step-one.component.scss']
})
export class BenefitStepOneComponent implements OnInit {
  @Output() msgTemplateType = new EventEmitter<string>();
  checkedNews = false;
  templateTypes: DropdownElement[] = [];
  categoryTypes: DropdownElement[] = [];
  selectedTemplate: string;
  selectedCategory: string;
  selectedCategoryId: string;
  listHeaderText: string;
  isUploadingCatalog: boolean;
  isUploadingDetail: boolean;
  isUploadingCompany: boolean;
  catalogImage: string;
  detailImage: string;
  companyImage: string;
  setToggleLoading = {
    catalog: (value) => {
      this.isUploadingCatalog = value;
    },
    detail: (value) => {
      this.isUploadingDetail = value;
    },
    company: (value) => {
      this.isUploadingCompany = value;
    }
  };
  firstStepForm: FormGroup;
  isLoading = true;

  setImageBenefit = {
    catalog: (urlImage) => {
      this.catalogImage = urlImage ? urlImage : null;
    },
    detail: (urlImage) => {
      this.detailImage = urlImage ? urlImage : null;
    },
    company: (urlImage) => {
      this.companyImage = urlImage ? urlImage : null;
    }
  };


  constructor(
    private newBenefitService: NewBenefitService,
    private benefitService: BenefitsService,
    private firebaseService: FirebaseService,
    private modalDialogService: ModalDialogService) { }

  async ngOnInit() {
    this.isLoading = true;
    this.templateTypes = templateTypesDymmy;
    this.setModel();
    this.firstStepForm = new FormGroup({
      templateType: new FormControl('', [
        // Validators.required
      ]),
      listHeaderText: new FormControl('',
        // Validators.compose([
        //   Validators.maxLength(35),
        //   Validators.required
        // ])
      ),
      type: new FormControl('', [
        // Validators.required
      ]),
      news: new FormControl('')
    });
    this.categoryTypes = await this.getCategoryTypes();

    this.isLoading = false;
  }

  async getCategoryTypes() {
    const categoryTypes = [];
    const categories: Array<BenefitCategory> = await this.benefitService.getCategories();
    const personalType = categories.splice( categories.findIndex(object =>  object.type === 'personal'), 1)[0];
    categoryTypes.push({ text: personalType.sectionTitle, value: personalType.type,  id: personalType.id, active: personalType.active});

    for(const category of categories) {
      categoryTypes.push({ text: this.getTypeTitle(category), value: category.type, id: category.id,  active: category.active});
    }
    return categoryTypes;
  }

  getTypeTitle(type: BenefitCategory) {
    const status = type.active?'': ' (INACTIVO)';
    return type.sectionTitle + status;
  }

  setModel = () => {
    this.selectedTemplate = this.newBenefitService.modelBenefitOld.newBenefit.templateType;
    this.listHeaderText = this.newBenefitService.modelBenefitOld.newBenefit.listHeaderText;
    this.selectedCategory = this.newBenefitService.modelBenefitOld.newBenefit.typeId;
    this.selectedCategoryId = this.newBenefitService.modelBenefitOld.newBenefit.typeId;
    this.checkedNews = this.newBenefitService.modelBenefitOld.newBenefit.news;
    this.catalogImage = this.newBenefitService.modelBenefitOld.newBenefit.cardImageUrl;
    this.detailImage = this.newBenefitService.modelBenefitOld.newBenefit.mainImageUrl;
    this.companyImage = this.newBenefitService.modelBenefitOld.newBenefit.logoImageUrl;
  };

  isStepOneCompleted = () => !(this.firstStepForm.valid);

  changeTemplateTypes = () => {
    this.sendTemplate();
  };

  sendTemplate() {
    this.msgTemplateType.emit(this.selectedTemplate);
  }

  uploadBenefitImage(event: FileList, type: string) {
    if (event.length <= 0) {
      this.setImageBenefit[type]();
      return;
    }
    this.setToggleLoading[type](true);
    this.firebaseService.uploadFileToFireStorage(event[0], 'benefits')
      .then((urlImage: string) => {
        this.setToggleLoading[type](false);
        this.setImageBenefit[type](urlImage);
      })
      .catch(() => {
        this.setToggleLoading[type](false);
        this.modalDialogService.openModal('genericError')
          .then((btnPressed) => {
            if (btnPressed === 'right') {
              this.uploadBenefitImage(event, type);
            }
          });
      });
  }

  saveStepOne = () => {
    this.newBenefitService.modelBenefitOld.newBenefit.templateType =
      this.selectedTemplate === undefined ? '' : this.selectedTemplate.toString();
    this.newBenefitService.modelBenefitOld.newBenefit.type =
      this.selectedCategory === undefined ? '' : this.categoryTypes.find(type => type.id === this.selectedCategory).value;
    this.newBenefitService.modelBenefitOld.newBenefit.typeId =
      this.selectedCategory === undefined ? '' : this.selectedCategory;
    this.newBenefitService.modelBenefitOld.type =
      this.selectedCategory === undefined ? '' : this.selectedCategory;
    this.newBenefitService.modelBenefitOld.newBenefit.news =
      this.checkedNews;
    this.newBenefitService.modelBenefitOld.newBenefit.listHeaderText =
      this.listHeaderText === undefined ? '' : this.listHeaderText.toString();
    this.newBenefitService.modelBenefitOld.newBenefit.cardImageUrl =
      this.catalogImage === undefined ? '' : this.catalogImage.toString();
    this.newBenefitService.modelBenefitOld.newBenefit.mainImageUrl =
      this.detailImage === undefined ? '' : this.detailImage.toString();
    this.newBenefitService.modelBenefitOld.newBenefit.logoImageUrl =
      this.companyImage === undefined ? '' : this.companyImage.toString();
  };
}

export interface DropdownElement {
  text: string;
  value: string;
  active: boolean;
  id: string;
}



const templateTypesDymmy: DropdownElement[] = [
  {
    text: 'Restofans',
    value: 'restofans',
    id: 'restofans',
    active: true
  },
  {
    text: 'General',
    value: 'general',
    id: 'general',
    active: true
  },
  {
    text: 'OPEX',
    value: 'opex',
    id: 'opex',
    active: true
  }
];

