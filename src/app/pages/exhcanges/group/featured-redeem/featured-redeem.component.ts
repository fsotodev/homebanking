import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeaturedRedeem } from '@apps/models/featuredRedeem';
import { FirebaseService } from '@apps/services/firebase.service';
import { GroupService } from '@apps/services/group.service';
import { ModalDialogService } from '@apps/services/modal-dialog.service';

const MAX_TITLE = 33;
const MAX_SUBTITLE = 23;

@Component({
  selector: 'app-featured-redeem',
  templateUrl: './featured-redeem.component.html',
  styleUrls: ['./featured-redeem.component.scss']
})
export class FeaturedRedeemComponent implements OnInit {
  titleMaxLength = 'máx '+ MAX_TITLE+' carácteres';
  subtitleMaxLength = 'máx '+ MAX_SUBTITLE+' carácteres';
  step = 0;
  featuredRedeemsList: FeaturedRedeem[] = [];
  isLoading: boolean;
  editingTitle: boolean;
  editingSubtitle: boolean;
  editedRedeem = 0;
  searchId: string;
  newProduct: any;
  form = new FormGroup({
    title: new FormControl({ disabled: true }, [Validators.required, Validators.maxLength(MAX_TITLE)]),
    subtitle: new FormControl('', [Validators.required, Validators.maxLength(MAX_SUBTITLE)])
  });

  displayedColumns: string[] = ['id', 'name', 'category', 'points'];
  config: any;

  constructor(
    private groupService: GroupService,
    private firebaseService: FirebaseService,
    private modalDialogService: ModalDialogService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar) {
    this.isLoading = false;
    this.editingTitle = false;
    this.editingSubtitle = false;
  }

  async ngOnInit() {
    this.openLoading('Cargando información de canjes destacados ... ');
    this.config = (await this.firebaseService.getData('featuredRedeem')).data();
    await this.getRedeemsList();
    this.closeLoading();

  }

  setStep(index: number) {
    this.editedRedeem = index;
    this.initOptions();
  }

  closeStep(index: number) {
    if(this.editedRedeem === index){
      this.editedRedeem = -1;
    }
  }

  public async toggleStatus(redeem: FeaturedRedeem, index: number) {
    redeem.isActive = !redeem.isActive;
    await this.save(index);
  }

  public activeEditTitle(editedRedeem: number, status: boolean) {
    this.form.controls.title.setValue(this.featuredRedeemsList[editedRedeem].title);
    this.editingTitle = status;
    this.editedRedeem = editedRedeem;
  }

  public activeEditSubtitle(editedRedeem: number, status: boolean) {
    this.form.controls.subtitle.setValue(this.featuredRedeemsList[editedRedeem].subtitle);
    this.editingSubtitle = status;
    this.editedRedeem = editedRedeem;
  }

  public async save(editedRedeem: number, _formControl?: FormControl) {
    if (_formControl && _formControl.invalid) {
      _formControl.markAsTouched();
      return;
    }
    this.loading('Guardando');

    if (this.editingSubtitle) {
      this.featuredRedeemsList[editedRedeem].subtitle = this.form.controls.subtitle.value;
    }
    if (this.editingTitle) {
      this.featuredRedeemsList[editedRedeem].title = this.form.controls.title.value;
    }
    await this.groupService.updateFeaturedRedeems(this.featuredRedeemsList[editedRedeem].id, this.featuredRedeemsList[editedRedeem]);
    this.closeEdit();
    this.loadingEnd();
  }

  public getErrorMessage(_formControl: FormControl) {
    if (_formControl.hasError('required')) {
      return 'Debe ingresar un valor';
    }

    return _formControl.hasError('maxlength') ? 'máx ' + _formControl.getError('maxlength')['requiredLength'] + ' carácteres'
      : 'Valor inválido';
  }

  public uploadImage(event: FileList, index: number, image: string) {
    if (event.length <= 0) {
      return;
    }
    this.firebaseService.uploadFileToFireStorage(event[0], 'featuredRedeemGroup').then((urlImage: string) => {
      this.featuredRedeemsList[index][image] = urlImage;
      if(image === 'imgXS') {
        this.featuredRedeemsList[index]['imgMD'] = urlImage;
      }
      this.save(index);
    }).catch((error) => {
      console.log(error);
      this.modalDialogService.openModal('genericError')
        .then((btnPressed) => {
          if (btnPressed === 'right') {
            this.uploadImage(event, index, image);
          }
        });
    });
  }

