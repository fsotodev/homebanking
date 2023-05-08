import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseService } from '@apps/services/firebase.service';
import { BenefitsService } from '@apps/services/benefits.service';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { BenefitBanner } from '@apps/models/benefitBanner';



@Component({
  selector: 'app-benefit-banners',
  templateUrl: './benefit-banners.component.html',
  styleUrls: ['./benefit-banners.component.scss']
})
export class BenefitBannersComponent implements OnInit {
  MAX_TITLE = 22;
  MAX_DESCRIPTION = 29;
  titleMaxLength = 'Máx. '+ this.MAX_TITLE+' carácteres recomendados';
  descriptionMaxLength = 'Máx. '+ this.MAX_DESCRIPTION+' carácteres recomendados';
  step = 0;
  benefitBannerList: BenefitBanner[] = [];
  isLoading: boolean;
  editingTitle: boolean;
  editingDescription: boolean;
  editingRedirection: boolean;
  editedBanner = 0;
  searchId: string;
  form = new FormGroup({
    title: new FormControl({ disabled: true }, [Validators.required]),
    description: new FormControl('', [Validators.required]),
    redirection:  new FormControl('', [Validators.required]),
    internal:  new FormControl(false, [Validators.required]),
    links:  new FormControl('', [Validators.required])
  });
  config: any;
  links: any[];

  constructor(
    private benefitService: BenefitsService,
    private firebaseService: FirebaseService,
    private modalDialogService: ModalDialogService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar) {
    this.isLoading = false;
    this.editingTitle = false;
    this.editingDescription = false;
    this.editingRedirection = false;
  }

  async ngOnInit() {
    this.openLoading('Cargando información de banners de beneficios ... ');
    this.config = (await this.firebaseService.getData('benefits')).data().bannerConfig;
    this.links = this.config.links;
    await this.getBannerList();
    this.closeLoading();

  }

  setStep(index: number) {
    this.editedBanner = index;
    this.initOptions();
  }

  closeStep(index: number) {
    if(this.editedBanner === index){
      this.editedBanner = -1;
    }
  }

  public async toggleStatus(banner: BenefitBanner, index: number) {
    banner.active = !banner.active;
    await this.save(index);
  }

  public activeEditTitle(editedBanner: number, status: boolean) {
    this.form.controls.title.setValue(this.benefitBannerList[editedBanner].title);
    this.editingTitle = status;
    this.editedBanner = editedBanner;
  }

  public activeEditDescription(editedBanner: number, status: boolean) {
    this.form.controls.description.setValue(this.benefitBannerList[editedBanner].description);
    this.editingDescription = status;
    this.editedBanner = editedBanner;
  }

  public activeEditRedirection(editedBanner: number, status: boolean) {
    this.form.controls.redirection.setValue(this.benefitBannerList[editedBanner].path);
    this.form.controls.internal.setValue(this.benefitBannerList[editedBanner].internal);
    this.editingRedirection = status;
    this.editedBanner = editedBanner;
  }

  public async save(editedBanner: number, _formControl?: FormControl) {
    if (_formControl && _formControl.invalid) {
      _formControl.markAsTouched();
      return;
    }
    this.loading('Guardando');

    if (this.editingDescription) {
      this.benefitBannerList[editedBanner].description = this.form.controls.description.value;
    }
    if (this.editingTitle) {
      this.benefitBannerList[editedBanner].title = this.form.controls.title.value;
    }

    if (this.editingRedirection) {
      this.benefitBannerList[editedBanner].internal = this.form.controls.internal.value;
      this.benefitBannerList[editedBanner].path = this.form.controls.internal.value? this.form.controls.links.value
        : this.form.controls.redirection.value;
    }

    await this.benefitService.updateBannerBenefit(this.benefitBannerList[editedBanner]);
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
    this.firebaseService.uploadFileToFireStorage(event[0], 'benefits').then((urlImage: string) => {
      this.benefitBannerList[index][image] = urlImage;
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


  public openSnackBar(message: string) {
    this._snackBar.open(message, 'cerrar', {
      duration: 4000,
    });
  }

  public async upOrder(order: number) {
    this.loading('Guardando');
    const original = this.benefitBannerList[order];
    const pre = this.benefitBannerList[order-1];
    original.order = order - 1;
    pre.order = order;
    this.benefitBannerList[order-1] = original;
    this.benefitBannerList[order] = pre;
    this.setStep(order-1);
    await this.save(order);
    await this.save(order-1);
    this.loadingEnd();
  }

  private closeEdit() {
    this.editingDescription = false;
    this.editingTitle = false;
    this.editingRedirection = false;
  }

  private async getBannerList() {
    this.isLoading = true;
    this.benefitBannerList = await this.benefitService.getAllBenefitBanners();
    this.isLoading = false;
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
    this.editingDescription = false;
    this.editingRedirection = false;

    this.form.controls.title.setValue('');
    this.form.controls.description.setValue('');
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

