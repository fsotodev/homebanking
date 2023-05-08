import { Component, OnInit } from '@angular/core';
import { Dv, Product } from '@apps/models/customer-service';
import { FirebaseService } from '@apps/services/firebase.service';

@Component({
  selector: 'app-customer-service',
  templateUrl: './customer-service.component.html',
  styleUrls: ['./customer-service.component.scss']
})
export class CustomerServiceComponent implements OnInit {
  public isLoading: boolean;
  public isSaving: boolean;
  public dvArray: Dv[] = [];
  public productArray: Product[] = [];
  public productArrayNegative: Product[] = [];
  public dvArrayFromFirebase: any[] = [];
  public productArrayFromFirebase: any = [];
  public negativeProductFromFirebase: any = [];
  public PATH = 'claim-by-dv/product-dv';

  constructor(
    private firebaseService: FirebaseService,
  ) { }

  public async  ngOnInit() {
    this.createDvArray();
    this.productArray = await this.createProductArray();
    this.productArrayNegative = await this.createProductArray();
    await this.loadClaimByProductAndDV();
  }

  public async loadClaimByProductAndDV() {
    const doc = await this.firebaseService.getProductAndDvFirebase('product-dv');
    const value = doc.data();
    this.productArrayFromFirebase = Object.values(value['products']);
    this.dvArrayFromFirebase = Object.values(value['dv']);
    this.negativeProductFromFirebase = Object.values(value['negative-products']);
    const chargeToggles = (array: any[], arrayResult: any[]) => {
      for (const key of array) {
        for (const valueData of arrayResult) {
          if (key.includes(arrayResult[valueData].name)) {
            arrayResult[valueData].valueBoolean = true;
            break;
          }
        }
      }
    };
    chargeToggles(this.dvArrayFromFirebase, this.dvArray);
    chargeToggles(this.productArrayFromFirebase, this.productArray);
    chargeToggles(this.negativeProductFromFirebase, this.productArrayNegative);
  }

  public createDvArray() {
    const arrayDv: Dv[] = [];
    for (let i = 0; i < 11; i++) {
      let nameValue = i.toString();
      nameValue = i === 10 ? 'K' : nameValue;
      const aux: Dv  = {
        name : nameValue,
        valueBoolean : false,
      };
      arrayDv.push(aux);
    }
    this.dvArray = arrayDv;
  }

  public async createProductArray() {
    const doc = await this.firebaseService.getProductAndDvFirebase('products');
    const products = doc.data()['products'];
    const arrayProduct: Product[] = [];
    for (const product of products) {
      const auxProductObject: Product = {
        name: products[product],
        valueBoolean: false
      };
      arrayProduct.push(auxProductObject);
    }
    return arrayProduct;
  }

  public updateConfigDV(event: any, i: any) {
    const value = this.dvArray[i];
    let nameValue = i.toString();
    nameValue = i === 10 ? 'K' : nameValue;
    value['name'] = nameValue;
    value['valueBoolean'] = event.checked;
    const arrayFilteredDV = this.dvArray.filter((response) => response.valueBoolean === true).map((response) => response.name);
    this.firebaseService.updateProductAndDv(this.PATH, arrayFilteredDV, 'dv');
  }

  public updateConfig(event: any, i: any ) {
    const value = this.productArray[i];
    value['valueBoolean'] = event.checked;
    const arrayFilteredProducs = this.productArray.filter((response) => response.valueBoolean === true).map((response) => response.name);
    this.firebaseService.updateProductAndDv(this.PATH, arrayFilteredProducs, 'products');
  }

  public updateConfigNegative(event: any, i: any ) {
    const value = this.productArrayNegative[i];
    value['valueBoolean'] = event.checked;
    const arrayFilteredProducsNegative = this.productArrayNegative
      .filter((response) => response.valueBoolean === true)
      .map((response) => response.name);
    this.firebaseService.updateProductAndDv(this.PATH, arrayFilteredProducsNegative, 'negative-products');
  }

}
