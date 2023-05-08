import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Campaign } from '../models/campaign';

@Injectable()
export class CampaignService {

  constructor(
    private firebaseService: FirebaseService,
  ) { }

  async getCampaignIds(): Promise<Array<string>> {
    const campaigns = new Array<string>();
    const querySnapshot = await this.firebaseService.getFirebaseCollection('campaigns')
      .ref.get();
    if (querySnapshot) {
      querySnapshot.forEach(doc => {
        campaigns.push(doc.id);
      });
    }
    return campaigns;
  }

  async addNewCampaign(campaign: Campaign): Promise<any> {
    const campaignToAdd = this.generateProductData(campaign);
    try {
      const docRef = await this.firebaseService.getFirebaseCollection('campaigns')
        .doc(campaign.id)
        .set(campaignToAdd);
      return docRef;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // To upload a Map to Firebase
  convertMap(map: Map<string, string>) {
    return { copyPaste: map['copyPaste'], openApp: map['openApp'], openUrl: map['openUrl'] };
  }

  private generateProductData(campaign: Campaign): any {
    return {
      active: campaign.active ? campaign.active : false,
      hasCode: campaign.hasCode ? campaign.hasCode : false,
      endDate: campaign.endDate,
      startDate: campaign.startDate,
      typeCode: campaign.typeCode ? this.convertMap(campaign.typeCode) : null,
      campaignConditionsPdfUrl: campaign.campaignConditionsPdfUrl ? campaign.campaignConditionsPdfUrl : '',
      campaignDurationText: campaign.campaignDurationText ? campaign.campaignDurationText : '',
      campaignLogoUrl: campaign.campaignLogoUrl ? campaign.campaignLogoUrl : '',
      campaignMainImage: campaign.campaignMainImage ? campaign.campaignMainImage : '',
      campaignSubTitle: campaign.campaignSubTitle ? campaign.campaignSubTitle : '',
      campaignTitle: campaign.campaignTitle ? campaign.campaignTitle : '',
      codeDescription: campaign.codeDescription ? campaign.codeDescription : '',
      headerTitle: campaign.headerTitle ? campaign.headerTitle : '',
      homeLogoUrl: campaign.homeLogoUrl ? campaign.homeLogoUrl : '',
      homeText: campaign.homeText ? campaign.homeText : '',
      priority: campaign.priority ? campaign.priority : '',
      uniqueCode: campaign.uniqueCode ? campaign.uniqueCode : '',
    };
  }
}
