import { AuthFirebaseService } from '@apps/shared/services/auth/auth-firebase.service';
import { parse } from 'papaparse';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { firestore } from 'firebase/app';
import { AdminLogAction } from '@apps/models/types/types';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
@Injectable()
export class FirebaseService {

  maxRowsToUpload = 500;
  percProductsCommited = 0;

  constructor(
    private aFirestore: AngularFirestore,
    private afStorage: AngularFireStorage,
    private datePipe: DatePipe,
    private http: HttpClient,
    private authService: AuthFirebaseService,
  ) {
  }

  setDocument(data, id: string, collection: string) {
    return this.aFirestore.doc(collection + '/' + id).set(data);
  }

  removeDocumentById(id: string, collection: string) {
    return this.aFirestore.collection(collection).doc(id).delete();
  }

  initializeDocumentById(data, id: string, collection: string) {
    return this.aFirestore.doc(collection + '/' + id).set(data);
  }

  getFirebaseCollection(collection: string): AngularFirestoreCollection<any> {
    return this.aFirestore.collection(collection);
  }

  async getBalance(giftCardFolio: number): Promise<number> {
    const url = environment.apiPath + '/giftcard/balance/' + giftCardFolio + '/' + '3';
    const token = await this.authService.getIdToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    });
    let giftCardBalance = -1;
    try {
      const response = await this.http
        .get(url, { headers })
        .toPromise() as any;
      giftCardBalance = response.balance.montoDisponible;
    } catch (error) {
      console.log('gift-card-balance', error);
      giftCardBalance = -1;
    }
    return giftCardBalance;
  }

  setBatchTransaction(data: any): Promise<void> {
    let counter = 0;
    let batch = this.aFirestore.firestore.batch();
    for (const item of data) {
      batch.update(item.ref, item.data);
      counter++;
      if (counter % this.maxRowsToUpload === 0) {
        batch.commit();
        batch = this.aFirestore.firestore.batch();
      }
    }
    return batch.commit();
  }

  public async deleteFromFirestore(url: string) {
    return this.afStorage.storage.refFromURL(url).delete();
  }

  uploadFileToFireStorage(file: File, folder: string, status: string = ''): Promise<string> {
    // The storage path
    let path: string;
    if (status === 'immediate') {
      path = `${folder}/immediate_${this.datePipe.transform(new Date(), 'dd-MM-yyyy') + '_' +
        this.datePipe.transform(new Date(), 'HH:mm:ss')}_${file.name}`;
    } else {
      path = `${folder}/${this.datePipe.transform(new Date(), 'dd-MM-yyyy') + '_' +
        this.datePipe.transform(new Date(), 'HH:mm:ss')}_${file.name}`;
    }
    // The main task
    return new Promise((resolve, reject) => {
      this.afStorage.upload(path, file)
        .then(() => {
          this.afStorage.ref(path).getDownloadURL()
            .subscribe(url => {
              resolve(url);
            });
        })
        .catch(() => {
          reject('Error subiendo archivo.');
        });
    });
  }

  async updloadUsersBatch(collection: string, data: any[], commit: Function) {
    let counter = 0;
    let batch = this.aFirestore.firestore.batch();

    try {
      for (const row of data) {
        const docRef = this.aFirestore.collection(collection).doc(row[0]).ref;
        batch.set(docRef, {
          enabled: true,
          rut: row[0]
        }, { merge: true });
        counter++;
        if (counter % this.maxRowsToUpload === 0) {
          commit(counter / data.length * 100);
          await batch.commit();
          batch = this.aFirestore.firestore.batch();
        }
      }

      await batch.commit();
      commit(100);
    } catch (error) {
      throw error;
    }
  }

  async updloadWhiteListBatch(collection: string, data: any[], commit: Function) {
    let counter = 0;
    let batch = this.aFirestore.firestore.batch();

    try {
      for (const row of data) {
        const docRef = this.aFirestore.collection(collection).doc(row[0]).ref;
        batch.set(docRef, {
          rut: row[0]
        }, { merge: true });
        counter++;
        if (counter % this.maxRowsToUpload === 0) {
          commit(100 * (counter / data.length));
          await batch.commit();
          batch = this.aFirestore.firestore.batch();
        }
      }

      await batch.commit();
      commit(100);
    } catch (error) {
      throw error;
    }
  }

  async updloadUserConfigBatch(collection: string, data: any[], commit: Function) {
    let counter = 0;
    let batch = this.aFirestore.firestore.batch();

    try {
      for (const row of data) {
        const docRef = this.aFirestore.collection(collection).doc(row[0]).ref;
        batch.set(docRef, {
          cardReissue: true
        }, { merge: true });
        counter++;
        if (counter % this.maxRowsToUpload === 0) {
          commit(counter / data.length * 100);
          await batch.commit();
          batch = this.aFirestore.firestore.batch();
        }
      }

      await batch.commit();
      commit(100);
    } catch (error) {
      console.log('ERROR D:', error);
      throw error;
    }
  }

  async updloadInsuranceRuts(collection: string, data: any[], fields: any, commit: Function) {
    let counter = 0;
    let batch = this.aFirestore.firestore.batch();

    try {
      for (const row of data) {
        const docRef = this.aFirestore.collection(collection).doc(row[0]).ref;
        batch.set(docRef, {
          rut: row[0],
          ...fields
        }, { merge: true });
        counter++;
        if (counter % this.maxRowsToUpload === 0) {
          commit(counter / data.length * 100);
          await batch.commit();
          batch = this.aFirestore.firestore.batch();
        }
      }

      await batch.commit();
      commit(100);
    } catch (error) {
      console.log('ERROR D:', error);
      throw error;
    }
  }
  async uploadCodesBatch(collection: string, data: any[], filename: string, uploadInfo, userInfo = null, commit: Function) {
    let counter = 0;
    let batch = this.aFirestore.firestore.batch();

    const uploadedCodeInfo = await this.addAdminLog('load-codes', {
      filename,
      ...uploadInfo,
      status: 'uploading'
    });

    try {
      for (const row of data) {
        const docRef = this.aFirestore.collection(collection).doc(row[0]).ref;
        batch.set(docRef, {
          code: row[0],
          password: row[1] ? row[1] : '',
          productFolio: row[2] ? row[2] : '',
          productUploadedAt: new Date(),
          sku: uploadInfo.sku,
          technicalExpirationDate: uploadInfo.technicalExpirationDate,
          uploadedCodeInfoRef: uploadedCodeInfo,
        }, { merge: true });
        counter++;
        if (counter % this.maxRowsToUpload === 0) {
          commit(counter / data.length * 100);
          await batch.commit();
          batch = this.aFirestore.firestore.batch();
        }
      }

      await batch.commit();
      commit(100);
    } catch (error) {
      await uploadedCodeInfo.update({ status: 'error', error });
      throw error;
    }

    await uploadedCodeInfo.update({ status: 'completed', codes: counter });
  }

  public async updateProductStock(productSku: string): Promise<any> {
    const codesRef = this.aFirestore.collection('products/' + productSku + '/codes').ref;
    const codes = (await codesRef.get()).docs;
    const stock = { stock: codes.length };
    return this.getFirebaseCollection('products/')
      .doc(productSku)
      .set(stock, { merge: true });
  }

   uploadBenefitsBatch = async (collection: string, data: any[], commit: Function, fileName: string) => {
     let docReference: string;
     let counter = 0;
     const isRutCollection = collection === 'benefitRuts';
     let batch = this.aFirestore.firestore.batch();

     try {
       for (const row of data) {
         docReference = isRutCollection ? row.benefitId + row.userId : row.benefitId + row.code;
         const docRef = this.aFirestore.collection(collection).doc(docReference).ref;
         batch.set(docRef, row);
         counter++;
         if (counter % this.maxRowsToUpload === 0) {
           commit(counter / data.length * 100);
           await batch.commit();
           batch = this.aFirestore.firestore.batch();
         }
       }
       await batch.commit();
       this.updateBenefitsInformation(data[0].benefitId, counter, isRutCollection, this.generatePath(fileName));
       commit(100);
     } catch (error) {
       throw error;
     }
   };

   unassignBenefitsBatch = async (collection: string, data: any[], commit: Function, fileName: string) => {
    let counter = 0;
    let batch = this.aFirestore.firestore.batch();
    try {
      const benefitId = data[0].benefitId;
      const listOfUsers = data.map(d => d.userId);
      const benefitRutSnap = await this.aFirestore.collection('benefitRuts').ref
        .where('benefitId', '==', benefitId).get();
      const benefitRut = benefitRutSnap.docs.map(doc =>  ({ ...doc.data(),
        unassignedAt: firestore.FieldValue.serverTimestamp() }));
      const assignedUsers = benefitRut.filter(user => listOfUsers.includes(user.userId))
      for (const row of assignedUsers) {
        const docReference = row.benefitId + row.userId;
        const docRefBenefitRuts = this.aFirestore.collection('benefitRuts').doc(docReference).ref;
        const docRefBenefitRutsUnassigned = this.aFirestore.collection('benefitRutsUnassigned').doc(docReference).ref;
        batch.set(docRefBenefitRutsUnassigned, row);
        batch.delete(docRefBenefitRuts);
        counter++;
        if (counter % this.maxRowsToUpload === 0) {
          commit(counter / data.length * 100);
          await batch.commit();
          batch = this.aFirestore.firestore.batch();
        }
      }
      await batch.commit();
      this.updateBenefitsInformation(data[0].benefitId, counter, true, this.generatePath(fileName), true);
      commit(100);
    } catch (error) {
      throw error;
    }
  };

  async uploadCampaignBatch(collectionName: string, campaign: string, data_: any[], commit: Function, fileName: string) {
    let counter = 0;
    const collectionCampaignUsers = collectionName + 'CampaignUsers';
    let batch = this.aFirestore.firestore.batch();

    try {
      for (const rut of data_) {
        // console.log(rut);

        const docRef = this.aFirestore.collection(collectionCampaignUsers).doc(rut[0]).ref;
        const firebase_campaigns = await this.aFirestore.collection(collectionCampaignUsers).doc(rut[0]).ref.get();

        if (firebase_campaigns.exists) {
          const data = firebase_campaigns.data();
          if (!data || data === {}) {
            batch.set(docRef, {
              rut,
              campaigns: [campaign],
              counters: {
                [campaign]: {
                  views: 0,
                  goals: 0,
                  fromRutero: fileName,
                }
              },
              cards: {
                SA: false,
                TR: false,
                TRM: false,
                useCards: false,
              },

            }, { merge: true });
            counter++;
            continue;
          }

          let campaigns = [];
          let counters = {};

          if (!('campaign' in Object.keys(data))) {
            campaigns = data.campaigns;
            campaigns.push(campaign);
          } else {
            campaigns = [campaign];
          }

          if (!('counters' in Object.keys(data))) {
            counters = {
              [campaign]: {
                views: 0,
                goals: 0,
                fromRutero: fileName,
              }
            };
          } else {
            counters = data.counters;
            counters[campaign] = {
              views: 0,
              goals: 0,
              fromRutero: fileName,
            };
          }

          batch.set(docRef, {
            rut,
            campaigns,
            counters,
            cards: {
              SA: false,
              TR: false,
              TRM: false,
              useCards: false,
            },
          }, { merge: true });
          counter++;

          if (counter % this.maxRowsToUpload === 0) {
            commit(counter / data_.length * 100);
            await batch.commit();
            batch = this.aFirestore.firestore.batch();
          }

        } else {
          batch.set(docRef, {
            rut,
            campaigns: [campaign],
            counters: {
              [campaign]: {
                views: 0,
                goals: 0,
                fromRutero: fileName,
              }
            },
            cards: {
              SA: false,
              TR: false,
              TRM: false,
              useCards: false,
            },

          }, { merge: true });
          counter++;

          if (counter % this.maxRowsToUpload === 0) {
            commit(counter / data_.length * 100);
            await batch.commit();
            batch = this.aFirestore.firestore.batch();
          }
        }

      }
      await batch.commit();
    } catch (error) {
      console.log('ERROR D:', error);
      throw error;
    }
  }


  async uploadCampaignBatchNewStructure(collectionName: string, campaign: string, campaignType, data: any[]) {
    const collectionCampaignUserViewsGoals = collectionName + 'CampaignUserViewsGoals';
    try {
      const docRef = this.aFirestore.collection(collectionCampaignUserViewsGoals).doc(campaign).collection('stats');
      let totalUsers = 0;
      for (const rut of data) {
        docRef.doc(rut[0]).set({
          views: 0,
          goals: 0,
          rut: rut[0]
        });
        totalUsers++;
      }
      this.aFirestore.collection(collectionCampaignUserViewsGoals).doc(campaign).set({
        id: campaignType + '-' + campaign,
        banner: campaignType,
        name: campaign,
        total_users: totalUsers,
        count_users_with_views: 0,
        count_users_with_goals: 0,
        total_goals: 0,
        total_views: 0,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateBenefitsInformation(id: string, counter: number, isRutCollection: boolean, path: string, unassign?: boolean) {
    const docRef = this.aFirestore.collection('benefits').doc(id).ref;
    const benefitData = await docRef.get();
    const [stock, pathFile] = isRutCollection ?
      (unassign ? ['rutsStock', 'rutsUnassignFilePath'] :
        ['rutsStock', 'rutsFilePath']) : ['codesStock', 'codesFilePath'];
    const originalStock = benefitData.data()[stock] > 0 ? benefitData.data()[stock] : 0;
    const originalFilePath = benefitData.data()[pathFile] || [];
    docRef.update({
      [stock]: originalStock + (unassign ? -counter : counter),
      [pathFile]: [...originalFilePath.slice(-19), path]
    });
  }

  generatePath(fileName: string): string {
    return `${this.datePipe.transform(new Date(), 'dd-MM-yyyy') + '_' +
      this.datePipe.transform(new Date(), 'HH:mm:ss')}_${fileName}`;
  }

  async validCodes(data: any[], user: any, productSku: string) {
    const indexes = [];
    const aux = data.length < 9 ? data.length - 1 : 9;
    for (let i = 0; i < aux; i++) {
      let ind = null;
      do {
        const randomIndex = Math.floor(Math.random() * (data.length - 0)) + 0;
        if (!indexes.includes(randomIndex)) {
          ind = randomIndex;
        }
      } while (ind === null);
      const code = data[ind][0];
      const transactionSnap = await this.aFirestore.collection('productTransactions').ref.where('code', '==', code).limit(1).get();
      if (!transactionSnap.empty) {
        console.error('code already in transactions', transactionSnap.docs[0].data());
        this.sendMail('duplicated-codes-file', 'adminAlerts', user); //await
        return false;
      }

      const codeSnap = await this.aFirestore.collection('products/' + productSku + '/codes').ref.where('code', '==', code).limit(1).get();
      if (!codeSnap.empty) {
        console.error('code already exist', codeSnap.docs[0].data());
        this.sendMail('duplicated-codes-file', 'adminAlerts', user); //await
        return false;
      }
      indexes.push(ind);
    }
    return true;
  }

  async sendMail(type: string, recipientGroup: string, user: any) {
    return await this.aFirestore.collection('mailQueue').add({
      executedBy: user,
      status: 'pending',
      type,
      recipient: recipientGroup
    });
  }

  uploadCSVFile(event: FileList, formatFunction: any, parameters: any) {
    if (event && event.length > 0) {
      return new Promise((resolve, reject) => {
        parse(event.item(0), {
          complete: async (result) => {
            const data = [];
            try {
              for (const row of result.data) {
                // @ts-ignore
                if (row.length > 0 && row[0] !== '') {
                  data.push(formatFunction(row, parameters));
                }
              }
              await this.setBatchTransaction(data);
              resolve( () => {} );
            } catch (error) {
              reject(error);
            }
          },
        });
      });
    }
  }

  update$(path: string, data: any): Promise<any> {
    const segments = path.split('/').filter(v => v);
    if (segments.length % 2) {
      return this.aFirestore.collection(path).add(data);
    } else {
      return this.aFirestore.doc(path).set(data, { merge: true });
    }
  }

  async getTransactionsByUserIdApi(userId: string): Promise<any> {
    const token = await this.authService.getIdToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    });
    try {
      const url = environment.apiPath + '/v1/codes/' + userId + '/products/transactions';
      const response = await this.http
        .get(url, { headers })
        .toPromise() as any;
      return response;
    } catch (error) {
      console.log('getTransactionsByUserIdApi', error);
    }
  }

  async getCodes(sku: string, valid = true, product = null): Promise<QueryDocumentSnapshot<any>[]> {
    const collection = valid ? '/valid' : '/invalid';
    const productData: any = product ? product : (await this.aFirestore.doc('products/' + sku).ref.get()).data();
    const codes = await (this.getCodesSubCollection(collection, sku));
    return codes.map((doc) => ({ ...doc, fullName: productData.fullName, category: productData.category } as any));
  }

  async getCodesSubCollection(collection: string, sku?: string): Promise<any> {
    const token = await this.authService.getIdToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    });
    sku = !!sku ? sku + '/' : '';
    const url = environment.apiPath + '/v1/products/' + sku + 'codes' + collection;
    const response = await this.http
      .get(url, { headers })
      .toPromise() as any;
    return response;
  }

  async getAllCodes(valid = true): Promise<any> {
    const collection = valid ? '/valid' : '/invalid';
    return this.getCodesSubCollection(collection);
  }

  async getBenefit(benefitId: string) {
    const docRef = this.aFirestore.collection('benefits').doc(benefitId).ref;
    const benefitData = (await docRef.get()).data();
    return benefitData;
  }

  async getBenefitCodes(benefitId: string): Promise<QueryDocumentSnapshot<any>[]> {
    return (await this.getFirebaseCollection('benefitCodes').ref
      .where('benefitId', '==', benefitId).get()).docs;
  }

  async getBenefitTransactions(benefitId: string): Promise<QueryDocumentSnapshot<any>[]> {
    return (await this.getFirebaseCollection('benefitTransaction').ref
      .where('benefitId', '==', benefitId).get()).docs;
  }

  async getLogsByAction(action: string): Promise<QueryDocumentSnapshot<any>[]> {
    const logs = (await this.getFirebaseCollection('adminLogs').ref
      .where('action', '==', action).get()).docs;
    return logs.map((doc) => ({ id: doc.id, ...doc.data() } as any));
  }

  async getAllLogs(): Promise<QueryDocumentSnapshot<any>[]> {
    const logs = (await this.getFirebaseCollection('adminLogs').ref.get()).docs;
    return logs.map((doc) => ({ id: doc.id, ...doc.data() } as any));
  }

  async createEpuReport(day: string, digits: string[], user: string, appEnabled: boolean, pwaEnabled: boolean) {
    await this.getFirebaseCollection('autoNotifications/reports/cards').add({
      day,
      digits,
      createdAt: new Date(),
      createdBy: user,
      appEnabled,
      pwaEnabled
    }).then(ref => {
      console.log('Added document with ID: ', ref.id);
    });
  }

  public async getCollectionWithDocId(collection: string) {
    const querySnapshot = await this.getFirebaseCollection(collection).ref.get();
    if (querySnapshot.empty) {
      return [];
    }
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as any));
  }

  public getNewBatch() {
    return this.aFirestore.firestore.batch();
  }

  public updateUserDatacard(user: any): Promise<any> {
    return this.getFirebaseCollection('datacardUsers')
      .doc(user.rut)
      .set(user, { merge: true });
  }

  public async updateLoginDigits(digits: Array<string>, field: string) {
    return this.getFirebaseCollection('config').doc('login')
      .update({ [`throttling.${field}`]: digits });
  }

  public async updateLoginConfig(config: any) {
    return await this.getFirebaseCollection('config')
      .doc('login')
      .set({
        ...config,
        updatedAt: new Date()
      }, { merge: true })
      .then(() => true)
      .catch((error) => error);
  }

  public deleteUserDatacard(idDoc: string): Promise<any> {
    return this.getFirebaseCollection('datacardUsers').doc(idDoc)
      .delete();
  }

  public async deleteWhiteList(collection: string) {
    const querySnapshot = await this.getFirebaseCollection(collection).ref.get();
    querySnapshot.forEach((doc) => {
      if (doc.exists) {
        this.getFirebaseCollection(collection).doc(doc.data().rut).delete();
      }
    });
  }

  public arrayUnion(value) {
    return firestore.FieldValue.arrayUnion(value);
  }

  async searchRutInCollection(rut: string, firebaseCollection: string): Promise<any> {
    let result = false;
    const querySnapshot = await this.getFirebaseCollection(firebaseCollection).ref
      .where('rut', '==', rut).get();

    querySnapshot.forEach((doc) => {
      if (doc.exists) {
        result = true;
      }
    });

    return result;
  }

  public convertTimestampToDate(date: { _seconds; _nanoseconds }) {
    return new firestore.Timestamp(date._seconds, date._nanoseconds).toDate();
  }

  public async getData(collection: string) {
    return this.getFirebaseCollection('appData').doc(collection).ref.get();
  }

  public async getConfig(collection: string) {
    return this.getFirebaseCollection('config').doc(collection).ref.get();
  }

  public async updateConfig(doc: string, newData: any) {
    this.getFirebaseCollection('config').doc(doc).ref.update(newData);
  }

  public async getProductAndDvFirebase(docName: string): Promise<any> {
    return this.getFirebaseCollection('claim-by-dv').doc(docName).ref.get();
  }

  public updateProductAndDv(path: string, arrayIn: string[], nameObject: string) {
    const docData = {
      [nameObject]: arrayIn
    };
    this.aFirestore.doc(path).set(docData, { merge: true });
  }

  public getBenefitTagRelationship(idBenefit: string): Promise<firestore.QuerySnapshot> {
    return this.getFirebaseCollection('benefitTagRelationship').ref.where('idBenefit', '==', idBenefit).limit(1).get();
  }

  public async getBenefitTagEnable() {
    const querySnapshot = await this.getFirebaseCollection('benefitTag').ref.where('enable', '==', true).get();
    if (querySnapshot.empty) {
      return [];
    }
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as any));
  }

  public async addAdminLog(action: AdminLogAction, extraData: any) {
    const data = {
      action,
      executedBy: await this.authService.userInfo(),
      ...extraData,
      timestamp: new Date(),
    };
    return this.getFirebaseCollection('adminLogs').add(data);
  }

  public async getBanners() {
    const querySnapshot = await this.getFirebaseCollection('PWA-banners').ref.get();
    if (querySnapshot.empty) {
      return [];
    }
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as any));
  }

  public async updateBanner(doc: string, newData: any) {
    this.getFirebaseCollection('PWA-banners').doc(doc).ref.update(newData);
  }

  public async requestProductCodesReport(request: any) {
    return this.getFirebaseCollection('productCodesReport')
      .add(request);
  }

  public async getProductCodesReport(uid: string) {
    const querySnapshot = await this.getFirebaseCollection('productCodesReport').ref
      .where('uid', '==', uid).orderBy('startDate', 'desc')
      .get();
    if (querySnapshot.empty) {
      return [];
    }
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as any));
  }

  public getFilestoreFile(report: any) {
    const pathReference = this.afStorage.ref('productCodesReports/' + report.filename);
    console.log('getFilestoreFile');
    console.log(pathReference);
    return pathReference;

  }

  public async getCategoryByCategoryId(id: string): Promise<any[]> {
    const categoryQuery = await this.getFirebaseCollection('productCategories').ref
      .where('categoryId','==',id)
      .limit(1)
      .get();
    if (categoryQuery.empty) {
      return [];
    }
    return categoryQuery.docs;
  }

  async getProductTransactionsByCategoryIdApi(categoryId: string, from: string, to: string): Promise<any> {
    const token = await this.authService.getIdToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    });
    try {
      const url = `${environment.apiPath}/v1/products/transactions/${categoryId}?from=${from}&to=${to}`;
      const response = await this.http
        .get(url, { headers });
      return await lastValueFrom(response);
    } catch (error) {
      console.log('getProductTransactionsByCategoryIdApi', error);
    }
  }

  public getTimestamp() {
    return firestore.Timestamp.now().toMillis();
  }

  public async getProductTransactionsByUser(userId: string) {
    const querySnapshot = await this.getFirebaseCollection('productTransactions').ref
      .where('userId', '==', userId)
      .where('status', '==', 'completed')
      .orderBy('createdAt', 'desc')
      .get();
    if (querySnapshot.empty) {
      return [];
    }
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data()}));
  }

  public async getProductTransactionsByDate(userId: string, createdAt: any) {
    console.log('getProductTransactions', userId, createdAt);
    const querySnapshot = await this.getFirebaseCollection('productTransactions').ref
      .where('userId', '==', userId)
      .where('createdAt', '==', createdAt)
      .get();
    if (querySnapshot.empty) {
      return [];
    }
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data()}));
  }

  public async addDeletedProductTransaction(productTransactions: any, userId: any) {
    return this.aFirestore.collection('deletedProductTransactions').add({
      executedBy: userId,
      deletedAt: new Date(),
      transaction: productTransactions
    });
  }

  public async deleteProductTransaction(id: string) {
    return this.aFirestore.collection('productTransactions').doc(id).delete();
  }

  public getTimestampFromDate(date: Date) {
    return firestore.Timestamp.fromDate(date);
  }
}
