import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { DocumentData } from '@firebase/firestore-types';
import { PushCampaignsService } from '@apps/services/push-campaigns.service';
import { CampaignPush } from '@apps/models/campaign';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { FirebaseService } from '@apps/services/firebase.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { saveAs } from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  displayedColumns: string[] = ['createdAt', 'id', 'name', 'title', 'description', 'status', 'performAt',
    'successCount', 'failureCount', 'uploadedRuts', 'modifyOrDelete'];
  campaigns: Array<CampaignPush> = [];
  isLoading = true;
  loading = true;
  campaignName: string;
  clicksCampaignForm: FormGroup;
  campaignsList: Array<DocumentData>;
  dataSource: MatTableDataSource<any>;

  constructor(
    private router: Router,
    private campaignsService: PushCampaignsService,
    private modalDialogService: ModalDialogService,
    private firebase: FirebaseService
  ) {
    this.clicksCampaignForm = new FormGroup({
      campaignMap: new FormControl('',
        Validators.compose([
          Validators.maxLength(150),
          Validators.minLength(1),
          Validators.required])),
    });
  }

  async ngOnInit() {
    await this.getPushCampaigns();
    await this.getCampaigns();
  }

  async getCampaigns() {
    this.campaignsList = await this.campaignsService.getCampaigns();
  }

  async getPushCampaigns() {
    this.campaigns = await this.campaignsService.getPushCampaigns();
    this.dataSource = new MatTableDataSource(this.campaigns);
    this.dataSource.paginator = this.paginator;
    this.isLoading = false;
  }

  addNewCampaign() {
    this.router.navigate(['/create-campaign']);
  }

  async deleteCampaign(element: CampaignPush) {
    if (!this.canDelete(element)) {
      return;
    }
    this.isLoading = true;
    this.modalDialogService.openModal('deleteConfirmCampaign').then(async (btnPressed) => {
      if (btnPressed === 'right') {
        await this.campaignsService.deleteCampaign(element.id);
        await this.getPushCampaigns();
      } else {
        this.isLoading = false;
      }
    });
  }

  editCampaign(element: CampaignPush) {
    if (!this.canEdit(element)) {
      return;
    }
    this.isLoading = true;
    const navigationExtras: NavigationExtras = { queryParams: { id: element.id } };
    this.isLoading = false;
    this.router.navigate(['/create-campaign'], navigationExtras);
  }

  async duplicateCampaign(element: CampaignPush) {
    this.isLoading = true;
    element.name = element.name + 'copy';
    const result = await this.campaignsService.createCampaign(element);
    this.modalDialogService.openModal('editCampaign').then(async (btnPressed) => {
      if (btnPressed === 'right') {
        this.isLoading = false;
        this.editCampaign(result);
      } else {
        await this.getPushCampaigns();
      }
    });
  }

  async downloadClicksCampaigns() {
    this.loading = false;
    const fileContent = await this.createCSVPrivateCampaigns();
    this.save(fileContent);
    this.campaignName = '';
    this.loading = true;
  }

  save(fileContent: string) {
    const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8' });
    saveAs.saveAs(blob, 'campaigns' + '.csv');
  }

  async createCSVPrivateCampaigns() {
    const delimiter = ',';
    let fileContent = '';
    const paginationSize = 9999;

    fileContent +=
      'NOMBRE DE CAMPAÑA' + delimiter +
      'RUT USUARIO' + delimiter +
      'FECHAS DE CLICKS\n';

    const originalQuery = await this.firebase.getFirebaseCollection('bannerCampaignsUsers')
      .ref.where('campaignName', '==', this.campaignName);
    let currentLength = paginationSize;
    let query = originalQuery.limit(paginationSize);
    let totalRows = 0;

    while (currentLength === paginationSize) {
      await query.get().then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          const campaign = doc.data();
          if (campaign.zClicks) {
            fileContent +=
            (campaign.campaignName ? campaign.campaignName : '') + delimiter +
            (campaign.rut ? campaign.rut : '') + delimiter + '[' +
            (campaign.zClicks.map(x => this.getParsedDate(x.toDate())).concat() ?
              campaign.zClicks.map(x => this.getParsedDate(x.toDate())).concat() : '') + ']' + '\n';
          } else {
            fileContent +=
            (campaign.campaignName ? campaign.campaignName : '') + delimiter +
            (campaign.rut ? campaign.rut : '') + delimiter + '\n';
          }

        });
        currentLength = snapshot.docs.length;
        totalRows += currentLength;

        const lastDocument = snapshot.docs[snapshot.docs.length - 1];
        try {
          query = originalQuery.startAfter(lastDocument).limit(paginationSize);
        } catch (error) {
          return;
        }
      });
    }
    return fileContent;
  }

  getParsedDate(date: any) {
    return !!date ? moment(date).format('DD-MM-YYYY') : 'Sin fecha registrada';
  }

  canEdit(element: CampaignPush) {
    const statusAllowed = [ 'draft', 'error' ];
    if (statusAllowed.includes(element.status)) {
      return true;
    }
    return false;
  }

  canCancel(element: CampaignPush) {
    const statusAllowed = [
      'scheduled', 'error', 'temporal-complete'
    ];
    if (statusAllowed.includes(element.status)) {
      return true;
    }
    return false;
  }

  canDelete(element: CampaignPush) {
    const statusAllowed = [ 'draft', 'complete' ];
    if (statusAllowed.includes(element.status)) {
      return true;
    }
    return false;
  }

  cancelSend(element: CampaignPush) {
    if (!this.canCancel(element)) {
      return;
    }
    this.isLoading = true;
    this.modalDialogService.openModal('cancelConfirmCampaign').then(async (btnPressed) => {
      if (btnPressed === 'right') {
        await this.campaignsService.cancelSendCampaign(element.id);
        await this.getPushCampaigns();
      } else {
        this.isLoading = false;
      }
    });
  }
}
