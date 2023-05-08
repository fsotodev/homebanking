import { Injectable } from '@angular/core';
import { Benefit, BenefitType, BenefitCode, BenefitSegment, BenefitCategory } from '../models/benefit';
import { FirebaseService } from './firebase.service';
import { Utils } from '../pages/shared-components/utils/utils';
import { BenefitSubscription } from '../models/benefit';
import * as moment from 'moment';
import { firestore } from 'firebase';
import { BenefitTag } from '@apps/models/benefitTag';
import { saveAs } from 'file-saver';
import { NewBenefit } from '@apps/models/new-benefit';
import { BenefitBanner } from '@apps/models/benefitBanner';
import { setupMaster } from 'cluster';

@Injectable()
export class BenefitsService {

  benefitToModifyPeriod = new Benefit();
  benefitToCreate = new Benefit();
  isModifyingBenefitData = false;
  isCreatingAndBack = false;
  idBenefit: string;
  benefitData = {
    benefitInfo: {} = new NewBenefit(),
    benefitCodes: []
  };

  constructor(
    private firebaseService: FirebaseService,
    private utils: Utils
  ) { }

  setBenefitToCreateData(benefit: Benefit) {
    this.benefitToCreate = benefit;
  }

  setBenefitToModifyPeriodData(benefit: Benefit) {
    this.benefitToModifyPeriod = benefit;
  }

  getBenefitToCreateData() {
    return this.benefitToCreate;
  }

  getBenefitToModifyPeriodData() {
    return this.benefitToModifyPeriod;
  }

  setIsCreatingAndBackBoolean(isCreatingAndBack: boolean) {
    this.isCreatingAndBack = isCreatingAndBack;
  }

  getIsCreatingAndBackBoolean(): boolean {
    return this.isCreatingAndBack;
  }

  setIsModifyingBoolean(isModifiying: boolean) {
    this.isModifyingBenefitData = isModifiying;
  }

  getIsModifyingBoolean(): boolean {
    return this.isModifyingBenefitData;
  }

