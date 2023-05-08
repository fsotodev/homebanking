export class SegmentationItem {
  type: string;
  id: string;
  active: boolean;
  discount: string;
  detail: string;
  code?: string;

  constructor() {
    this.active = false;
  }

}
