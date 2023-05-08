import { CampaignType } from '../types/types';
import { IDevice } from './components/devices';
import { IPlatform } from './components/platform';

interface DetailsGeneric {
    active: boolean;
}

interface DetailsAvSavCon {
    active: boolean;
    max: number;
    min: number;
}

interface Detail {
    active: boolean;
    details: DetailsGeneric;
    amount: number;
    quota: number;
}

interface Filters {
    allUsers: boolean;
    haveProductCondition: string;
    av: DetailsAvSavCon;
    sav: DetailsAvSavCon;
    consumer: DetailsAvSavCon;
    segment: boolean;
    segmentGold: boolean;
    segmentRipley: boolean;
    segmentOne: boolean;
    segmentBronze: boolean;
    segmentSilver: boolean;
    hasSA: boolean;
    hasCA: boolean;
    hasTR: boolean;
    hasTRM: boolean;
    devices: IDevice;
    platform: IPlatform;
}

export interface ICampaingSlider {
    id: string;
    type: CampaignType;
    totem: boolean;
    activePWA: boolean;
    isCustom: boolean;
    priority: number;
    maxViews: number;
    goalType: string;
    maxGoals: number;
    textColor: string;
    buttonColor: string;
    buttonText: string;
    page: string;
    params: string;
    mobileUrl: string;
    desktopUrl: string;
    details: Detail;
    rutsFilePath: Array<string>;
    filters: Filters;
}
