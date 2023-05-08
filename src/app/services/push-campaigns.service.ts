import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { CampaignPush } from '../models/campaign';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { DocumentData } from '@firebase/firestore-types';

@Injectable()
export class PushCampaignsService {

  constructor(
    private firebaseService: FirebaseService,
    private http: HttpClient,
  ) { }

  /* istanbul ignore next */
  getCurrentTimestamp() {
    return new Date();
  }

  public async getCampaignById(campaignId: string) {
    const querySnapshot = await this.firebaseService.getFirebaseCollection('pushTasks').doc(campaignId).ref.get();
    const data = querySnapshot.data();
    if (!data) {
      return;
    }
    const campaign = { id: querySnapshot.id, ...data } as CampaignPush;
    if (campaign.performAt) {
      campaign.performAt = this.getDate(campaign.performAt);
    }
    campaign.createdAt = campaign.createdAt ? this.getDate(campaign.createdAt) : '';
    return campaign;
  }

  public async getCampaignByName(name: string) {
    const querySnapshot = await this.firebaseService.getFirebaseCollection('pushTasks').ref.where('name', '==', name).get();
    if (querySnapshot.docs.length) {
      return this.getCampaignById(querySnapshot.docs[0].id);
    }
    return;
  }

  async getPushCampaigns(limit?: number): Promise<Array<CampaignPush>> {
    const pushCampaigns = [];
    let querySnapshot;
    if (limit) {
      querySnapshot = await this.firebaseService.getFirebaseCollection('pushTasks').ref
        .orderBy('createdAt', 'desc').limit(limit).get();
    } else {
      querySnapshot = await this.firebaseService.getFirebaseCollection('pushTasks').ref
        .orderBy('createdAt', 'desc').get();
    }
    querySnapshot.forEach((camp) => {
      if (querySnapshot.empty) {
        return;
      }
      const id = camp.id;
      const campaign = {id, ...camp.data()} as CampaignPush;
      if (campaign.performAt) {
        campaign.performAt = this.getDate(campaign.performAt);
      }
      campaign.createdAt = campaign.createdAt ? this.getDate(campaign.createdAt) : '';
      if (this.isCampaignAllowed(campaign)) {
        pushCampaigns.push(campaign);
      }
    });
    return pushCampaigns;
  }

  async getPushCampaign(docId: string): Promise<CampaignPush> {
    const querySnapshot = await this.firebaseService.getFirebaseCollection('pushTasks').doc(docId).ref.get();
    const campaign = { id: docId, ...querySnapshot.data() } as CampaignPush;
    if (campaign.performAt) {
      campaign.performAt = this.getDate(campaign.performAt);
    }
    campaign.expirationDate = campaign.expirationDate ? this.getDate(campaign.expirationDate) : '';
    campaign.createdAt = campaign.createdAt ? this.getDate(campaign.createdAt) : '';
    return campaign;
  }

  async deleteCampaign(docId: string): Promise<any> {
    const querySnapshot = await this.firebaseService.getFirebaseCollection('pushTasks').doc(docId).ref;
    const result = querySnapshot.set({ status: 'deleted' }, { merge: true })
      .then((res) => res).catch((e) => e);
    return result;
  }

  async cancelSendCampaign(docId: string): Promise<any> {
    const querySnapshot = await this.firebaseService.getFirebaseCollection('pushTasks').doc(docId).ref;
    const result = querySnapshot.set({ status: 'draft' }, { merge: true })
      .then((res) => res).catch((e) => e);
    return result;
  }

