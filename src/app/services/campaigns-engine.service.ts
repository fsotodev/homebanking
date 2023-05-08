import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { saveAs } from 'file-saver';
import { parse } from 'papaparse';
import { ModalDialogService } from '../services/modal-dialog.service';
import { firestore } from 'firebase';
import { CustomBannerSlider, ICampaignScreen } from '@apps/models/interfaces/campaign-screen';
import { CampaignType, TemplateType } from '@apps/models/types/types';
import { CampaignProducts } from '@apps/models/campaign';

@Injectable()
export class CampaignsEngineService {

  csvData: any[];
  percCodesCommited: number;
  collections = {
    slider: 'sliderCampaigns',
    welcome: 'welcomeCampaigns',
    avsav: 'avSavCampaigns',
    avsavSimulation: 'avSavSimulationBanners',
    dashboard: 'dashboardCampaigns',
    ccSimulation: 'avSavSimulationBanners'
  };
  usersCollections = {
    slider: 'sliderCampaignUsers',
    welcome: 'welcomeCampaignUsers',
    avsav: 'avSavCampaignsUsers',
    avsavSimulation: 'avSavSimulationBannersUsers',
    dashboard: 'dashboardCampaignUsers',
    consumerSimulation: 'avSavSimulationBanners'
  };
  uploadingRuts = false;
  rutUploadingProgress = 0;
  uploadingCustomCampaigns = false;
  uploadedCustomCampaign = false;
  customCampaignsUploadingProgress = 0;

  constructor(
    private firebaseService: FirebaseService,
    private modalDialogService: ModalDialogService,
  ) { }

  public async getCampaign(id: string, type: CampaignType) {
    const collection = this.collections[type];
    const query = await this.firebaseService.getFirebaseCollection(collection).doc(id).ref.get();
    const campaign = query.data();
    if ((type === 'avsavSimulation' || type === 'slider' || type === 'welcome') && campaign.filters && !campaign.filters.platform) {
      campaign.filters.platform = { on: false, nfc: false, allowedPlatforms: [] };
    }
    return campaign;
  }

  public async getCampaigns(type: CampaignType) {
    const collection = this.collections[type];
    const query = await this.firebaseService.getFirebaseCollection(collection).ref.get();
    return query.docs;
  }

