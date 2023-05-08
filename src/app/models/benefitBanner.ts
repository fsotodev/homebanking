export class BenefitBanner {
  id: string;
  order: number;
  active: boolean;
  imageXS: string;
  imageLG: string;
  title: string;
  description: string;
  path: string;
  internal: boolean;
  constructor() {

    this.active = false;
  }

}
