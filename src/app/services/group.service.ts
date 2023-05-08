import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FeaturedRedeem } from '@apps/models/featuredRedeem';
import { Group } from '@apps/models/group';
import { FirebaseService } from './firebase.service';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(
    private firebaseService: FirebaseService,
    private aFirestore: AngularFirestore
  ) { }

  public async getAllCGroups() {
    const groups = [];
    const querySnapshot = await this.firebaseService.getFirebaseCollection('productGroup').ref.orderBy('order').get();
    querySnapshot.forEach((doc) => {
      if (querySnapshot.empty) {
        return;
      }
      const id = doc.id;
      const group = { id, ...doc.data() } as Group;
      groups.push(group);
    });
    return groups;
  }

  public async getAllFeaturedRedeems(): Promise<FeaturedRedeem[]> {
    const redeems = [];
    const docs = (await this.firebaseService.getFirebaseCollection('productGroupFeaturedRedeem').ref.orderBy('order').get()).docs;
    if (!docs) {
      return;
    }

    for(const doc of docs){
      const id = doc.id;
      const featuredProducts = await this.getFeaturedProducts(doc.get('products'));
      const group = { id, productsList: featuredProducts, ...doc.data() } as FeaturedRedeem;
      redeems.push(group);
    }

    return redeems;
  }

  public async getFeaturedProducts(products: string[]): Promise<any[]> {
    const featuredProducts = [];
    const documentId = firebase.firestore.FieldPath.documentId();
    const productList = (await this.firebaseService.getFirebaseCollection('products').ref
      .where(documentId, 'in', products).get()).docs;
    for(const product of productList) {
      const id = product.id;
      const publishedCategory = await this.getCategoryStatus(product.data().category);
      featuredProducts.push({ id, publishedCategory, ...product.data() });
    }
    return featuredProducts;

  }

  public async getProduct(id: string){
    let publishedCategory;
    const product = (await this.firebaseService.getFirebaseCollection('products').doc(id).ref.get()).data();
    if(product) {
      publishedCategory = await this.getCategoryStatus(product['category']);
    }
    return { publishedCategory,  ...product };

  }

  public async updateFeaturedRedeems(id: string, data: FeaturedRedeem) {
    const { productsList, ...subset } = data;
    return this.aFirestore.doc('productGroupFeaturedRedeem/' + id).set(subset, { merge : true});
  }

  public async updateProducts(id: string, productList: string[]) {
    return this.aFirestore.doc('productGroupFeaturedRedeem/' + id).update({ products: productList });
  }

  private async getCategoryStatus(categorytId: string) {
    const categories = await this.firebaseService.getCategoryByCategoryId(categorytId);
    if(categories.length === 0){
      return undefined;
    }
    return categories.some((category) => category.data().active);
  }
}
