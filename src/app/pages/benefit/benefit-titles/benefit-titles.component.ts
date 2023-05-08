import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { BenefitsService } from '../../../services/benefits.service';
import { BenefitCategory } from '../../../models/benefit';
import { Router } from '@angular/router';
import { ModalDialogService } from '../../../services/modal-dialog.service';
import { FirebaseService } from '@apps/services/firebase.service';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-benefit-titles',
  templateUrl: './benefit-titles.component.html',
  styleUrls: ['./benefit-titles.component.scss']
})
export class BenefitTitlesComponent implements OnInit {
  @ViewChild('table') table: MatTable<BenefitCategory>;

  originalTypesId: string[] = ['monthly','novelty','opex','restofans', 'weekly'];
  originalTypes: string[] = ['monthly','novelty','productOPEX','restofan', 'weekly'];
  benefitCategories: Array<BenefitCategory>;
  benefitTypesBackup: Array<BenefitCategory>;
  personalType: BenefitCategory;
  isUploading = false;
  displayedColumns: string[] = ['order', 'ref', 'title', 'icon', 'active'];
  loading = true;
  isEditing = false;
  isCreating = false;
  formGroup: FormGroup;

  constructor(
    private benefitsService: BenefitsService,
    private modalDialogService: ModalDialogService,
    private firebaseService: FirebaseService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      code: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      icon: new FormControl({value: '' , disabled: true}, [Validators.required]) ,
      order: new FormControl('', [Validators.required,  Validators.min(0)])
    });
    this.getAndConfigBenefitsCategories();
  }

  getAndConfigBenefitsCategories() {
    this.loading = true;
    this.getBenefitsCategories().then(() => {
      this.addControls();
      this.personalType = this.benefitCategories.splice( this.benefitCategories.findIndex(object =>  object.type === 'personal'), 1)[0];
      this.loading = false;
    });
  }

  async getBenefitsCategories() {
    this.benefitCategories = await this.benefitsService.getCategories();
  }

  addControls() {
    this.benefitCategories.find(doc => doc.type === 'personal').order = 0;
  }

  showModalWhenUpdate() {
    this.modalDialogService.openModal('updateSuccessBenefitTypes')
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.router.navigate(['/home']);
        } else {
          this.sortTypes();
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

  sortTypes() {
    return this.benefitCategories.sort((t1, t2) => t1.order - t2.order);
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  uploadIconFile(event: FileList, index: number) {
    console.log(index);
    if (event.length <= 0) {
      this.benefitCategories[index].icon = '';
      return;
    }
    this.isUploading = true;
    this.firebaseService.uploadFileToFireStorage(event[0], 'benefits')
      .then((urlImage: string) => {
        this.isUploading = false;
        this.benefitCategories[index].icon = urlImage;
      })
      .catch((e) => {
        console.error(e);
        this.isUploading = false;
        this.modalDialogService.openModal('genericError')
          .then((btnPressed) => {
            if (btnPressed === 'right') {
              this.uploadIconFile(event, index);
            }
          });
      });
  };


  uploadNewIconFile(event: FileList) {
    this.firebaseService.uploadFileToFireStorage(event[0], 'benefits')
      .then((urlImage: string) => {
        this.isUploading = false;
        this.formGroup.get('icon').setValue(urlImage);
      })
      .catch((e) => {
        console.error(e);
        this.isUploading = false;
        this.modalDialogService.openModal('genericError')
          .then((btnPressed) => {
            if (btnPressed === 'right') {
              this.uploadNewIconFile(event);
            }
          });
      });
  }

  toggleEditing = () => {
    this.benefitTypesBackup = JSON.parse(JSON.stringify(this.benefitCategories));
    this.isEditing = true;
  };

  cancelEditing = () => {
    this.benefitCategories = [...this.benefitTypesBackup];
    this.benefitTypesBackup = [];
    this.isEditing = false;
  };
  cancelCreating = () => {
    this.isCreating = false;
  };
  async saveChanges() {
    this.loading = true;
    if(this.isEditing){
      this.saveCategories();
    }
    if(this.isCreating){
      await this.saveNewCategory();
    }
  }

  async saveNewCategory(){
    const newCategory = {
      type: this.formGroup.get('code').value,
      sectionTitle: this.formGroup.get('title').value,
      icon: this.formGroup.get('icon').value,
      order: this.formGroup.get('order').value,
      active: false
    };
    if(this.formGroup.invalid || !newCategory.icon || newCategory.icon === '') {
      this.loading = false;
      return;
    }

    const response = await this.benefitsService.addNewBenefitCategory(newCategory);
    if(response.ok) {
      this.getAndConfigBenefitsCategories();
      this.isCreating = false;
      this.loading = false;
      return;
    }
    console.error(response.doc);
    this.showModalWhenError();
    this.loading = false;
  }

  saveCategories(){
    const promises = Array<Promise<any>>();
    promises.push(this.benefitsService.updateCategory(this.personalType));
    for (const type of this.benefitCategories) {
      promises.push(this.benefitsService.updateCategory(type));
      if(this.originalTypesId.includes(type.id)) {
        promises.push(this.benefitsService.updateType({id: type.id, ref: type.type, sectionTitle: type.sectionTitle, order: type.order}));
      }
    }
    Promise.all(promises).then(() => {
      this.showModalWhenUpdate();
      this.isEditing = false;
      this.loading = false;
    })
      .catch(() => {
        this.showModalWhenError();
        this.loading = false;
      });
  }

  deleteIcon(index: number) {
    this.benefitCategories[index].icon = '';
  }

  createCategory(){
    this.isCreating = true;
    this.formGroup.reset();
  }

  cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    if(!control.value) {
      return null;
    }
    if((control.value as string).indexOf(' ') >= 0){
      return { cannotContainSpace: true };
    }

    return null;
  }
}
