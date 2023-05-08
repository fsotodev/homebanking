import { NavigationExtras, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Product } from '@apps/models/product';
import { ProductsService } from '@apps/services/products.service';
import { GroupService } from '@apps/services/group.service';
import { Group } from '@apps/models/group';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-home',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent implements OnInit {
  public isLoading = true;
  public modifyingProduct = false;
  public productsDataSource = new MatTableDataSource();
  public displayedColumns = [
    'category',
    'product',
    'name',
    'points',
    'stock',
    'successfulExchanges',
    'group',
    'statusToggle',
    'modifyOrDelete'
  ];

  constructor(
    private router: Router,
    private productSvc: ProductsService,
    private groupService: GroupService,
    private modalDialogService: ModalDialogService,
  ) { }

  ngOnInit() {
    this.getProductList();
  }

  public addProduct() {
    this.router.navigate(['/new-product']);
  }

  public editProduct(element: any) {
    const navigationExtras: NavigationExtras = { queryParams: { id: element.id } };
    this.router.navigate(['/new-product'], navigationExtras);
  }

  public deleteProduct(element: any) {
    this.modifyingProduct = true;
    this.modalDialogService.openModal('deleteConfirmProduct')
      .then((btnPressed)=> {
        if(btnPressed === 'right') {
          this.makeProductInvisible(element);
        } else {
          this.modifyingProduct = false;
        }
      });
  }

  public makeProductInvisible(element: any) {
    const productData = { invisible: true, active: false, category: element.category, sku: element.id } as Product;
    this.updateProduct(element.id, productData);

  }

  public toggleChange(element: any) {
    this.modifyingProduct = true;
    const productData = { active: !element.active, category: element.category, sku: element.id } as Product;
    this.updateProduct(element.id, productData);
  }

  public getExpirationDate(date: any) {
    return date ? date.toDate() : '';
  }

  applyFilter(filterValue: string) {
    this.productsDataSource.filter = filterValue.trim().toLowerCase();
  }

  private updateProduct(id: string, productData: Product) {
    this.productSvc.updateProduct(id, productData)
      .then(() => {
        this.getProductList();
      })
      .catch(() => {
        this.getProductList();
      });
  }

  private async getProductList() {
    this.isLoading = true;
    const groups = await this.groupService.getAllCGroups();
    const products = this.filterInvisibleProducts(await this.productSvc.getAllProducts());
    this.productsDataSource.data = products.map(product => {
      const groupName = product.productGroupId && product.productGroupId !== '' ?
        groups.find(g => g.id === product.productGroupId).name : 'N/A';
      return {...product, groupName };
    });
    this.modifyingProduct = false;
    this.isLoading = false;
  }

  private filterInvisibleProducts(productsList: any) {
    const filteredProducts = productsList.filter(
      (product) => product.invisible === undefined || product.invisible === false
    );
    return filteredProducts;
  }
}