  async createCampaign(campaign: CampaignPush): Promise<any> {
    const data = {
      name: campaign.name,
      options: {
        pushTitle: campaign.options.pushTitle,
        pushDescription: campaign.options.pushDescription,
        pushImg: campaign.options.pushImg ? campaign.options.pushImg : '',
        url: campaign.options.url ? campaign.options.url : '',
      },
      hasToPerformTest: campaign.hasToPerformTest,
      expirationDate: campaign.expirationDate,
      performAt: campaign.performAt,
      status: campaign.status,
      createdAt: this.getCurrentTimestamp(),
      createdBy: campaign.createdBy,
      lastModifiedAt: this.getCurrentTimestamp(),
      lastModifiedBy: campaign.lastModifiedBy,
      failureCount: 0,
      failureCountTest: 0,
      params: {},
      redirectPath: campaign.redirectPath ? campaign.redirectPath : '',
      redirectType: campaign.redirectType ? campaign.redirectType : '',
      redirectWebPush: campaign.redirectWebPush ? campaign.redirectWebPush : '',
      imgWebPush: campaign.imgWebPush ? campaign.imgWebPush : '',
      successCount: 0,
      successCountTest: 0,
      uploadedRuts: campaign.uploadedRuts,
      sendMethods: campaign.sendMethods,
      allowedSystems: campaign.allowedSystems,
      isAutomaticCharge: campaign.isAutomaticCharge
    } as CampaignPush;
    const querySnapshot = await this.firebaseService.getFirebaseCollection('pushTasks').ref;
    return await querySnapshot.add(data);
  }

  async updateCampaign(id: string, campaign: CampaignPush): Promise<any> {
    const data = {
      name: campaign.name,
      options: {
        pushTitle: campaign.options.pushTitle,
        pushDescription: campaign.options.pushDescription,
        pushImg: campaign.options.pushImg ? campaign.options.pushImg : '',
        url: campaign.options.url ? campaign.options.url : '',
      },
      hasToPerformTest: campaign.hasToPerformTest,
      expirationDate: campaign.expirationDate,
      performAt: campaign.performAt,
      status: campaign.status,
      lastModifiedAt: this.getCurrentTimestamp(),
      lastModifiedBy: campaign.lastModifiedBy,
      failureCount: 0,
      failureCountTest: 0,
      params: {},
      redirectPath: campaign.redirectPath ? campaign.redirectPath : '',
      redirectType: campaign.redirectType ? campaign.redirectType : '',
      redirectWebPush: campaign.redirectWebPush ? campaign.redirectWebPush : '',
      imgWebPush: campaign.imgWebPush ? campaign.imgWebPush : '',
      successCount: 0,
      successCountTest: 0,
      sendMethods: campaign.sendMethods,
      allowedSystems: campaign.allowedSystems,
      isAutomaticCharge: campaign.isAutomaticCharge ? true : false
    };
    const querySnapshot = await this.firebaseService.getFirebaseCollection('pushTasks').ref;
    return await querySnapshot.doc(id).set(data, { merge: true });
  }

  getConfig(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(environment.pushApiPath + '/v1/groups')
        .subscribe((result) => resolve(result), (err) => reject(err));
    });
  }

  updateConfig(id: string, status: boolean): Promise<any>  {
    return new Promise((resolve, reject) => {
      this.http.put(environment.pushApiPath + '/v1/groups',
        {
          groupId: id,
          status,
        })
        .subscribe((result) => resolve(result), (err) => reject(err));
    });
  }

  getEventsConfig(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(environment.pushApiPath + '/v1/events')
        .subscribe((result) => resolve(result), (err) => reject(err));
    });
  }

  updateEventConfig(event: string, status: boolean): Promise<any>  {
    return new Promise((resolve, reject) => {
      this.http.put(environment.pushApiPath + '/v1/events',
        {
          eventId: event,
          status,
        })
        .subscribe((result) => resolve(result), (err) => reject(err));
    });
  }

  isCampaignAllowed(campaign: CampaignPush) {
    const status = campaign.status;
    const statusAllowed = [
      'scheduled', 'draft', 'complete', 'immediate', 'format-message',
      'error', 'get-cursor-to-separate', 'sending-notification-in-topic',
      'temporal-complete'
    ];
    return statusAllowed.includes(status);
  }

  async getCampaigns(): Promise<Array<DocumentData>> {
    const campaigns = new Array<DocumentData>();
    const querySnapshot = await this.firebaseService.getFirebaseCollection('bannerCampaigns').ref.get();
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach(doc => {
        campaigns.push(doc.data());
      });
    }
    return campaigns;
  }

  getDate(date: any) {
    if (date._seconds) {
      return new Date(date._seconds * 1000 + date._nanoseconds / 1000000);
    }
    return date.toDate();
  }
}
