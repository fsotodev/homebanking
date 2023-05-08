import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { BenefitsService } from '../../../services/benefits.service';
import { WebRPGOService } from '../../../services/webrpgo.service';
import { WebRPGoMenu } from '../../../models/webrRPGoMenu';
import { BenefitCategory } from '../../../models/benefit';
import { Router } from '@angular/router';
import { ModalDialogService } from '../../../services/modal-dialog.service';
import { FirebaseService } from '@apps/services/firebase.service';
import { MatTable } from '@angular/material/table';
import { Benefit } from '@apps/models/benefit';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { WebMenuListUseCase } from '@apps/usecase/WebMenuList';
import { DeleteMenuListUseCase } from '@apps/usecase/DeleteMenuList';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-webrpgo-menu-config',
  templateUrl: './webrpgo-menu-config.component.html',
  styleUrls: ['./webrpgo-menu-config.component.scss']
})
export class WebrpgoMenuConfigComponent implements OnInit {

  @ViewChild('table') table: MatTable<BenefitCategory>;
  originalTypesId: string[] = ['monthly','novelty','opex','restofans', 'weekly'];
  originalTypes: string[] = ['monthly','novelty','productOPEX','restofan', 'weekly'];
  benefitCategories: Array<BenefitCategory>;
  benefitTypesBackup: Array<BenefitCategory>;
  webRPGoMenus: Array<WebRPGoMenu>;
  webRPGoMenusBackup: Array<WebRPGoMenu>;
  personalType: BenefitCategory;
  isUploading = false;
  displayedColumns: string[] = ['orderMenuItem', 'titleMenuItem', 'urlMenuItem'];
  loading = true;
  isEditing = false;
  isCreating = false;
  formGroup: FormGroup;
  dragEnabled = false;
  MenuListObs: Observable<any[]>;
  MenuListArray: Array<any[]>;
  

  constructor(
    private benefitsService: BenefitsService,
    private webRPGoService: WebRPGOService,
    private modalDialogService: ModalDialogService,
    private firebaseService: FirebaseService,
    private router: Router,
    private menuListCache: WebMenuListUseCase,
    private deleteMenulist: DeleteMenuListUseCase,
  ) { 
    this.MenuListObs = this.menuListCache.obtenerMenuList();
    this.menuListCache.menuList$.subscribe(x => this.MenuListArray = x);
  }

  ngOnInit(): void {
    
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
      this.personalType = this.benefitCategories.splice( this.benefitCategories.findIndex(object =>  object.type === 'personal'), 1)[0];
      console.log(this.personalType);
      this.loading = false;
    });

    this.getWebRPGoMenus().then(() => {
      this.loading = false;
    });
  }

  async getBenefitsCategories() {
    this.benefitCategories = await this.benefitsService.getCategories();
  }

  async getWebRPGoMenus() {
    this.webRPGoMenus = await this.webRPGoService.getAllMenu();
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
      this.webRPGoMenus[index].urlMenuItem = '';
      return;
    }
    this.isUploading = true;
    this.firebaseService.uploadFileToFireStorage(event[0], 'benefits')
      .then((urlImage: string) => {
        this.isUploading = false;
        this.webRPGoMenus[index].urlMenuItem = urlImage;
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

  toggleEditing = () => {
    this.webRPGoMenusBackup = JSON.parse(JSON.stringify(this.webRPGoMenus));
    this.isEditing = true;
  };

  cancelEditing = () => {
    this.webRPGoMenus = [...this.webRPGoMenusBackup];
    this.webRPGoMenusBackup = [];
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
      active: true
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
    //promises.push(this.benefitsService.updateCategory(this.personalType));
    let i = 0;
    for (const type of this.webRPGoMenus) {
      type.orderMenuItem = String(i++);
      promises.push(this.webRPGoService.updateMenu(type));
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
    console.log(this.benefitCategories[index].id)
    this.deleteMenulist.eliminarMenuList(this.benefitCategories[index].id);
    this.benefitCategories[index].icon = '';
    this.MenuListObs = this.menuListCache.obtenerMenuList();
    this.menuListCache.menuList$.subscribe(x => this.MenuListArray = x);
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

  dropTable(event: CdkDragDrop<WebRPGoMenu[]>) {
    const prevIndex = this.webRPGoMenus.findIndex((d) => d === event.item.data);
    moveItemInArray(this.webRPGoMenus, prevIndex, event.currentIndex);
    console.log(this.webRPGoMenus);
    this.setOrder();
    this.table.renderRows();
  }

  setOrder = () => {
    this.webRPGoMenus = this.webRPGoMenus.map((group, index) => ({...group, order: index + 1}));
  };
}
