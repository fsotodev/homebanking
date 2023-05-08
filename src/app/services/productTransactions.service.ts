import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Utils } from '../pages/shared-components/utils/utils';
import { Product } from '../models/product';
import { ProductTransaction } from '../models/productTransaction';
import { DocumentData } from '@firebase/firestore-types';
import { AuthFirebaseService } from '@apps/shared/services/auth/auth-firebase.service';

@Injectable()
export class ProductTransactionsService {

  constructor(
    private firebaseService: FirebaseService,
    private auth: AuthFirebaseService
  ) { }

  async getCategories(): Promise<Array<DocumentData>> {
    const categories = new Array<DocumentData>();
    const querySnapshot = await this.firebaseService.getFirebaseCollection('productCategories')
      .ref.orderBy('order', 'asc').get();
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.map((doc) => {
        categories.push(doc.data());
      });
    }
    return categories;
  }

  async getCategoriesMap(): Promise<Map<string, string>> {
    const categoriesMap = new Map<string, string>();
    const querySnapshot = await this.firebaseService.getFirebaseCollection('productCategories')
      .ref.orderBy('order', 'asc').get();
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach(doc => {
        categoriesMap.set(doc.data().categoryId, doc.data().name);
      });
    }
    return categoriesMap;
  }

  async getProducts(allProducts = false): Promise<Array<Product>> {
    const products = new Array<Product>();
    const querySnapshot = await this.firebaseService.getFirebaseCollection('products')
      .ref.orderBy('points').get();
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach(doc => {
        const product = doc.data() as Product;
        product.sku = doc.id;
        this.addProductToList(products, product, allProducts);
      });
    }
    return products;
  }

  addProductToList(products, product, allProducts) {
    if(allProducts
      || this.isLatamProduct(product)
      || this.isPalumboCategory(product)
      || product.active) {
      products.push(product);
    }
  }

  isPalumboCategory(product) {
    return product.category === 'palumbo' && product.isPalumboActive;
  }

  isLatamProduct(product) {
    return product.category === 'latam' && product.isLatamActive;
  }

  async addNewTransaction(productTransaction: ProductTransaction): Promise<any> {
    const productTransactionToAdd = this.generateProductTransactionData(productTransaction);
    const lastUpdateInfoRef = await this.firebaseService.addAdminLog('create-product-transaction', {
      category: productTransactionToAdd['category'],
      active: productTransactionToAdd['active'],
      sku: productTransactionToAdd['sku'],
      userId: productTransactionToAdd['userId'],
    });
    productTransactionToAdd['lastUpdateInfoRef'] = lastUpdateInfoRef;
    const user = await this.auth.userInfo();
    const docRef = await this.firebaseService.getFirebaseCollection('productTransactions')
      .add({
        executedBy: user,
        token: await this.auth.getIdToken(),
        origin: 'admin',
        ...productTransactionToAdd
      });
    await lastUpdateInfoRef.update({ transactionRef: docRef });
    return docRef;
  }

  defaultErrortMap() {
    return { limitExceeded: 'Límite excedido', outOfStock: 'Producto sin stock' };
  }

  async hasCodesStock(productId: string, valid = true) {
    const type = valid? 'codes': 'invalidCodes';
    const codesRef = this.firebaseService.getFirebaseCollection('products/' + productId + '/' + type).ref.limit(1);
    const codes = (await codesRef.get()).docs;
    return codes.length ;
  }
  private generateProductTransactionData(productTransaction: ProductTransaction): any {
    return {
      canRedeem: productTransaction.canRedeem ? productTransaction.canRedeem : true,
      code: productTransaction.code ? productTransaction.code : '',
      createdAt: productTransaction.createdAt ? productTransaction.createdAt : new Date(),
      email: productTransaction.email ? productTransaction.email : '',
      enoughPoints: productTransaction.enoughPoints ? productTransaction.enoughPoints : true,
      eventId: productTransaction.eventId ? productTransaction.eventId : '',
      expirationDate: productTransaction.expirationDate ? productTransaction.expirationDate : null,
      folio: 0,
      productFolio: productTransaction.productFolio ? productTransaction.productFolio : '',
      productUploadedAt: productTransaction.productUploadedAt ? productTransaction.productUploadedAt : new Date(),
      sku: productTransaction.sku ? productTransaction.sku : '',
      status: productTransaction.status ? productTransaction.status : 'pending',
      userId: productTransaction.userId ? productTransaction.userId.toLocaleLowerCase().replace(/[^0-9k]/g, '') : '',
      yearRedeem: productTransaction.yearRedeem ? productTransaction.yearRedeem : new Date().getFullYear(),
      aurisNumber: productTransaction.aurisNumber ? productTransaction.aurisNumber : 0,
      origin: productTransaction.origin ? productTransaction.origin : 'admin',

      // Product
      successMessage: productTransaction.product.successMessage ? productTransaction.product.successMessage : '',
      actionSelectProduct: productTransaction.product.actionSelectProduct ? productTransaction.product.actionSelectProduct : '',
      active: productTransaction.product.active ? productTransaction.product.active : true,
      category: productTransaction.product.category ? productTransaction.product.category : '',
      errorMessages: productTransaction.product.errorMessages ? productTransaction.product.errorMessages : this.defaultErrortMap(),
      fullName: productTransaction.product.fullName ? productTransaction.product.fullName : '',
      image: productTransaction.product.image ? productTransaction.product.image : '',
      limit: productTransaction.product.limit ? productTransaction.product.limit : 0,
      points: productTransaction.product.points ? productTransaction.product.points : 0,
      promotionCode: productTransaction.product.promotionCode ? productTransaction.product.promotionCode : '',
      selectedSubtitle: productTransaction.product.selectedSubtitle ? productTransaction.product.selectedSubtitle : '',
      selectedTitle: productTransaction.product.selectedTitle ? productTransaction.product.selectedTitle : '',
      stock: productTransaction.product.stock ? productTransaction.product.stock : 0,
      successfulExchanges: productTransaction.product.successfulExchanges ? productTransaction.product.successfulExchanges : 0,
      termsAndConditionsPDF: productTransaction.product.termsAndConditionsPDF ? productTransaction.product.termsAndConditionsPDF : '',
      termsAndConditionsText: productTransaction.product.termsAndConditionsText ? productTransaction.product.termsAndConditionsText : '',
      termsAndConditionsURL: productTransaction.product.termsAndConditionsURL ? productTransaction.product.termsAndConditionsURL : '',
      updatedAt: productTransaction.product.updatedAt ? productTransaction.product.updatedAt : new Date(),
      value: productTransaction.product.value ? productTransaction.product.value : 0,
      giftcardColor: productTransaction.product.giftcardColor ? productTransaction.product.giftcardColor : '',
      hasMultiplier: productTransaction.product.hasMultiplier ? productTransaction.product.hasMultiplier : false,
      giftcardMultiplier: productTransaction.product.giftcardMultiplier ? productTransaction.product.giftcardMultiplier : 0,
      confirmationSelectedTitle:
        productTransaction.product.confirmationSelectedTitle ? productTransaction.product.confirmationSelectedTitle : '',

      // Palumbo specific values
      isPalumboActive: productTransaction.product.isPalumboActive ? productTransaction.product.isPalumboActive : false,
      // Latam specific values
      isLatamActive: productTransaction.product.isLatamActive ? productTransaction.product.isLatamActive : false,
      latamCode: productTransaction.product.latamCode ? productTransaction.product.latamCode : '',
      latamName: productTransaction.product.latamName ? productTransaction.product.latamName : '',
    };
  }
}
