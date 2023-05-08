import { NavigationExtras, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { CategoryService } from '@apps/services/category.service';
import { Category } from '@apps/models/category';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-home',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss']
})
export class ListCategoryComponent implements OnInit {
  public isLoading = true;
  public modifyingCategory = false;
  public categoriesDataSource = new MatTableDataSource();
  public displayedColumns = [
    'order',
    'category',
    'status',
    'expirationDate',
    'statusToggle',
    'modifyOrDelete'
  ];

  constructor(
    private router: Router,
    private categorySvc: CategoryService,
    private modalDialogService: ModalDialogService,
  ) { }

  ngOnInit() {
    this.getCategoryList();
  }

  public addCategory() {
    this.router.navigate(['/new-category']);
  }

  public editCategory(element: any) {
    const navigationExtras: NavigationExtras = { queryParams: { id: element.id } };
    this.router.navigate(['/new-category'], navigationExtras);
  }

  public setOrderOnCategory(element: any) {
    this.modifyingCategory = true;
    if (element.order && element.order > 0) {
      const categoryData = { order: element.order, categoryId: element.categoryId, active: element.active } as Category;
      this.updateCategory(element.id, categoryData);
    }
  }

  public toggleChange(element: any) {
    this.modifyingCategory = true;
    const categoryData = { active: !element.active, categoryId: element.categoryId } as Category;
    this.updateCategory(element.id, categoryData);
  }

  public getExpirationDate(date: any) {
    return date ? date.toDate() : '';
  }

  applyFilter(filterValue: string) {
    this.categoriesDataSource.filter = filterValue.trim().toLowerCase();
  }

  copyCategory(category: Category) {
    this.modifyingCategory = true;
    this.modalDialogService.openModal('copyConfirmCategory')
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.categorySvc.copyCategory(category)
            .then((copy) => {
              this.modifyingCategory = false;
              this.editCategory(copy);
            })
            .catch((ee) => {
              console.error(ee);
              this.modifyingCategory = false;
            });
        } else {
          this.modifyingCategory = false;
        }
      });
  }

  private updateCategory(id: string, categoryData: Category) {
    this.categorySvc.updateCategory(id, categoryData)
      .then(() => {
        this.getCategoryList();
      })
      .catch(() => {
        this.getCategoryList();
      });
  }

  private async getCategoryList() {
    this.isLoading = true;
    this.modifyingCategory = false;
    this.isLoading = false;
    this.categoriesDataSource.data = await this.categorySvc.getAllCategories();
    // this.categoriesDataSource.data.sort((a , b) => { return a.order - b.order } );
  }
}
