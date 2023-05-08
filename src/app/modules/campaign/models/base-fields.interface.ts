export interface IBaseFields {
  isCustom: boolean;
  activePWA: boolean;
  totem: boolean;
  id: string;
  priority: number;
  filters: IFilterDetails;
  type: string;
}


export interface IFilterDetails {
  allUsers: boolean;
}
