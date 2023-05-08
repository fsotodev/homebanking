import { DocumentReference } from '@firebase/firestore-types';
import { NewBenefit } from './new-benefit';

export class Benefit {
  public codesFilePath: Array<string>;
  public companyImageUrlWelcome: string;
  public id: string;
  public searchKeyword: string;
  public weekdays: any;
  public rutsStock: number;
  public rutsFilePath: Array<string>;
  public rutsUnassignFilePath: Array<string>;
  public newBenefit: NewBenefit;

  //hotfix 10-05-2022
  public order: number;
  public status: string;
  public statusPersonalBenefit: string;
  public type: string;
  public startDate: any;
  public endDate: any;

  constructor() {
    this.codesFilePath = [];
    this.companyImageUrlWelcome = '';
    this.id = '';
    this.weekdays = '';
    this.rutsStock = 0;
    this.rutsFilePath = [];
    this.newBenefit = new NewBenefit();
    //hotfix 10-05-2022
    this.order = 1;
    this.status = '';
    this.statusPersonalBenefit = '';
    this.type = '';
    this.startDate = '';
    this.endDate = '';
  }
}

export class BenefitType {
  public order: number;
  public ref: string;
  public sectionTitle: string;
  public id?: string;
}
export class BenefitCategory {
  public order: number;
  public type: string;
  public sectionTitle: string;
  public id?: string;
  public icon: string;
  public active: boolean;
}
export class BenefitCode {
  public benefitId: string;
  public code: string;
  public period: string;
  public docRef?: DocumentReference;
}

export class BenefitSubscription {
  public id?: string;
  public benefitId: string;
  public subscribedAt: any;
  public userId: string;

  constructor() {
    this.benefitId = '';
    this.subscribedAt = '';
    this.userId = '';
  }
}

export class BenefitSegment {
  public id: string;
  public benefits?: BenefitSegmentDefault[];
  public bronze?: BenefitSegmentDefault[];
  public gold?: BenefitSegmentDefault[];
  public one?: BenefitSegmentDefault[];
  public silver?: BenefitSegmentDefault[];
}
class BenefitSegmentDefault {
  public icon: string;
  public title: string;
  public description?: string;
}