  async getBenefitsList(): Promise<Array<Array<Benefit>>> {
    const benefitsList: Array<Array<Benefit>> = [[], [], [], [], [], [], [], []];
    const querySnapshot = await this.firebaseService.getFirebaseCollection('benefits')
      .ref.orderBy('newBenefit').get();
    if (querySnapshot.docs.length > 0) {
      const docs = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Benefit));
      docs.sort((a, b) => a.newBenefit.orderPriority - b.newBenefit.orderPriority);
      docs.forEach(doc => {
        doc.newBenefit = this.normalizeDate(doc);
        switch (doc.newBenefit.type) {
        case 'restofan': benefitsList[2].push(doc); break;
        case 'monthly': benefitsList[0].push(doc); break;
        case 'personal': benefitsList[3].push(doc); break;
        case 'productOPEX': benefitsList[4].push(doc); break;
        case 'beautyfans': benefitsList[5].push(doc); break;
        case 'fitnessfans': benefitsList[6].push(doc); break;
        case 'regional': benefitsList[7].push(doc); break;
        default: benefitsList[1].push(doc); break;
        }
      });
    }
    return benefitsList;
  }

  async getAllBenefits(): Promise<Benefit[]>  {
    const querySnapshot = await this.firebaseService.getFirebaseCollection('benefits')
      .ref.where('newBenefit', '!=', false).get();
    return querySnapshot.docs.map(doc => ({ ...doc.data(),
      id: doc.id}) as Benefit)
      .sort((a: Benefit, b: Benefit) => a.newBenefit.orderPriority - b.newBenefit.orderPriority);
  }


  async getRawBenefits(): Promise<Benefit[]> {
    const querySnapshot = await this.firebaseService.getFirebaseCollection('benefits')
      .ref.orderBy('order', 'asc').get();
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Benefit);
  }

  async getRawNewBenefits(): Promise<NewBenefit[]> {
    const querySnapshot = await this.firebaseService.getFirebaseCollection('benefits')
      .ref.where('newBenefit', '!=', false).get();
    return querySnapshot.docs.map(doc => ({ ...doc.data().newBenefit,
      id: doc.id,
      codesStock: doc.data().codesStock,
      rutsStock: doc.data().rutsStock }) as NewBenefit);
  }

  async getBenefitsByStatus(status: 'Publicado' | 'No Publicado'): Promise<Benefit[]> {
    const querySnapshot = await this.firebaseService.getFirebaseCollection('benefits')
      .ref.where('newBenefit.status', '==', status)
      .orderBy('order', 'asc').get();
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Benefit);
  }

  async getBenefitById(id: string): Promise<Benefit> {
    const documentSnapshot = await this.firebaseService.getFirebaseCollection('benefits').doc(id).ref.get();
    return { id: documentSnapshot.id, ...documentSnapshot.data() } as Benefit;
  }

  async checkIfExists(id: string): Promise<boolean> {
    if (id === '') {
      return false;
    }
    const query = this.firebaseService.getFirebaseCollection('benefits').doc(id);
    return query.ref.get()
      .then((documentSnapshot: firestore.DocumentSnapshot) => documentSnapshot.exists)
      .catch(err => {
        console.log(`Error checking if a document exists: ${err}`);
        return false;
      });
  }

  parseDate(id: string, docData: any) {
    docData.id = id;
    if (docData.isRestofanRestaurant || docData.type === 'restofan') {
      docData.weekdaysText = this.makeWeekdaysOrMonthsString(docData.weekdays, false);
    } else if (docData.isMonthlyBenefit || docData.type === 'monthly') {
      docData.monthsText = this.makeWeekdaysOrMonthsString(docData.months, true);
    } else if (docData.type === 'personal') {
      docData.weekdaysText = this.makeWeekdaysOrMonthsString(docData.weekdays, false);
    } else if (docData.type === 'productOPEX') {
      docData.weekdaysText = this.makeWeekdaysOrMonthsString(docData.weekdays, false);
    } else if (docData.type === 'beautyfans') {
      docData.weekdaysText = this.makeWeekdaysOrMonthsString(docData.weekdays, false);
    } else if (docData.type === 'fitnessfans') {
      docData.weekdaysText = this.makeWeekdaysOrMonthsString(docData.weekdays, false);
    } else if (docData.type === 'regional') {
      docData.weekdaysText = this.makeWeekdaysOrMonthsString(docData.weekdays, false);
    } else {
      docData.weekdaysText = this.makeWeekdaysOrMonthsString(docData.weekdays, false);
    }
    return docData;
  }
  normalizeDate(doc: Benefit) {
    if (!doc.newBenefit.startDate) {
      return doc;
    }
    doc.newBenefit.startDate = doc.newBenefit.startDate.seconds ? doc.newBenefit.startDate.toDate() : new Date(doc.newBenefit.startDate);
    doc.newBenefit.endDate = doc.newBenefit.endDate.seconds ? doc.newBenefit.endDate.toDate() : new Date(doc.newBenefit.endDate);
    if (doc.newBenefit.startDate.toString() === 'Invalid Date') {
      doc.newBenefit.startDate = '';
    }
    if (doc.newBenefit.endDate.toString() === 'Invalid Date') {
      doc.newBenefit.endDate = '';
    }
    return doc;
  }

  deleteBenefit(idDoc: string): Promise<boolean> {
    return this.firebaseService.getFirebaseCollection('benefits').doc(idDoc)
      .delete().then(() => true).catch(() => false);
  }

  addNewBenefit(benefit: Benefit): Promise<any> {
    const benefitToAdd = this.generateBenefitData(benefit);
    return this.firebaseService.getFirebaseCollection('benefits')
      .add(benefitToAdd)
      .then((docRef) => docRef)
      .catch((error) => error);
  }

  updateBenefit(benefit: Benefit): Promise<any> {
    const benefitToUpdate = this.generateBenefitData(benefit);
    return this.firebaseService.getFirebaseCollection('benefits')
      .doc(benefit.id)
      .set(benefitToUpdate, { merge: true })
      .then(() => true)
      .catch((error) => error);
  }

  updateWelcomepackImage(benefit: { id: string; companyImageUrlWelcome: string }): Promise<any> {
    return this.firebaseService.getFirebaseCollection('benefits')
      .doc(benefit.id)
      .set(benefit, { merge: true })
      .then(() => true)
      .catch((error) => error);
  }

  async updateWelcomepackTag(benefit: { id: string; weekDaysTag: string }) {
    if (benefit.weekDaysTag === '') {
      return;
    }
    const originalBenefit = await this.getBenefitById(benefit.id);
    const itsAnArrayWithItems = originalBenefit.hasOwnProperty('weekdays') && originalBenefit.weekdays.length > 0;
    const originalWeekdays = itsAnArrayWithItems
      ? originalBenefit.weekdays
      : [];
    // @ts-ignore
    const weekdays = [benefit.weekDaysTag, ...originalWeekdays.slice(1)];
    const newBenefit = {
      ...originalBenefit,
      weekdays
    };
    return this.firebaseService.getFirebaseCollection('benefits')
      .doc(benefit.id)
      .set(newBenefit, { merge: true })
      .then(() => true)
      .catch((error) => error);
  }

  async getTypes(): Promise<Array<BenefitType>> {
    const querySnapshot = await this.firebaseService.getFirebaseCollection('benefitType')
      .ref.get();
    return this.generateTypesData(querySnapshot.docs).sort((a,b) => a.order - b.order);
  }

  async getCategories(): Promise<Array<BenefitCategory>> {
    const querySnapshot = await this.firebaseService.getFirebaseCollection('benefitCategories')
      .ref.get();
    return this.generateCategoriesData(querySnapshot.docs).sort((a,b) => a.order - b.order);
  }

  async getCodes(idBenefit: string): Promise<Array<BenefitCode>> {
    const codes = new Array<BenefitCode>();
    const querySnapshot = await this.firebaseService
      .getFirebaseCollection('benefitCodes').ref
      .where('benefitId', '==', idBenefit)
      .get();
    querySnapshot.docs.forEach(doc => {
      const { benefitId, code, period } = doc.data();
      codes.push({ benefitId, code, period, docRef: doc.ref });
    });
    return codes;
  }
  async getSegments(): Promise<Array<BenefitSegment>> {
    const segments = new Array<BenefitSegment>();
    const querySnapshot = await this.firebaseService
      .getFirebaseCollection('PWA-benefits-ripley-points-go').ref
      .get();
    querySnapshot.docs.forEach(doc => {
      segments.push({...doc.data(), id: doc.id});
    });
    return segments;
  }

  async updateCodesPeriod(benefitCodes: Array<BenefitCode>, period: string, newPeriod: string): Promise<void> {
    try {
      const data = benefitCodes
        .filter(b => b.period === period)
        .map(b => ({
          ref: b.docRef, data: { period: newPeriod }
        }));
      await this.firebaseService.setBatchTransaction(data);
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  public updateType(type: BenefitType): Promise<any> {
    const typeToUpdate = this.generateTypeData(type);
    return this.firebaseService.getFirebaseCollection('benefitType')
      .doc(type.id)
      .set(typeToUpdate, { merge: true })
      .then(() => true)
      .catch((error) => console.log(error));
  }

  public updateCategory(type: BenefitCategory): Promise<any> {
    console.log(type);
    const typeToUpdate = this.generateCategoryData(type);
    return this.firebaseService.getFirebaseCollection('benefitCategories')
      .doc(type.id)
      .set(typeToUpdate, { merge: true })
      .then(() => true)
      .catch((error) => console.log(error));
  }

  public async getBenefitSubscriptions() {
    const subscriptions = [];
    const querySnapshot = await this.firebaseService.getFirebaseCollection('benefitSubscriptions').ref.get();
    console.log('querysnapshoot', querySnapshot);
    querySnapshot.forEach((doc) => {
      if (!querySnapshot) {
        return;
      }
      const id = doc.id;
      const benefit = { id, ...doc.data() } as BenefitSubscription;
      benefit.subscribedAt = benefit.subscribedAt ? this.getParsedDate(benefit.subscribedAt.toDate()) : '';
      subscriptions.push(benefit);
    });
    return subscriptions;
  }
  public async getBenefitSubscriptionsById(benefitId: string) {
    const query = await this.firebaseService.getFirebaseCollection('benefitSubscriptions').ref
      .where('benefitId', '==', benefitId).get();
    return query.docs.map(doc => {
      const subData = doc.data();
      return {
        ...subData,
        id: doc.id,
        subscribedAt: subData.subscribedAt ? this.getParsedDate(subData.subscribedAt.toDate()) : ''
      } as BenefitSubscription;
    });
  }

  getParsedDate(date: any) {
    return !!date ? moment(date).format('DD-MM-YYYY') : 'Sin fecha registrada';
  }

  public setIdBenefitEdit(idBenefit: string): void {
    this.idBenefit = idBenefit;
  }

  public getIdBenefitEdit(): string {
    return this.idBenefit;
  }

  public orderTagList(list: BenefitTag[]): BenefitTag[] {
    return list.sort((a, b) => {
      if (a.order !== b.order) {
        return (a.order > b.order) ? 1 : -1;
      } else {
        return (a.tagName.toUpperCase() > b.tagName.toUpperCase()) ? 1 : -1;
      }
    });
  }
  public async createCSVAndDownload(data: any[], headers: string[], properties: string[], fileName: string) {
    const delimiter = ',';
    let fileContent = '';
    headers.forEach(h => fileContent += h + delimiter);
    fileContent += '\n';

    for (const row of data) {
      properties.forEach(prop => fileContent += (row[prop] || '') + delimiter);
      fileContent += '\n';
    }

    const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8' });
    saveAs.saveAs(blob, fileName + '.csv');
  }

  public setBenefitCodeRut = (data: NewBenefit, list: string[]) => {
    this.benefitData.benefitInfo = data;
    this.benefitData.benefitCodes = list;
  };
  public async addNewBenefitCategory(type: BenefitCategory): Promise<any> {
    try {
      const docRef = await this.firebaseService.getFirebaseCollection('benefitCategories').add(type);
      return { ok: true, doc: docRef };
    } catch (error) {
      return { ok: false, doc: error };
    }
  }
  public async getBenefitCategoryByRef(ref: string) {
    const query = await this.firebaseService.getFirebaseCollection('benefitCategories').ref
      .where('ref', '==', ref).get();
    return this.generateCategoriesData(query.docs);
  }

  public async getAllBenefitBanners(): Promise<BenefitBanner[]> {
    const query = await this.firebaseService.getFirebaseCollection('benefitBanners').ref.orderBy('order').get();

    return query.docs.map(doc => {
      const subData = doc.data();
      return {
        ...subData,
        id: doc.id,
      } as BenefitBanner;
    });
  }

  public async updateBannerBenefit(data: BenefitBanner) {
    return this.firebaseService.getFirebaseCollection('benefitBanners').doc(data.id).set(data, { merge : true});
  }

  private makeWeekdaysOrMonthsString(weeksOrMonths: [string], isMonthlyBenefit) {
    let weeksOrMonthsString = '';
    if (weeksOrMonths?.length > 0) {
      weeksOrMonths.forEach(weekOrMonth => {
        if (isMonthlyBenefit) {
          weeksOrMonthsString += this.utils.getShortMonthString(weekOrMonth) + ', ';
        } else {
          weeksOrMonthsString += this.utils.getShortWeekdayString(weekOrMonth) + ', ';
        }
      });
      weeksOrMonthsString = weeksOrMonthsString.slice(0, -2);
    }
    return weeksOrMonthsString;
  }

  private generateBenefitData(benefit: Benefit): any {
    return {
      ...benefit,
      codesFilePath: benefit.codesFilePath ? benefit.codesFilePath : [],
      searchKeyword: benefit.searchKeyword ? benefit.searchKeyword : '',
      weekdays: benefit.weekdays ? benefit.weekdays : [],
      rutsStock: benefit.rutsStock ? benefit.rutsStock : 0,
      rutsFilePath: benefit.rutsFilePath ? benefit.rutsFilePath : []
    };
  }

  private generateTypeData(doc: BenefitType): any {
    return {
      order: doc.order ? doc.order : 1000,
      ref: doc.ref ? doc.ref : '',
      sectionTitle: doc.sectionTitle ? doc.sectionTitle : ''
    };
  }
  private generateCategoryData(doc: BenefitCategory): any {
    return {
      order: doc.order ? doc.order : 1000,
      type: doc.type ? doc.type : '',
      sectionTitle: doc.sectionTitle ? doc.sectionTitle : '',
      icon: doc.icon ? doc.icon : '',
      active: doc.active ? doc.active : false,
    };
  }

  private generateTypesData(docs: Array<any> ): Array<BenefitType> {
    const types = new Array<BenefitType>();
    if (docs.length > 0) {
      docs.forEach(doc => {
        types.push({
          ref: doc.data().ref,
          order: doc.data().order,
          sectionTitle: doc.data().sectionTitle,
          id: doc.id
        } as BenefitType);
      });
    }
    return types;
  }

  private generateCategoriesData(docs: Array<any> ): Array<BenefitCategory> {
    const types = new Array<BenefitCategory>();
    if (docs.length > 0) {
      docs.forEach(doc => {
        types.push({
          type: doc.data().type,
          order: doc.data().order,
          sectionTitle: doc.data().sectionTitle,
          icon: !doc.data().icon?'':doc.data().icon,
          id: doc.id,
          active:doc.data().active === undefined ? true:doc.data().active
        } as BenefitCategory);
      });
    }
    return types;
  }
}
