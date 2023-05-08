import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CampaignsEngineService } from '@apps/services/campaigns-engine.service';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { screenIdValidator } from '../async-validators';

@Component({
  selector: 'app-new-ripley-points',
  templateUrl: './new-ripley-points.component.html',
  styleUrls: ['./new-ripley-points.component.scss']
})
export class NewRipleyPointComponent implements OnInit {
    ripleyItems: FormArray;
    ripleyPointsForm: FormGroup;
    id: string;
    uploadFolder = 'welcomeCampaignsImages';
    extensions = ['svg', 'png', 'jpg', 'jpeg'];
    isUploadingImage = false;
    isEditing: boolean;
    isLoading = false;
    constructor(
        private fb: FormBuilder,
        private modalDialogService: ModalDialogService,
        private location: Location,
        private route: ActivatedRoute,
        private router: Router,
        private campaignEngineService: CampaignsEngineService
    ) { }

    ngOnInit(): void {
      this.ripleyPointsForm = this.fb.group({
        id: ['ripleyPointsWP-',
          {
            validators: [Validators.required], asyncValidators: [
              screenIdValidator(this.campaignEngineService)], updateOn: 'blur'
          }],
        backgroundColor: ['#F8F8F8'],
        backgroundColorTop: ['#4f2d7f'],
        button: this.fb.group({
          backgroundColor: '#4f2d7f',
          class: 'primary',
          fixed: true,
          page: '',
          pagePWA: '',
          params: '',
          show: false,
          text: 'Ver más'
        }),
        exitButton: this.fb.group({
          color: '#FFFFFF',
          right: true,
          show: true,
          text: '<p style="font-size: 15px;">✕</p>'
        }),
        image: this.fb.group({
          class: '',
          show: true,
          url:
          'https://firebasestorage.googleapis.com/v0/b/banco-ripley-app-dev.appspot.com/o/' +
          'logo-rpuntos-welcomepack%20(1)%20(1).png?alt=media&token=07cb72a8-8a90-4125-8b0b-96692be67dae'
        }),
        infoBox: this.fb.group({
          iconURL: '',
          show: false,
          text: ''
        }),
        logo: {
          class: '',
          imageURL: 'https://minisitios.ripley.com.pe/minisitios/especial/ripley-puntos/img/index-home/logo-ripleypuntos-blanco.png',
          imageWidth: '50%',
          show: false
        },
        mainTitle: this.fb.group({
          color: '',
          show: true,
          text: 'Acumula <b style="color:#ffffff">Ripley Puntos Go</b> <b>en todas tus compras!</b>'
        }),
        secondaryTitle: this.fb.group({
          color: 'black',
          show: false,
          text: 'titulo secundario'
        }),
        subTitle: this.fb.group({
          color: '#4f2d7f',
          show: true,
          text:
            '<b style=\'color:#4f2d7f\'>Canjea tus puntos en tu app banco ripley, bancoripley.cl, ripley.com o tiendas ripley:</b>'
        }),
        items: this.fb.array([this.createRipleyPointItem()]),
        template: 'page-flex',
        wave: this.fb.group({
          invert: false,
          show: true
        })
      });

      this.route.queryParams.subscribe((params) => {
        if (params) {
          if (params.id) {
            this.isEditing = true;
            this.ripleyPointsForm.get('id').disable();
            this.id = params.id;
            this.loadScreen();
          } else if (params.copyId) {
            this.id = params.copyId;
            this.isEditing = false;
            this.loadScreen();
          }
        }
      });
    }
    createRipleyPointItem(): FormGroup {
      return this.fb.group({
        description: '',
        iconURL: '',
        color: '#4f2d7f',
        title: ''
      });
    }

    cleanFormArray(controlName) {
      const formArray = this.ripleyPointsForm.get(controlName) as FormArray;
      formArray.value.slice().reverse().forEach((_, index) => {
        formArray.removeAt(index);
      });
    }

    async saveScreen() {
      this.isLoading = true;
      if (!this.isEditing) {
        this.campaignEngineService.addNewScreen(this.ripleyPointsForm.value, 'page-flex')
          .then(() => {
            this.isLoading = false;
            this.showModalWhenTransactionSaved('saveRipleyPointsScreen');
          }).catch((err) => {
            console.log(`Error adding screen: ${err}`);
            this.showModalWhenError();
          });
      } else {
        this.campaignEngineService.updateScreen(this.id, this.ripleyPointsForm.value).then(() => {
          this.isLoading = false;
          this.showModalWhenTransactionSaved('updateRipleyPointsScreen');
        }).catch((err) => {
          console.log(`Error updating screen: ${err}`);
          this.showModalWhenError();
        });
      }
    }

    get isFormInvalid() {
      return this.ripleyPointsForm.invalid || this.ripleyPointsForm.pristine;
    }

    showModalWhenError() {
      this.modalDialogService.openModal('genericError')
        .then((btnPressed) => {
          if (btnPressed === 'right') {
            this.router.navigate(['/home']);
          }
        });
    }

    showModalWhenTransactionSaved(modalType: string) {
      this.modalDialogService.openModal(modalType)
        .then(btnPressed => {
          if (btnPressed === 'right') {
            this.router.navigate(['/list-welcomepack-campaigns']);
          } else {
            this.ripleyPointsForm.reset();
          }
        });
    }

    goBack() {
      this.location.back();
    }

    async loadScreen() {
      try {
        const screen = await this.campaignEngineService.getScreen(this.id);
        const { id, items, ...rest } = screen;
        this.cleanFormArray('items');
        items.forEach(() => {
          this.addRipleyPointItem();
        });
        if (this.isEditing) {
          this.ripleyPointsForm.patchValue({ ...rest, items, id });
        } else {
          this.ripleyPointsForm.patchValue({ ...rest, items });
        }
      } catch (error) {
        console.log(`Error loading screen: ${error}`);
      }
    }

    uploadIconText(i: number) {
      return `Cargar ícono elemento ${i + 1}`;
    }

    receiveUrl(url: string, item: FormControl) {
      item.get('iconURL').setValue(url);
    }

    get ripleyPointsItems() {
      return this.ripleyPointsForm.get('items') as FormArray;
    }

    get ripleyPointsWP() {
      return this.ripleyPointsForm.value;
    }

    addRipleyPointItem(): void {
      this.ripleyItems = this.ripleyPointsForm.get('items') as FormArray;
      this.ripleyItems.push(this.createRipleyPointItem());
    }

    removeRipleyPointItem(index): void {
      this.modalDialogService.openModal('deleteConfirm').then(btnPressed => {
        if (btnPressed === 'right') {
          this.ripleyItems = this.ripleyPointsForm.get('items') as FormArray;
          this.ripleyItems.removeAt(index);
        }
      });
    }
}
