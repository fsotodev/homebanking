import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Product } from '../models/product';
import { DocumentData } from '@firebase/firestore-types';
import { Category } from '../models/category';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';
import {AuthFirebaseService} from '@apps/shared/services/auth/auth-firebase.service';

@Injectable()
export class ProductsService {

  constructor(
    private afAuth: AngularFireAuth,
    private firebaseService: FirebaseService,
    private http: HttpClient,
    private authFirebaseService: AuthFirebaseService
  ) { }

  async getCategories(): Promise<Array<DocumentData>> {
    const categories = new Array<DocumentData>();
    const querySnapshot = await this.firebaseService.getFirebaseCollection('productCategories')
      .ref.orderBy('order', 'asc').get();
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach(doc => {
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

  async addNewProduct(product: Product): Promise<any> {
    try {
      const productToAdd = this.generateProductData(product);
      const lastUpdateInfoRef = await this.firebaseService.addAdminLog('create-product', {
        category: productToAdd.category,
        active: productToAdd.active,
      });
      productToAdd.lastUpdateInfoRef = lastUpdateInfoRef;
      const docRef = await this.firebaseService.getFirebaseCollection('products')
        .add(productToAdd);

      await lastUpdateInfoRef.update({ sku: docRef.id });
      return docRef;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  // To upload a Map to Firebase
  convertMap(map: Map<string, string>) {
    return {
      limitExceeded: map['limitExceeded'],
      outOfStock: map['outOfStock'],
    };
  }

  convertMap2(map: Map<string, string>) {
    return {
      show: map['show'],
      text: map['text'],
      url: map['url'],
    };
  }

  public async updateProduct(id: string, data: Product) {
    console.log(`updating ${id} => `, data);
    try {
      const lastUpdateInfoRef = await this.firebaseService.addAdminLog('update-product', {
        sku: id,
        category: data.category,
        active: data.active,
      });

      return await this.firebaseService.getFirebaseCollection('products')
        .doc(id)
        .set({
          ...data,
          updatedAt: new Date(),
          lastUpdateInfoRef,
        }, { merge: true })
        .then(() => true)
        .catch((error) => error);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  public async getAllProducts() {
    const products = [];
    const querySnapshot = await this.firebaseService.getFirebaseCollection('products').ref.get();
    querySnapshot.forEach((doc) => {
      if (querySnapshot.empty) {
        return;
      }
      const id = doc.id;
      const product = { id, ...doc.data() } as Category;
      products.push(product);
    });
    return products;
  }

  public async getProduct(id: string) {
    const productQuery = await this.firebaseService.getFirebaseCollection('products').doc(id).ref.get();
    return productQuery.data() as Product;
  }

  public async getProductsCodes(sku: string) {
    const productCodes = [];
    const querySnapshot = await this.firebaseService.getFirebaseCollection('products/' + sku + '/codes').ref
      .orderBy('productUploadedAt', 'desc')
      .limit(20).get();
    querySnapshot.forEach((doc) => {
      if (!querySnapshot) {
        return;
      }
      const productCode = { ...doc.data() };
      productCodes.push(productCode);
    });
    return productCodes;
  }

  public async postLoadProductCodes(body: any) {
    const token = await this.authFirebaseService.getIdToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiPath + '/v1/load-product-codes', body, { headers } )
        .subscribe((result) => resolve(result), (err) => reject(err));
    });
  }

  private generateProductData(product: Product): any {
    return {
      successMessage: product.successMessage ? product.successMessage : '',
      actionSelectProduct: product.actionSelectProduct ? product.actionSelectProduct : '',
      active: product.active ? product.active : false,
      category: product.category ? product.category : '',
      stockMessage: product.stockMessage ? product.stockMessage : '',
      stockActive: product.stockActive ? product.stockActive : false,
      errorMessages: product.errorMessages ? this.convertMap(product.errorMessages) : null,
      button: product.button ? this.convertMap2(product.button) : null,
      fullName: product.fullName ? product.fullName : '',
      codeType: product.codeType ? product.codeType : '',
      image: product.image ? product.image : '',
      isLatamActive: product.isLatamActive ? product.isLatamActive : false,
      isPalumboActive: product.isPalumboActive ? product.isPalumboActive : false,
      limit: product.limit ? product.limit : 0,
      points: product.points ? product.points : 0,
      promotionCode: null, // se llena con un script
      selectedSubtitle: product.selectedSubtitle ? product.selectedSubtitle : '',
      selectedTitle: product.selectedTitle ? product.selectedTitle : '',
      stock: product.stock ? product.stock : 0,
      successfulExchanges: 0,
      termsAndConditionsPDF: product.termsAndConditionsPDF ? product.termsAndConditionsPDF : '',
      termsAndConditionsText: product.termsAndConditionsText ? product.termsAndConditionsText : '',
      termsAndConditionsURL: product.termsAndConditionsURL ? product.termsAndConditionsURL : '',
      updatedAt: new Date(),
      value: product.value ? product.value : 0,
      giftcardColor: product.giftcardColor ? product.giftcardColor : '',
      hasMultiplier: product.hasMultiplier ? product.hasMultiplier : false,
      giftcardMultiplier: product.giftcardMultiplier ? product.hasMultiplier ? product.giftcardMultiplier : 0 : 0,
      confirmationSelectedTitle: product.confirmationSelectedTitle ? product.confirmationSelectedTitle : '',
      deltaForTechnicalDateInDays: product.deltaForTechnicalDateInDays ? product.deltaForTechnicalDateInDays : ''
    };
  }
}
