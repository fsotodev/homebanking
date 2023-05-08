import { Input, SimpleChanges } from '@angular/core';
import { OnChanges, Component } from '@angular/core';
import { UtilsService } from '@apps/services/utils.service';
import { IAccountTypesPreview } from '@apps/models/promotion';

@Component({
  selector: 'app-cardswp-preview',
  templateUrl: './cardswp-preview.component.html',
  styleUrls: ['./cardswp-preview.component.scss'],
})
export class CardswpPreviewComponent implements OnChanges {
  @Input() public screen: any;
  @Input() public itemList;

  public product: IAccountTypesPreview;
  public wave = { invert: false, show: false };
  public button = {
    backgroundColor: 'white',
    page: '',
    params: '',
    show: false,
    text: '',
    fixed: false,
  };
  public trDisabled = false;
  public trmDisabled = false;
  public saDisabled = false;
  public trsaDisabled = false;
  public trmsaDisabled = false;

  constructor(public utils: UtilsService) {
    this.product = { forTR: true } as IAccountTypesPreview;
  }

  public ngOnChanges(changes: SimpleChanges) {
    const screenValue = changes.screen ? changes.screen.currentValue : null;
    const itemListValue = changes.itemList
      ? changes.itemList.currentValue
      : null;

    if (itemListValue) {
      this.itemList = itemListValue.sort((a, b) => a.order - b.order);
    }
    if (screenValue) {
      const { wave, button } = screenValue;
      this.wave = wave;
      this.button = button;
    }
  }

  public getCardClass(secondCard?: boolean) {
    if (this.product.forTRM) {
      return 'credit img-card-mc-band';
    } else if (this.product.forSA) {
      return 'debit img-card-band';
    } else if (this.product.forTR) {
      return 'credit img-card-band';
    } else if (secondCard && this.product.forSA_TR) {
      return 'credit img-card-band';
    } else if (secondCard && this.product.forSA_TRM) {
      return 'credit img-card-mc-band';
    }

    return 'debit img-card-mc-band';
  }

  public getPan() {
    return '**** **** **** 1234';
  }

  public getProductDescription() {
    const { secondaryTitle } = this.screen;
    const { forTR, forTRM, forSA, forSA_TR, forSA_TRM } = this.product;
    if (forTR) {
      return secondaryTitle.tr;
    } else if (forTRM) {
      return secondaryTitle.trm;
    } else if (forSA) {
      return secondaryTitle.sa;
    } else if (forSA_TR) {
      return secondaryTitle.sa_tr;
    } else if (forSA_TRM) {
      return secondaryTitle.sa_trm;
    } else {
      return '';
    }
  }

  public getProductMessage() {
    const { secondaryTitle } = this.screen;
    const { forTR, forTRM, forSA } = this.product;
    if (forTR || forTRM || forSA) {
      return secondaryTitle.singular;
    }
    return secondaryTitle.plural;
  }

  public getCardsMessage() {
    const name = 'Juan Pérez, ';
    const message = this.getProductMessage();
    const cards = this.getProductDescription();
    return name + message + cards;
  }

  public canShowItem(item) {
    return (
      (item.forSA && this.product.forSA) ||
      (item.forTR && this.product.forTR) ||
      (item.forTRM && this.product.forTRM) ||
      (item.forSA_TR && this.product.forSA_TR) ||
      (item.forSA_TRM && this.product.forSA_TRM)
    );
  }

  get showFixedButton() {
    return !!this.button.show && !!this.button.fixed;
  }

  public checkEvent(event: any, product: string): void {
    const { checked } = event;

    if (checked && product === 'tr') {
      this.product.forTRM = false;
      this.product.forSA = false;
      this.product.forSA_TR = false;
      this.product.forSA_TRM = false;
    } else if (checked && product === 'trm') {
      this.product.forTR = false;
      this.product.forSA = false;
      this.product.forSA_TR = false;
      this.product.forSA_TRM = false;
    } else if (checked && product === 'sa') {
      this.product.forTR = false;
      this.product.forTRM = false;
      this.product.forSA_TR = false;
      this.product.forSA_TRM = false;
    } else if (checked && product === 'trsa') {
      this.product.forTR = false;
      this.product.forTRM = false;
      this.product.forSA = false;
      this.product.forSA_TRM = false;
    } else if (checked && product === 'trmsa') {
      this.product.forTR = false;
      this.product.forTRM = false;
      this.product.forSA = false;
      this.product.forSA_TR = false;
    }
  }
}
