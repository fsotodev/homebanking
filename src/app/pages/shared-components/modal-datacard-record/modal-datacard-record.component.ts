import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Utils, ModalDataObject } from '../utils/utils';
import { FirebaseService } from '@apps/services/firebase.service';

@Component({
  selector: 'app-modal-datacard-record',
  templateUrl: './modal-datacard-record.component.html',
  styleUrls: ['./modal-datacard-record.component.scss']
})
export class ModalDatacardRecordComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  displayedColumns = ['fileName', 'loadedRuts', 'uploadedAt', 'userAccount'];
  dataSource: MatTableDataSource<any>;
  modalData: ModalDataObject;
  loading = true;
  constructor(
    private utils: Utils,
    private dialogRef: MatDialogRef<ModalDatacardRecordComponent>,
    @Inject(MAT_DIALOG_DATA) modalDataFromService,
    private firebaseService: FirebaseService
  ) {
    this.modalData = this.utils.getModalDataObject(modalDataFromService.modalType);
    this.dataSource = new MatTableDataSource([]);
  }

  async ngAfterViewInit() {
    const data = await this.getDataOfFilesUploaded();
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loading = false;
  }

  ngOnInit() { }

  async getDataOfFilesUploaded(): Promise<any> {
    const querySnapshot = await this.firebaseService.getFirebaseCollection('dataCardUploadRecord').ref.get();
    const dataUpload = [];

    if (querySnapshot.docs.length > 0) {
      querySnapshot.forEach((doc) => {
        const uploadData = doc.data();
        dataUpload.push(uploadData);
      });
    }
    return dataUpload;
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  closeModal(btnPressed: string): void {
    this.dialogRef.close({ btnPressed });
  }

}
