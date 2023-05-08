import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-custom-paginator',
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.scss']
})
export class CustomPaginatorComponent implements OnChanges {
  @Input()
  totalPages: any ;
  @Input()
  pageSizeSelected: number;
  @Output()
  page: EventEmitter<any> = new EventEmitter<any>();
  MAX_PAGES = 10;
  pageActive = 1;
  counterPage: number = this.MAX_PAGES;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.totalPages = new Array(this.totalPages);
  }

  selectPage(page: number) {
    if (this.pageActive !== page) {
      this.pageActive = page;
      this.page.emit(this.pageActive);
    }
  }

  previousPage() {
    if (this.pageActive === 1) {
      return;
    }
    if (this.pageActive > this.MAX_PAGES) {
      this.counterPage--;
      this.pageActive = this.counterPage;
    } else {
      this.pageActive = this.pageActive - 1;
    }
    this.page.emit(this.pageActive);
  }

  nextPage() {
    if (this.pageActive > this.totalPages.length) {
      return ;
    }
    if (this.pageActive >= this.MAX_PAGES) {
      this.counterPage++;
      this.pageActive = this.counterPage;
    } else {
      this.pageActive = this.pageActive + 1;
    }
    this.page.emit(this.pageActive);
  }
}
