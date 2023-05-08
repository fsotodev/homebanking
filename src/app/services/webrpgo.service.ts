import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { WebRPGoMenu } from '@apps/models/webrRPGoMenu';
import { BenefitCategory } from '@apps/models/benefit';
import { FirebaseService } from './firebase.service';

@Injectable()
export class WebRPGOService{
  constructor(private firebaseService: FirebaseService,
    private aFirestore: AngularFirestore) {
  }

  public async getAllMenu(): Promise<WebRPGoMenu[]> {
    const listWebRPGoMenu = [];
    const querySnapshot = await this.firebaseService.getFirebaseCollection('benefitCategories').ref
      .where('type','==','monthly').get();
    querySnapshot.forEach((doc) => {
      if (querySnapshot.empty) {
        return;
      }
      const id = doc.id;
      const menuType = doc.data().type;
      const orderMenuItem = doc.data().order;
      const urlMenuItem = doc.data().icon;
      const titleMenuItem = doc.data().sectionTitle;

      const webrpgoMenu = {id, menuType,  orderMenuItem, urlMenuItem, titleMenuItem};

      listWebRPGoMenu.push(webrpgoMenu);
    });
    return listWebRPGoMenu;
  }

  public updateMenu(type: WebRPGoMenu): Promise<any> {
    const typeToUpdate = this.generateWebRPGoMenuData(type);
    console.log(type);
    return this.firebaseService.getFirebaseCollection('benefitCategories')
      .doc(type.id)
      .set(typeToUpdate, { merge: true })
      .then(() => true)
      .catch((error) => console.log(error));
  }

  private generateWebRPGoMenuData(doc: WebRPGoMenu): BenefitCategory {
    return {
      order: doc.orderMenuItem ? Number(doc.orderMenuItem) : 1000,
      type: doc.menuType ? doc.menuType : '',
      sectionTitle: doc.titleMenuItem ? doc.titleMenuItem : '',
      icon: doc.urlMenuItem ? doc.urlMenuItem : '',
      active: true
    };
  }
}
