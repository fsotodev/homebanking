export interface ICampaignCode {
  rutHash: string;
  code: string;
  campaignId: string;
}

export interface IDataLoaded {
  isLoaded: boolean;
  hasErrors: boolean;
}