  async addNewCampaign(campaign: any, type: CampaignType): Promise<any> {
    const collection = this.collections[type];
    const campaignToAdd = this.generateCampaignData(campaign, type);

    try {
      campaignToAdd.lastUpdateInfoRef = await this.firebaseService.addAdminLog('create-campaign', {
        campaignId: campaignToAdd.id,
        CampaignType: type,
        activePWA: campaign.activePWA,
      });
      await this.firebaseService.setDocument(campaignToAdd, campaignToAdd.id, collection);
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async initializeCampaignById(data, id: string, collection) {
    if (id) {
      data.updatedAt = new Date();
      await this.firebaseService.initializeDocumentById(data, id, collection);
    }
  }

  async addNewScreen(screen: any, template: TemplateType): Promise<any> {
    const collection = 'welcomeCampaignScreens';
    const screenToAdd = this.generateScreenData(screen, template);
    try {
      await this.firebaseService.setDocument(screenToAdd, screenToAdd.id, collection);
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async updateScreen(id: string, screen: any): Promise<any> {
    return await this.firebaseService.getFirebaseCollection('welcomeCampaignScreens')
      .doc(id)
      .set({
        ...screen,
        updatedAt: new Date()
      }, { merge: true }).catch((error) => console.log(`Error updateing screen ${error}`));
  }

  async updateCampaign(id: string, campaign: any, type: CampaignType) {
    console.log('updateCampaign');
    const collection = this.collections[type];
    console.log(collection);
    console.log(id);
    console.log(campaign);
    const lastUpdateInfoRef = await this.firebaseService.addAdminLog('update-campaign', {
      campaignId: id,
      CampaignType: type,
      activePWA: campaign.activePWA,
    });

    return await this.firebaseService.getFirebaseCollection(collection)
      .doc(id)
      .set({
        ...campaign,
        updatedAt: new Date(),
        lastUpdateInfoRef,
      }, { merge: true })
      .then(() => true)
      .catch((error) => error);
  }

  generateCampaignData(campaign, type: CampaignType) {
    campaign.type = type;
    if (type === 'slider') {
      return this.generateSliderCampaignData(campaign);
    }
    if (type === 'avsav') {
      return this.generateAvsavCampaignData(campaign);
    }
    if (type === 'avsavSimulation') {
      return this.generateAvsavSimCampaignData(campaign);
    }
    if (type === 'welcome') {
      return this.generateWelcomeCampaignData(campaign);
    }
    if (type === 'dashboard') {
      return this.generateDashboardCampaignData(campaign);
    }
    if (type === 'ccSimulation') {
      return this.generateConsumerSimCampaignData(campaign);
    }
    console.warn('Generate campaign ', type, ' not supported yet');
  }

  generateScreenData(screen, template: TemplateType) {
    screen.template = template;
    if (template === 'page-minime' || template === 'page-custom-minime') {
      return this.generateMinimeScreenData(screen);
    } else if (template === 'page-benefits-welcomepack' || template === 'page-flex' || template === 'page-cards-welcomepack') {
      return  screen;
    }
    console.warn('Generate screen for ', template, 'template, not supported yet');
  }

  generateSliderCampaignData(campaign) {
    campaign.activePWA = !!campaign.activePWA;
    campaign.params = campaign.params ? campaign.params : '';
    campaign.desktopUrl = campaign.desktopUrl ? campaign.desktopUrl : '';
    campaign.mobileUrl = campaign.mobileUrl ? campaign.mobileUrl : '';
    campaign.goalType = campaign.goalType ? campaign.goalType : 'gotoview';
    campaign.maxGoals = campaign.maxGoals ? campaign.maxGoals : '';
    campaign.maxViews = campaign.maxViews ? campaign.maxViews : '';
    return campaign;
  }

  generateAvsavCampaignData(campaign) {
    campaign.activePWA = !!campaign.activePWA;
    return campaign;
  }

  generateAvsavSimCampaignData(campaign) {
    campaign.activePWA = !!campaign.activePWA;
    campaign.desktopUrl = campaign.desktopUrl ? campaign.desktopUrl : '';
    campaign.mobileUrl = campaign.mobileUrl ? campaign.mobileUrl : '';
    return campaign;
  }

  generateConsumerSimCampaignData(campaign) {
    campaign.activePWA = !!campaign.activePWA;
    campaign.desktopUrl = campaign.desktopUrl ? campaign.desktopUrl : '';
    campaign.mobileUrl = campaign.mobileUrl ? campaign.mobileUrl : '';
    return campaign;
  }

  generateDashboardCampaignData(campaign) {
    campaign.activePWA = !!campaign.activePWA;
    campaign.page = campaign.page ? campaign.page : '';
    campaign.params = campaign.params ? campaign.params : '';
    campaign.imageUrl = campaign.imageUrl ? campaign.imageUrl : '';
    return campaign;
  }

  generateWelcomeCampaignData(campaign) {
    campaign.activePWA = !!campaign.activePWA;
    campaign.filters.productDateStartSA = campaign.filters.productDateStartSA ? campaign.filters.productDateStartSA : new Date();
    campaign.filters.productDateStartTR = campaign.filters.productDateStartTR ? campaign.filters.productDateStartTR : new Date();
    campaign.filters.productDateStartTRM = campaign.filters.productDateStartTRM ? campaign.filters.productDateStartTRM : new Date();
    campaign.filters.productDateEndSA = campaign.filters.productDateEndSA ? campaign.filters.productDateEndSA : new Date();
    campaign.filters.productDateEndTR = campaign.filters.productDateEndTR ? campaign.filters.productDateEndTR : new Date();
    campaign.filters.productDateEndTRM = campaign.filters.productDateEndTRM ? campaign.filters.productDateEndTRM : new Date();
    return campaign;
  }

  generateMinimeScreenData(screen) {
    screen.imageURL = screen.imageURL ? screen.imageURL : '';
    screen.imageURLDesktop = screen.imageURLDesktop ? screen.imageURLDesktop : '';
    screen.pagePWA = screen.pagePWA ? screen.pagePWA : '';
    screen.paramsPWA = screen.paramsPWA ? screen.paramsPWA : '';
    screen.details.amount = screen.details.amount ? screen.details.amount : 0;
    screen.details.quota = screen.details.quota ? screen.details.quota : 0;
    return screen;
  }

  campaignIdValidator(id: string, campaigns: any[]) {
    return !!campaigns.find(c => c.id === id);
  }

  async getCampaignWithStats(type: CampaignType) {
    const campaigns = (await this.getCampaigns(type)).map((c) => {
      const campaign = c.data();
      campaign.type = type;
      campaign.stats = {};
      return campaign;
    });

    const collectionName =
      type === 'slider' ? 'sliderCampaignUserViewsGoals' :
        type === 'welcome' ? 'welcomeCampaignUserViewsGoals' :
          type === 'avsav' ? 'avSavCampaignsCampaignUserViewsGoals' :
            type === 'avsavSimulation' ? 'avSavSimulationBannersCampaignUserViewsGoals' :
              type === 'dashboard' ? 'dashboardCampaignUserViewsGoals' : '';
    const querySnapshot = await this.firebaseService.getFirebaseCollection(collectionName).ref.get();
    querySnapshot.docs.forEach(doc => {
      for (const c of campaigns) {
        if (c.id === doc.id) {
          const campaign = doc.data();
          if (campaign.total_users ) {
            campaign['percentage_views'] = (campaign.count_users_with_views / campaign.total_users * 100).toFixed(2) + '%';
            campaign['percentage_goals'] = (campaign.count_users_with_goals / campaign.total_users * 100).toFixed(2) + '%';
            if (campaign.count_users_with_views && campaign.count_users_with_views > 0) {
              campaign['effectiveness'] = (campaign.count_users_with_goals / campaign.count_users_with_views  * 100).toFixed(2) + '%';
            }
          }
          c.stats = campaign;
        }
      }
    });
    return campaigns;
  }

  generateWelcompackProductsId(id: string): Array<string>  {
    return [
      `${id}_tr`,
      `${id}_trm`,
      `${id}_sa`,
      `${id}_tr_sa`,
      `${id}_trm_sa`,
      id // just to check if an old welcomepack is already using the id
    ];
  }

  async checkIfWelcomepackExists(baseId: string) {
    if (baseId === '') {
      return false;
    }
    const welcomepacksIds = this.generateWelcompackProductsId(baseId);
    const queries = welcomepacksIds.map(welcomepackId => {
      const query = this.firebaseService.getFirebaseCollection(this.collections.welcome).doc(welcomepackId);
      return query.ref.get()
        .then((doc: firestore.DocumentSnapshot) => doc.exists)
        .catch(err => {
          console.log(`Couldn't checking if a welcomepack exists: \n${err}`);
          return false;
        });
    });
    const requests = await Promise.all(queries);
    return requests.every(result => result === false );
  }

  async getScreen(screenId: string) {
    const screen = (await this.firebaseService.getFirebaseCollection('welcomeCampaignScreens').doc(screenId).get().toPromise()).data();
    return { ...screen, id: screenId } as any;
  }

  async checkIfScreenExists(screenId: string) {
    if (screenId === '') {
      return false;
    }
    const query = this.firebaseService.getFirebaseCollection('welcomeCampaignScreens').doc(screenId);
    return query.ref.get()
      .then((documentSnapshot: firestore.DocumentSnapshot) => documentSnapshot.exists)
      .catch(err => {
        console.log(`Error checking if a document exists: ${err}`);
        return false;
      });
  }

  /** @todo: add typing */
  async getWelcomepacksByGroupId(welcomepackGroupId: string): Promise<any> {
    const snapshots = await this.firebaseService.getFirebaseCollection('welcomeCampaigns')
      .ref.where('welcomepackGroupId', '==', welcomepackGroupId).get();
    return snapshots.docs.map((s) => ({...s.data(), id: s.id}));
  }

  async getScreens() {
    const snapshots = await this.firebaseService.getFirebaseCollection('welcomeCampaignScreens').get().toPromise();
    return snapshots.docs.map((s) => ({...s.data(), id: s.id}));
  }

  async removeCampaignById(id: string, collection: string) {
    if (id) {
      await this.firebaseService.removeDocumentById(id, collection);
    }
  }

  async getScreensByTemplate(template: TemplateType): Promise<Array<ICampaignScreen>> {
    const snapshots = await this.firebaseService.getFirebaseCollection('welcomeCampaignScreens').ref
      .where('template', '==', template).get();
    return snapshots.docs.map((s) => ({...s.data(), id: s.id}));
  }

  async downloadCounters(type: CampaignType, campaignId: string, counter: 'views' | 'goals') {
    this.createCSVCountersFile(type, campaignId, counter);
  }

  createCSVCountersFile(type: CampaignType, campaignId: string, counter: 'views' | 'goals') {
    let fileContent = '';
    this.getCounterArray(type, campaignId, counter).subscribe(data => {
      for (const rut of data.docs) {
        if (rut.data().firstTime) {
          fileContent += rut.id + ',' + rut.data().firstTime + '\n';
        } else {
          fileContent += rut.id + '\n';
        }
      }
      const filename = type + '-' + campaignId + '-' + counter + '.csv';
      this.save(fileContent, filename);
    });
  }

  getCounterArray(type: CampaignType, campaignId: string, counter: 'views' | 'goals') {
    return this.firebaseService.getFirebaseCollection(this.collections[type])
      .doc(campaignId)
      .collection(counter)
      .get().pipe();
  }

  save(fileContent: string, filename: string) {
    const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8' });
    saveAs.saveAs(blob, filename);
  }

  public async uploadCampaignRuts(event: FileList, campaignId: string, type: CampaignType, cards?: CampaignProducts) {
    this.uploadingRuts = true;
    const filename = event[0].name;
    this.csvData = [];

    if (event.length > 0) {
      this.csvData = await this.parseFile(event);
      await this.uploadRuts(filename, campaignId, type, cards).catch((error) => {
        console.error(error);
        this.modalDialogService.openModal('csvUploadError');
      });
      this.uploadingRuts = false;
    } else {
      throw({error: 'emptyFileError'});
    }
  }

  parseFile(file: any): any {
    return new Promise(((resolve, reject) => {
      parse(file.item(0), {
        complete: (result) => {
          const sanitizeData = this.sanitizeData(result.data);
          if (this.isValidRutsList(sanitizeData)) {
            resolve(sanitizeData);
          } else {
            reject({type: 'rutBadFormat'});
          }
        },
      });
    }));
  }

  isValidRutsList(list: any[]): boolean {
    for (const rut of list) {
      const regex = new RegExp(/^([\d])([\d]{6,7})([\d|k])$/);
      if (!regex.test(rut[0])) {
        return false;
      }
    }
    return true;
  }

  public async uploadRuts(filename: string, campaignId: string, type: CampaignType, cards?: CampaignProducts) {
    const collection = this.usersCollections[type];
    let batch = this.firebaseService.getNewBatch();
    let counter = 0;
    const total = this.csvData.length;
    this.rutUploadingProgress = 0;

    const uploadedRutsInfoRef = await this.firebaseService.addAdminLog('load-campaign-ruts', {
      filename,
      campaignId,
      CampaignType: type,
      status: 'uploading',
    });
    try {
      for (const row of this.csvData) {

        this.setDocument(row, batch, collection, campaignId, uploadedRutsInfoRef, cards);

        counter += 1;
        if (counter % 250 === 0) {
          await batch.commit();
          batch = this.firebaseService.getNewBatch();
          this.rutUploadingProgress = 100 * counter / total;
        }
      }
      await batch.commit();
      this.rutUploadingProgress = 100;
      await uploadedRutsInfoRef.update({ status: 'completed', ruts: counter });
    } catch (error) {
      console.error(error);
      await uploadedRutsInfoRef.update({ status: 'error', error });
    }
  }

  public setDocument(row, batch, collection: string, campaignId: string,
    uploadedRutsInfoRef: firestore.DocumentReference,
    cards?: CampaignProducts) {
    const columnRut = 0;
    const rut = this.cleanRut(row[columnRut]);
    const ref = this.firebaseService.getFirebaseCollection(collection).doc(rut).ref;

    batch.set(ref, {
      campaigns: this.firebaseService.arrayUnion(campaignId),
      counters: {
        [campaignId]: this.getNewCounterObject(uploadedRutsInfoRef),
      },
      rut,
      cards: this.getCardsObject(cards)
    }, { merge: true });
  }

  public getCardsObject(cards?: CampaignProducts) {
    if (!cards) {
      return {};
    }
    const cardsObject = {
      useCards: true
    };
    cardsObject['SA'] = !!cards.hasSA;
    cardsObject['TR'] = !!cards.hasTR;
    cardsObject['TRM'] = !!cards.hasTRM;
    return cardsObject;
  }

  public getNewCampaignsArray(doc, newCampaign) {
    if (!!doc && Object.keys(doc).find((k) => k === 'campaigns')) {
      const campaigns = doc['campaigns'];
      if (campaigns.find((c) => c === newCampaign)) {
        return campaigns;
      }
      campaigns.push(newCampaign);
      return campaigns;
    }
    return [newCampaign];
  }

  public getNewCounterObject(uploadedRutsInfoRef: firestore.DocumentReference) {
    return { goals: 0, views: 0, uploadedRutsInfoRef };
  }

  public cleanRut(rut: string) {
    return this.removeDotZero(rut)
      .replace('.', '').replace('-', '').replace(' ', '').replace(',', '')
      .toLocaleLowerCase().replace('K', 'k');
  }

  public removeDotZero(value: string) {
    if (value.endsWith('.0')) {
      return value.split('.')[0];
    }
    return value;
  }

  sanitizeData(data: any[]) {
    return data.filter((row) => !!row[0]);
  }

  public async uploadCustomCampaign(event: FileList, campaignId: string, type: CampaignType) {
    this.uploadingCustomCampaigns = true;
    this.csvData = [];
    if (event.length > 0) {
      parse(event.item(0), await {
        complete: async (result) => {
          this.csvData = this.sanitizeData(result.data);
          await this.uploadCustomCampaignData(campaignId, type)
            .catch((error) => {
              console.error(error);
              this.modalDialogService.openModal('csvUploadError');
              this.uploadingCustomCampaigns = false;
            });
          this.uploadedCustomCampaign = true;
          this.uploadingCustomCampaigns = false;
        }
      });
    } else {
      throw ({ error: 'emptyFileError' });
    }
  }

  public async uploadCustomCampaignData(campaignId: string, type: CampaignType) {
    let batch = this.firebaseService.getNewBatch();
    let counter = 0;
    const total = this.csvData.length;
    this.customCampaignsUploadingProgress = 0;
    try {
      for (const row of this.csvData) {
        const data = this.setCustomCampaign(row);
        const rut = this.cleanRut(row[0]);
        const ref = this.firebaseService.getFirebaseCollection('customCampaignsByUser')
          .doc(`/${rut}/${type}/${campaignId}`).ref;
        batch.set(ref, { data }, { merge: true });
        counter++;
        if (counter % 250 === 0) {
          await batch.commit();
          batch = this.firebaseService.getNewBatch();
          this.customCampaignsUploadingProgress = 100 * counter / total;
        }
      }
      await batch.commit();
      this.customCampaignsUploadingProgress = 100;
    } catch (error) {
      console.error(error);
    }
  }

  public setCopiedCampaignDefaultData(campaign: any, id: string) {
    campaign.id = 'Copia de ' + id;
    campaign.activePWA = false;
    campaign.rutsFilePath = [];
    return campaign;
  }

  private setCustomCampaign(row) {
    const navigation = {
      'súper avance': 'sav',
      avance: 'av',
      'crédito de consumo': 'credit'
    };
    return {
      principalTitle: row[1],
      boxTitle: row[2],
      boxInner: row[3],
      boxFooterFirstPart: row[4],
      boxFooterSecondPart: row[5],
      boxFooterThirdPart: row[6],
      boxFooterFourthPart: row[7],
      informationHeader: row[8],
      informationFirstPart: row[9],
      informationSecondPart: row[10],
      informationThirdPart: row[11],
      informationFourthPart: row[12],
      informationFifthPart: row[13],
      page: navigation[row[1]]
    } as CustomBannerSlider;
  }
}

