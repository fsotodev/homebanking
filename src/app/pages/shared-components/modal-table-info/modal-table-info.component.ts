import {Component, OnInit, Inject, ViewChild, AfterViewInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Utils, ModalDataObject } from '../utils/utils';
import { FirebaseService } from '@apps/services/firebase.service';
import { UserTransactions } from '@apps/models/productTransaction';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-table-info',
  templateUrl: './modal-table-info.component.html',
  styleUrls: ['./modal-table-info.component.scss']
})
export class ModalTableInfoComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  displayedColumns = ['fullName', 'category', 'points', 'status',
    'createdAt', 'executedBy', 'aurisNumber', 'productFolio', 'code', 'origin'];
  dataSource: MatTableDataSource<any>;
  modalData: ModalDataObject;
  params: any;
  loading = true;

  constructor(
    private utils: Utils,
    private dialogRef: MatDialogRef<ModalTableInfoComponent>,
    @Inject(MAT_DIALOG_DATA) modalDataFromService,
    private firebase: FirebaseService
  ) {
    this.modalData = this.utils.getModalDataObject(modalDataFromService.modalType);
    this.params = modalDataFromService.params;
    this.dataSource = new MatTableDataSource([]);
  }

  async ngAfterViewInit() {
    const transactionsSnapshot = await this.firebase.getTransactionsByUserIdApi(this.params.userId);
    if (transactionsSnapshot.empty) {
      this.dataSource = null;
    } else {
      const transactions = transactionsSnapshot.map(t => new UserTransactions(t));
      this.dataSource = new MatTableDataSource(transactions);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    this.loading = false;
  }

  ngOnInit() { }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  closeModal(btnPressed: string) {
    this.dialogRef.close({ btnPressed });
  }

  getParsedDate(date: any) {
    return !!date ? moment(date).format('DD-MM-YYYY') : 'Sin fecha registrada';
  }
}
