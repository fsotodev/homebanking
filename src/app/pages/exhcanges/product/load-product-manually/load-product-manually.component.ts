import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ProductTransaction } from '../../../../models/productTransaction';
import { Product } from '../../../../models/product';
import { ProductTransactionsService } from '../../../../services/productTransactions.service';
import { DocumentData } from '@firebase/firestore-types';
import { ModalDialogService } from '../../../../services/modal-dialog.service';

@Component({
  selector: 'app-load-product-manually',
  templateUrl: './load-product-manually.component.html',
  styleUrls: ['./load-product-manually.component.scss']
})
export class LoadProductManuallyComponent implements OnInit {

  productTransaction = new ProductTransaction();
  productTransactionForm: FormGroup;
  transactionSearchForm: FormGroup;
  balanceGiftcardForm: FormGroup;
  selectedCategory: string;
  products: Array<Product>;
  categories: Array<DocumentData>;

  constructor(
    private router: Router,
    private location: Location,
    private productTransactionsService: ProductTransactionsService,
    private modalDialogService: ModalDialogService,
  ) { }

  ngOnInit() {

    this.getCategories();
    this.getProducts();

    this.productTransactionForm = new FormGroup({
      categoryMap: new FormControl('',
        Validators.compose([
          Validators.maxLength(35),
          Validators.minLength(1),
          Validators.required])),
      products: new FormControl('',
        Validators.compose([
          Validators.maxLength(100),
          Validators.minLength(0),
          Validators.required])),
      userId: new FormControl('',
        Validators.compose([
          Validators.maxLength(20),
          Validators.minLength(2),
          Validators.required,
          Validators.pattern(/^[0-9]+[0-9kK]{1}$/),
        ])),
      aurisNumber: new FormControl('',
        Validators.compose([
          Validators.required,
          Validators.maxLength(9),
        ]))
    });

    this.transactionSearchForm = new FormGroup({
      userId: new FormControl('',
        Validators.compose([
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(/^[0-9]+[0-9kK]{1}$/),
        ]))
    });

    this.balanceGiftcardForm = new FormGroup({
      productFolio: new FormControl('',
        Validators.compose([
          Validators.required,
        ]))
    });

  }

  showUserTransactions() {
    this.modalDialogService.openModalTableInfo('modalTableTransactions', { userId: this.transactionSearchForm.get('userId').value });
    this.transactionSearchForm.reset();
  }

  showBalance() {
    this.modalDialogService.openModalBalance('modalBalanceGiftcard',
      { giftCardFolio: this.balanceGiftcardForm.get('productFolio').value });
    this.balanceGiftcardForm.reset();
  }

  async getCategories() {
    this.categories = await this.productTransactionsService.getCategories();
  }

  async getProducts() {
    const products = await this.productTransactionsService.getProducts();
    this.products = products.filter(p => {
      if (p.category === 'latam') {
        return !!p.isLatamActive;
      } else if (p.category === 'palumbo') {
        return !!p.isPalumboActive;
      } else {
        return p.active;
      }
    });
  }

  getProductsByCategory(): Array<Product> {
    if (!this.products) {
      return new Array<Product>();
    }
    return this.products.filter(p => p.category === this.selectedCategory);
  }

  loadProduct(product: Product) {
    this.productTransaction.sku = product.sku;
    this.productTransaction.product = product;
    this.productTransaction.createdAt = this.productTransaction.createdAt ? this.productTransaction.createdAt : new Date();

    if (this.selectedCategory === 'gift-card' || this.selectedCategory === 'latam') {
      const expirationDate: Date = new Date();
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
      this.productTransaction.expirationDate = expirationDate;
    } else if (this.selectedCategory === 'latam') {
      this.productTransaction.expirationDate = null;
    } else {
      this.productTransaction.expirationDate = this.categories.find(c => c.categoryId === this.selectedCategory).expirationDate;
    }
  }

  changeSelectCategory() {
    this.productTransaction = new ProductTransaction();
  }

  validateRut(rut: string) {
    if (!rut) {
      return false;
    }
    let t = parseInt(rut.slice(0, -1), 10);
    let m = 0;
    let s = 1;
    while (t > 0) {
      s = (s + (t % 10) * (9 - m++ % 6)) % 11;
      t = Math.floor(t / 10);
    }
    const v = s > 0 ? '' + (s - 1) : 'k';
    return v === rut.slice(-1);
  }

  validateKeys(event) {
    return event.keyCode === 75 || event.keyCode === 107 || (event.keyCode >= 48 && event.keyCode <= 57) || event.keyCode === 8;
  }

  goBack() {
    this.location.back();
  }

  cleanTransaction() {
    this.changeSelectCategory();
    this.selectedCategory = '';
  }

  saveTransaction() {
    this.productTransactionsService.addNewTransaction(this.productTransaction)
      .then(() => {
        this.showModalWhenTransactionSaved();
      })
      .catch(() => {
        this.showModalWhenError();
      });
  }

  showModalWhenTransactionSaved() {
    this.modalDialogService.openModal('saveSuccessTransaction')
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.router.navigate(['/home']);
        } else {
          this.cleanTransaction();
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

  formatRut(event) {
    event.target.value = event.target.value.replace(/[^\dKk]/g, '').toLowerCase();
  }

}
