export class FeaturedRedeem {
  public productsList: any[];
  id: string;
  order: number;
  isActive: boolean;
  imageXS: string;
  imageMD: string;
  imageLG: string;
  products: any[];
  title: string;
  subtitle: string;
  logo: string;

  constructor() {
    this.productsList = [];
    this.products = [];
    this.isActive = false;
  }

}
