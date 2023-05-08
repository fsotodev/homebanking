export class Promotion {
  promotionSubtitle: string;
  isActive: boolean;
  promotionTitle: string;
  mainDescription: string;
  promotionMainImage: string;
  startDate: string;
  endDate: string;
}

export interface IAccountTypesPreview {
  forTR: boolean;
  forTRM: boolean;
  forSA: boolean;
  forSA_TR: boolean;
  forSA_TRM: boolean;
}
