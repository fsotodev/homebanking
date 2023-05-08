import { OnInit, Component } from '@angular/core';
import { ModalDialogService } from '../../../../services/modal-dialog.service';
import { FormGroup, FormBuilder, FormArray, FormControl, AbstractControl, AsyncValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CampaignsEngineService } from '../../../../services/campaigns-engine.service';
import { screenIdValidator } from '../async-validators';

@Component({
  selector: 'app-cardswp',
  templateUrl: './cardswp.component.html',
  styleUrls: ['./cardswp.component.scss'],
})
export class CardswpComponent implements OnInit {
  public cardsForm: FormGroup;
  public extensions = ['svg', 'png', 'jpg', 'jpeg'];
  public uploadFolder = 'welcomeCampaignsImages';
  public isUploadingImage = false;
  public itemList = [];
  public id: string;
  public screen: any;
  public isLoading = false;
  public isEditing: boolean;
  public shouldShowAdvancedConfig = false;
  private cardItemsFormArray: FormArray;

  constructor(
    private formBuilder: FormBuilder,
    private modalDialogService: ModalDialogService,
    private campaignsEngineService: CampaignsEngineService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  public ngOnInit() {
    this.cardsForm = this.formBuilder.group({
      id: ['cardsWP-', {
        validators: [Validators.required],
        asyncValidators: [screenIdValidator(this.campaignsEngineService)],
        updateOn: 'blur'
      }],
      secondaryTitle: this.formBuilder.group({
        singular: '',
        plural: '',
        show: true,
        tr: '<b>tarjeta ripley!</b>',
        trm: '<b>tarjeta ripley mastercard!</b>',
        sa: '<b>cuenta vista zero!</b>',
        sa_tr: '<b>tarjeta de crédito y cuenta vista zero banco ripley!</b>',
        sa_trm: '<b>tarjeta de crédito y cuenta vista zero banco ripley!</b>',
        sam: '<b>tarjeta débito mastercard banco ripley!</b>',
        sam_tr: '<b>tarjeta de crédito y débito mastercard banco ripley!</b>',
        sam_trm: '<b>tarjeta de crédito y débito mastercard banco ripley!</b>'
      }),
      subTitle: this.formBuilder.group({
        color: '#4F2D7F',
        show: true,
        text: 'ahora podrás disfrutar de:',
      }),
      items: this.formBuilder.array([this.createCardItem()]),
      backgroundColor: '#F8F8F8',
      backgroundColorTop: '#4F2D7F',
      wave: { invert: true, show: true },
      exitButton: { color: '#ffffff', right: true, show: true, text: '<p style="font-size: 15px;">✕</p>' },
      infoBox: { iconURL: '', show: false, text: '' },
      button: { backgroundColor: '#EC0EC0', page: 'CardsListPage', params: '', show: false, text: 'Go To <b>Benefits!!!</b>' }
    });

    this.route.queryParams.subscribe((params) => {
      if (params) {
        if (params.id) {
          this.isEditing = true;
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

  public addCardsItem(): void {
    this.cardItemsFormArray = this.cardsForm.get('items') as FormArray;
    this.cardItemsFormArray.push(this.createCardItem());
  }

  public removeCardItem(index): void {
    this.modalDialogService.openModal('deleteConfirm').then((btnPressed) => {
      this.cardItemsFormArray = this.cardsForm.get('items') as FormArray;
      this.cardItemsFormArray.removeAt(index);
    });
  }

  get cardsWP() {
    return this.cardsForm.value;
  }

  get cardsItems() {
    return this.cardsForm.get('items') as FormArray;
  }

  get itemsValue() {
    return this.cardsForm.get('items').value;
  }

  get showFixedButton() {
    return !!this.screen.button.show && !!this.screen.button.fixed;
  }

  receiveUrl(url: string, item: FormControl) {
    item.get('iconURL').setValue(url);
  }

  async saveScreen() {
    this.isLoading = true;
    if (!this.isEditing) {
      this.campaignsEngineService.addNewScreen(this.cardsForm.value, 'page-cards-welcomepack')
        .then(() => {
          this.isLoading = false;
          this.showModalWhenTransactionSaved('saveSuccessCardsWPScreen');
        }).catch((err) => {
          console.log(`Error adding screen: ${err}`);
          this.showModalWhenError();
        });
    } else {
      this.isLoading = true;
      const {id, ...rest} = this.cardsForm.value;
      this.campaignsEngineService.updateScreen(id, rest).then(() => {
        this.isLoading = false;
        this.showModalWhenTransactionSaved('updateSuccessCardsWPScreen');
      }).catch((err) => {
        console.log(`Error updating screen: ${err}`);
        this.showModalWhenError();
      });
    }
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
          this.cardsForm.reset();
        }
      });
  }

  private sortBenefitsByPriorityASC = (a: any, b: any) => a.order - b.order;

  private async loadScreen() {
    try {
      this.screen = await this.campaignsEngineService.getScreen(this.id);
      const itemsLenght = this.screen.items.length;

      for (let i = 0; i < itemsLenght - 1; i++) {
        this.addCardsItem();
      }

      const sortedItems = this.screen.items.sort(this.sortBenefitsByPriorityASC);

      if (this.isEditing) {
        this.screen = { ...this.screen, items: sortedItems };
        this.cardsForm.get('id').setValue(  this.id  );
      } else {
        this.screen = { ...this.screen, items: sortedItems, id: this.cardsForm .get('id').value };
      }

      this.cardsForm.patchValue(this.screen);
      this.itemList = this.cardsForm.get('items').value;

    } catch (error) {
      console.log(`Error loading screen: ${error}`);
    }
  }

  private createCardItem(): FormGroup {
    return this.formBuilder.group({
      color: '#4f2d7f',
      description: '',
      forSA: false,
      forTR: false,
      forTRM: false,
      forSA_TR: false,
      forSA_TRM: false,
      iconURL: '',
      order: 1,
      showMiniCards: false,
      title: '',
    });
  }
}
