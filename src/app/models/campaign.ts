export class Campaign {
  id: string;
  uniqueCode?: string;
  active: boolean;
  hasCode: boolean;
  startDate: any;
  endDate: any;

  campaignTitle: string;
  campaignSubTitle: string;
  headerTitle: string;
  homeText: string;
  campaignDurationText: string;
  codeDescription: string;
  priority: number;

  campaignConditionsPdfUrl: string;
  campaignLogoUrl: string;
  campaignMainImage: string;
  homeLogoUrl: string;

  typeCode: Map<string, string>;
}

export class CampaignPush {
  id: string;
  name: string;
  status: string;
  options: Options;
  performAt: any;
  createdAt: any;
  createdBy: string;
  expirationDate: any;
  hasToPerformTest: boolean;
  lastModifiedAt: any;
  lastModifiedBy: string;
  failureCount: number;
  failureCountTest: number;
  params: any;
  redirectPath: string;
  redirectType: string;
  successCount: number;
  successCountTest: number;
  uploadedRuts: boolean;
  sendMethods: any;
  allowedSystems: any;
  rutsUploaded: number;
  tapsFromSystem?: number;
  tapsFromTray?: number;
  usersSent?: string[];
  redirectWebPush?: string;
  imgWebPush?: string;
  usersTappedFromSystem?: string[];
  usersTappedFromTray?: string[];
  isAutomaticCharge: boolean;
}

export class PromotionalBanner {
  id: string;
  url: string;
  type: string;
  redirect: string;
  onOff: boolean;
  activeSeconds?: number;
}

export class PushStats {
  sentDate: any;
  usersSent: string[];
  usersTappedFromSystem: string[];
  usersTappedFromTray: string[];
  tapsFromSystem: number;
  tapsFromTray: number;
  tapsFromSystemOrTray?: number;
  totalPushSent: number;
}

export class Options {
  pushDescription: string;
  pushImg: string;
  pushTitle: string;
  url: string;
}
export class CampaignProducts {
  hasTR: boolean;
  hasTRM: boolean;
  hasSA: boolean;
}
