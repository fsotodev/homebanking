import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { TypeInput } from '@apps/shared/utils/constants';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table-generic',
  templateUrl: './table-generic.component.html',
  styleUrls: ['./table-generic.component.scss']
})
export class TableGenericComponent implements OnInit {
  @ViewChild(MatPaginator, {static : true})
  public paginator: MatPaginator;
  @Input()
  public dataTable: any[];
  @Input()
  public displayedColumns: string[];
  @Input()
  public definitionColumns: any[];
  @Input()
  public withButtonDelete: boolean;
  @Output()
  public event: EventEmitter<any>= new EventEmitter();
  @Output()
  public actionButton: EventEmitter<any> = new EventEmitter();
  @Output()
  public deleteElements: EventEmitter<any> = new EventEmitter();

  public pageActive = 1;
  public pageEvent;
  public pageSizeOptions = [10,15,25];
  public pageSize = this.pageSizeOptions[0];
  public totalPages: number;
  public originalDataSource = new MatTableDataSource<any>([]);
  public selection = new SelectionModel<any>(true, []);
  public dataSource = new MatTableDataSource<any>([]);

  constructor() { }

  ngOnInit(): void {
    this.originalDataSource.data = this.dataTable;
    this.paginator._intl.itemsPerPageLabel = 'Ver: ';
    this.changePage({ pageSize: this.pageSize });
  }

  sendNewValue($event, typeInput: string, column: string, row: any) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const objExtractData = {matInput: $event?.target?.value , 'mat-slide-toggle': $event.checked };
    if (typeInput === TypeInput.matCheckbox ) {
      this.selection.select(row);
    }
    const newValue = objExtractData[typeInput];
    this.event.emit({ data: row, typeInput, column, newValue });
  }

  sendNewAction(nameButton, $event) {
    this.actionButton.emit({ button: nameButton, data: $event });
  }

  clickDelete() {
    this.deleteElements.emit({ data: this.selection.selected });
  }

  getPageActive($event) {
    this.pageActive = $event;
    this.changePage( { pageSize: this.pageSize });
  }

  changePage($event) {
    this.pageSize = $event.pageSize;
    this.setTotalPage();
    this.applyPagination(this.originalDataSource);
  }

  public applyFilter(filter: any) {
    this.dataSource.data = this.originalDataSource.data
      .filter((row) => row?.name ? row.name.toLowerCase().includes(filter.toLowerCase()) : false);
    this.applyPagination(this.dataSource);
  }

  public applyPagination(dataSource: any) {
    if(this.pageSize < this.dataSource.data.length) {
      this.dataSource.data = dataSource.data.slice(0, this.pageSize);
    } else {
      this.dataSource.data = dataSource.data.slice((this.pageActive-1)*this.pageSize, this.pageActive*this.pageSize);
    }
  }

  private setTotalPage() {
    this.totalPages = Math.ceil(this.originalDataSource.data.length/this.pageSize);
  }

  private selectAll(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach((row) => this.selection.select(row));
    }
  }

  private isAllSelected() {
    return this.dataSource.data.every((row) => this.selection.isSelected(row));
  }
}
