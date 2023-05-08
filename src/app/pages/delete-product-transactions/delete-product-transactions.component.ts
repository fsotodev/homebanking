import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { DeleteProductTransactionsDialogComponent } from './dialog/delete-product-transactions-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';



@Component({
  selector: 'app-delete-product-transactions',
  templateUrl: './delete-product-transactions.component.html',
  styleUrls: ['./delete-product-transactions.component.scss']
})
export class DeleteProductTransactionsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  transactionSearchForm: FormGroup;
  displayedColumns: string[] = ['createdAt', 'fullName', 'category', 'status', 'points', 'origin', 'code', 'productFolio'
    ,'modifyOrDelete'];
  dataSource: MatTableDataSource<any>;
  showUserTransactions: boolean;
  userId: string;
  loading = false;

  constructor(
    public dialog: MatDialog,
    private firebase: FirebaseService,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource([]);
  }
  ngOnInit(): void {
    this.transactionSearchForm = new FormGroup({
      userId: new FormControl('',
        Validators.compose([
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(/^[0-9]+[0-9kK]{1}$/),
        ]))
    });
  }

  async ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  public async getUserTransactions() {
    this.loading = true;
    this.showUserTransactions = false;
    this.userId = this.transactionSearchForm.get('userId').value;
    let data = await this.firebase.getTransactionsByUserIdApi(this.transactionSearchForm.get('userId').value);
    data.sort((a, b) => b.createdAt - a.createdAt);
    data = data.map((o) => ({ created: this.getParsedDate(o.createdAt), ...o }));
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.showUserTransactions = true;
    this.loading = false;

  }


  public getParsedDate(date: any) {
    return !!date ? moment(date).format('DD-MM-YYYY HH:MM') : 'Sin fecha registrada';
  }

  public selectRow(row: any) {
    const dialogRef = this.dialog.open(DeleteProductTransactionsDialogComponent, {
      data: {
        productTransaction: row,
        userId: this.userId
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(async result => {
      await this.getUserTransactions();
    });
  }

  public applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
