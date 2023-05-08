import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from '../../../../services/firebase.service';
import { ModalDialogService } from '../../../../services/modal-dialog.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, Tips, Instructions } from '../../../../models/category';
import { CategoryService } from '../../../../services/category.service';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.scss']
})
export class NewCategoryComponent implements OnInit {
  public categoryForm: FormGroup;
  public category: any;
  public isUploadingImage: boolean;
  public id: string;
  public extensions = ['svg', 'png', 'jpg', 'jpeg'];

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private categoryService: CategoryService,
    private modalDialogService: ModalDialogService,
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params && params.id) {
        this.id = params.id;
        this.loadCategory();
      }
    });
  }

  ngOnInit() {
    this.categoryForm = new FormGroup({
      categoryId: new FormControl('', Validators.compose([
        Validators.required, Validators.maxLength(50)
      ])),
      categoryTitle: new FormControl('', Validators.compose([
        Validators.maxLength(50)
      ])),
      name: new FormControl('', Validators.compose([
        Validators.required, Validators.maxLength(50)
      ])),
      expirationDate: new FormControl('', Validators.compose([
        Validators.required
      ])),
      actionSelectProduct: new FormControl('', Validators.compose([
        Validators.required, Validators.maxLength(80)
      ])),
      codeType: new FormControl('', Validators.compose([
      ])),
      confirmationSelectedTitle: new FormControl('', Validators.compose([
        Validators.required, Validators.maxLength(100)
      ])),
      order: new FormControl('', Validators.compose([
        Validators.required, Validators.maxLength(5)
      ])),
      successTitle: new FormControl('', Validators.compose([
        Validators.required, Validators.maxLength(100)
      ])),
      bannerText: new FormControl('', Validators.compose([
        Validators.required, Validators.maxLength(100)
      ])),
    });
    this.category = new Category();
  }

  async uploadImage(event: FileList) {
    if (event.length > 0) {
      this.isUploadingImage = true;
      this.firebaseService.uploadFileToFireStorage(event[0], 'categories/images')
        .then((urlImage: string) => {
          this.category.image = urlImage;
          this.isUploadingImage = false;
        })
        .catch(() => {
          this.isUploadingImage = false;
          this.modalDialogService.openModal('genericError')
            .then((btnPressed) => {
              if (btnPressed === 'right') {
                this.uploadImage(event);
              }
            });
        });
    } else {
      this.category.image = null;
    }
  }

  goBack() {
    this.location.back();
  }

  async loadCategory() {
    const category = await this.categoryService.getCategory(this.id) as Category;
    this.category.active = category.active;
    this.category.image = category.image;
    this.category.categoryTips = category.categoryTips ? category.categoryTips : [{}];
    this.category.categoryInstructions = category.categoryInstructions ? category.categoryInstructions : [{}];
    this.categoryForm.patchValue({categoryId: category.categoryId ? category.categoryId : ''});
    this.categoryForm.patchValue({categoryTitle: category.categoryTitle ? category.categoryTitle : ''});
    this.categoryForm.patchValue({name: category.name ? category.name : ''});
    this.categoryForm.patchValue({expirationDate: category.expirationDate ? category.expirationDate.toDate() : ''});
    this.categoryForm.patchValue({actionSelectProduct: category.actionSelectProduct ? category.actionSelectProduct : ''});
    this.categoryForm.patchValue({codeType: category.codeType ? category.codeType : ''});
    this.categoryForm.patchValue({confirmationSelectedTitle: category.confirmationSelectedTitle ? category.confirmationSelectedTitle : ''});
    this.categoryForm.patchValue({order: category.order ? category.order : ''});
    this.categoryForm.patchValue({successTitle: category.successTitle ? category.successTitle : ''});
    this.categoryForm.patchValue({bannerText: category.bannerText ? category.bannerText : ''});
  }

  showModalWhenCategorySaved(modalType: string) {
    this.modalDialogService.openModal(modalType)
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.router.navigateByUrl('/list-category');
        }
      });
  }

  showModalWhenError() {
    this.modalDialogService.openModal('genericError')
      .then((btnPressed) => {
        if (btnPressed === 'right') {
          this.router.navigateByUrl('/list-category');
        }
      });
  }

  addArrayOf(type: string) {
    if (type === 'tips') {
      this.category.categoryTips.push({});
    } else if (type === 'inst') {
      this.category.categoryInstructions.push({});
    }
  }

  saveCategory() {
    this.categoryService.addNewCategory(this.category)
      .then((ref) => {
        this.showModalWhenCategorySaved('saveSuccessCategory');
      })
      .catch((error) => {
        console.error('add category error', error);
        this.showModalWhenError();
      });
  }

  updateCategory() {
    this.categoryService.updateCategory(this.id, this.category)
      .then(() => {
        this.showModalWhenCategorySaved('updateSuccessCategory');
      }).catch((error) => {
        console.error('update category error', error);
        this.showModalWhenError();
      });
  }

  getFormControl(i) {
    console.log(i);
  }

  receiveUrl(url: string, index: number, type: 'tip' | 'instruction') {
    if (type === 'tip') {
      this.category.categoryTips[index].iconURL = url;
    } else if (type === 'instruction') {
      this.category.categoryInstructions[index].iconURL = url;
    }
  }

}