  public openDialog(imgSrc: string) {
    this.dialog.open(AppImgPreviewComponent, {
      data: {
        src: imgSrc
      },
    });
  }

  public openLoading(messagge?: string) {
    this.dialog.open(LoadingInternComponent, {
      data: {
        msg: messagge
      },
    });
  }

  public closeLoading() {
    this.dialog.closeAll();
  }

  public async searchProduct(index: number) {
    this.loading('Buscando producto ...');

    if (!this.searchId) {
      this.closeLoading();
      return;
    }

    if (this.productExistOnRedeem(index, this.searchId)) {
      this.closeLoading();
      this.openSnackBar('Producto ' + this.searchId + ' ya existe en canje destacado.');
      return;
    }

    this.editedRedeem = index;
    this.newProduct = await this.groupService.getProduct(this.searchId);
    this.informNewProductWarning(this.newProduct);
    this.closeLoading();
  }

  public cleanAddProduct() {
    this.newProduct = undefined;
    this.searchId = '';
  }

  public async addProduct() {
    this.loading('Agregando producto ...');
    this.featuredRedeemsList[this.editedRedeem].products.push(this.searchId);
    this.featuredRedeemsList[this.editedRedeem].productsList.push({ id: this.searchId, ...this.newProduct });
    try {
      await this.groupService.updateProducts(this.featuredRedeemsList[this.editedRedeem].id,
        this.featuredRedeemsList[this.editedRedeem].products);
      this.cleanAddProduct();
    } catch (error) {
      console.error(error);
      this.openSnackBar('Error al agregar producto ' + this.searchId);
      this.featuredRedeemsList[this.editedRedeem].products.pop();
      this.featuredRedeemsList[this.editedRedeem].productsList.pop();
    } finally {
      this.closeLoading();
    }
  }

  public async deleteProduct(index, productId) {
    this.loading('Borrando producto ...');
    this.featuredRedeemsList[index].products =
      this.featuredRedeemsList[index].products.filter((product) => product !== productId);
    try {
      if(this.featuredRedeemsList[index].products.length === 0){
        this.featuredRedeemsList[index].isActive = false;
        await this.groupService.updateFeaturedRedeems(this.featuredRedeemsList[this.editedRedeem].id,
          this.featuredRedeemsList[this.editedRedeem]);
      } else {
        await this.groupService.updateProducts(this.featuredRedeemsList[this.editedRedeem].id,
          this.featuredRedeemsList[this.editedRedeem].products);
      }
      this.featuredRedeemsList[this.editedRedeem].productsList =
      this.featuredRedeemsList[this.editedRedeem].productsList.filter((product) => product.id !== productId);
    } catch(error) {
      console.error(error);
      this.featuredRedeemsList[this.editedRedeem].products.push(productId);
    } finally {
      this.closeLoading();
    }
  }

  public openSnackBar(message: string) {
    this._snackBar.open(message, 'cerrar', {
      duration: 4000,
    });
  }

  private productExistOnRedeem(index: number, id: string): boolean {
    return this.featuredRedeemsList[index].productsList.some((product) => product.id === id);
  }

  private closeEdit() {
    this.editingSubtitle = false;
    this.editingTitle = false;
  }

  private async getRedeemsList() {
    this.isLoading = true;
    await this.groupService.getAllFeaturedRedeems().then((resultList) => {
      this.featuredRedeemsList = resultList;
      this.isLoading = false;
    });
  }

  private loading(msg: string) {
    this.isLoading = true;
    this.openLoading(msg);

  }
  private loadingEnd() {
    this.isLoading = false;
    this.closeLoading();
  }

  private initOptions() {
    this.editingTitle = false;
    this.editingSubtitle = false;
    this.searchId = '';
    this.newProduct = undefined;
  }

  private informNewProductWarning(newProduct: any) {
    if (!newProduct) {
      this.openSnackBar('No se encontró el producto ' + this.searchId);
      return;
    }

    if (!newProduct.active) {
      this.openSnackBar('Producto no publicado. No aparecerá en listado de canjes destacados');
      return;
    }

    if (!newProduct.publishedCategory) {
      this.openSnackBar('Categoría no publicada. No aparecerá en listado de canjes destacados');
    }
  }
}
@Component({
  selector: 'app-img-preview',
  template: `<img [src]="data.src" alt>`
})
export class AppImgPreviewComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}

@Component({
  selector: 'app-loading-intern',
  template: `<span style='font-family:sans-serif;'>{{data.msg}}</span>`
})
export class LoadingInternComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
