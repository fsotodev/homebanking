import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TabCodeComponent } from './tab-code/tab-code.component';
import { TabRutComponent } from './tab-rut/tab-rut.component';

@Component({
  selector: 'app-upload-benefit-files',
  templateUrl: './upload-benefit-files.component.html',
  styleUrls: ['./upload-benefit-files.component.scss']
})
export class UploadBenefitFilesComponent implements OnInit {
  @ViewChild(TabCodeComponent) uploadCode: TabCodeComponent;
  @ViewChild(TabRutComponent) uploadRut: TabRutComponent;
  filterValue: string;
  tabSelected = 0;
  constructor() { }

  ngOnInit() {
  }

  triggerFilter = () => {
    this.uploadCode.filterValue(this.filterValue);
    this.uploadRut.filterValue(this.filterValue);
  };

  tabChanged(tabEvent: MatTabChangeEvent) {
    this.tabSelected = tabEvent.index;
  }

}
