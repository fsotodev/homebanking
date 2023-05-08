import { Component } from '@angular/core';
import { ExportService } from '../../services/export.service';
import { Location } from '@angular/common';
import { FirebaseService } from '../../services/firebase.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-unemployment-insurance',
  templateUrl: './download-unemployment-insurance.component.html',
  styleUrls: ['./download-unemployment-insurance.component.scss']
})

export class DownloadUnemploymentInsuranceComponent {

  public loading: boolean;
  public fileName = 'unemploymentInsurance';

  constructor(
    private firebaseService: FirebaseService,
    private exportService: ExportService,
    private location: Location,
    private utilsService: UtilsService
  ) {
    this.loading = false;
  }

  public async downloadFile() {
    this.loading = true;
    const data = await this.firebaseService.getCollectionWithDocId('unemploymentInsurance');
    data.map((row) => row.createdAt = row.createdAt ? this.utilsService.getParsedDate(row.createdAt.toDate()) : '');
    const date = this.utilsService.getParsedDate();
    this.exportService.exportToExcel(data, this.fileName + '_' + date);
    this.loading = false;
  }

  public goBack() {
    this.location.back();
  }
}
