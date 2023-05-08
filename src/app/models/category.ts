export class Category {
  public id?: string;
  public categoryId: string;
  public active: boolean;
  public actionSelectProduct: string;
  public codeType: string;
  public confirmationSelectedTitle: string;
  public order: number;
  public successTitle: string;
  public image: string;
  public categoryTips: Tips[];
  public categoryInstructions: Instructions[];
  public categoryTitle: string;
  public name: string;
  public expirationDate: any;
  public bannerText: string;


  constructor() {
    this.categoryTips = [];
    this.categoryInstructions = [];
    this.active = false;
    this.actionSelectProduct = '';
    this.codeType = '';
    this.confirmationSelectedTitle = '';
    this.order = 1;
    this.successTitle = '';
    this.image = '';
    this.categoryId = '';
    this.categoryTitle = '';
    this.name = '';
    this.expirationDate = '';
    this.bannerText = '';
  }
}

export class Tips {
  public iconURL: string;
  public subtitle: string;
  public title: string;
}

export class Instructions {
  public iconURL: string;
  public text: string;
}
