import { Component, Input } from '@angular/core';
import { Product } from '../../../../models/product';

@Component({
  selector: 'app-product-viewer',
  templateUrl: './product-viewer.component.html',
  styleUrls: ['./product-viewer.component.scss']
})
export class ProductViewerComponent {

  @Input() product: Product;
  @Input() expirationDate: Date;
  dateOneYear: Date = new Date();

  constructor() {
    this.dateOneYear.setFullYear(this.dateOneYear.getFullYear() + 1);
  }

}
