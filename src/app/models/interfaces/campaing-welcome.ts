import { CampaignType } from '../types/types';
import { IDevice } from './components/devices';
import { IPlatform } from './components/platform';

interface Filters {
    allUsers: boolean;
    haveProductCondition: string;
    devices: IDevice;
    platform: IPlatform;
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
    startDate: any;
    endDate: any;
    productDateSA: boolean;
    productDateStartSA: any;
    productDateEndSA: any;
    productDateTR: boolean;
    productDateStartTR: any;
    productDateEndTR: any;
    productDateTRM: boolean;
    productDateStartTRM: any;
    productDateEndTRM: any;

}

export interface ICampaingWelcome {
    id: string;
    type: CampaignType;
    totem: boolean;
    activePWA: boolean;
    isCustom: boolean;
    minime: boolean;
    priority: number;
    maxViews: number;
    maxGoals: number;
    rutsFilePath: Array<string>;
    filters: Filters;
    screens: Array<any>;
    withConfirmationBtn: boolean;
    withButton: boolean;
    updatedAt: Date;
}
