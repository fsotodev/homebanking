import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Utils, ModalDataObject } from '../utils/utils';
import { ProductsService } from '@apps/services/products.service';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-product-codes',
  templateUrl: './modal-product-codes.component.html',
  styleUrls: ['./modal-product-codes.component.scss']
})
export class ModalProductCodesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  displayedColumns = ['productUploadedAt', 'code', 'password', 'productFolio', 'sku'];
  dataSource: MatTableDataSource<any>;
  modalData: ModalDataObject;
  params: any;
  loading = true;
  date = Date();

  constructor(
    private utils: Utils,
    private dialogRef: MatDialogRef<ModalProductCodesComponent>,
    @Inject(MAT_DIALOG_DATA) modalDataFromService,
    private productsService: ProductsService
  ) {
    this.modalData = this.utils.getModalDataObject(modalDataFromService.modalType);
    this.params = modalDataFromService.params;
    this.dataSource = new MatTableDataSource([]);
  }

  async ngAfterViewInit() {
    const productCodes = await this.productsService.getProductsCodes(this.params.sku);
    const data = productCodes.slice(0, 10);
    if (!data) {
      this.dataSource = null;
    } else {
      this.dataSource = new MatTableDataSource(data);
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
