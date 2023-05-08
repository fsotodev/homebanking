import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Category } from '../models/category';

@Injectable()
export class CategoryService {

  constructor(
    private firebaseService: FirebaseService
  ) { }

  public async addNewCategory(category: any) {
    if (!category) {
      throw { error: 'Data is not present' };
    }
    const lastUpdateInfoRef = await this.firebaseService.addAdminLog('create-category', {
      categoryId: category.categoryId,
      active: category.active,
    });
    category.lastUpdateInfoRef = lastUpdateInfoRef;
    return this.firebaseService.getFirebaseCollection('productCategories').add({
      ...category,
      createdAt: new Date()
    });
  }

  public async copyCategory(category: Category) {
    const ref = await this.addNewCategory(category);
    category.id = ref.id;
    category.name = '[Copy] - ' + category.name;
    await this.updateCategory(ref.id, category);
    return category;
  }

  public async getAllCategories() {
    const categories = [];
    const querySnapshot = await this.firebaseService.getFirebaseCollection('productCategories').ref.get();
    querySnapshot.forEach((doc) => {
      if (querySnapshot.empty) {
        return;
      }
      const id = doc.id;
      const category = { id, ...doc.data()} as Category;
      categories.push(category);
    });
    return categories;
  }

  public async updateCategory(id: string, data: Category) {
    try {
      const lastUpdateInfoRef = await this.firebaseService.addAdminLog('update-category', {
        categoryId: data.categoryId,
        active: data.active,
      });

      return await this.firebaseService.getFirebaseCollection('productCategories')
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

  public async getCategory(id: string) {
    const categoryQuery = await this.firebaseService.getFirebaseCollection('productCategories').doc(id).ref.get();
    return categoryQuery.data() as Category;
  }
}
