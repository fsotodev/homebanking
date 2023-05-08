import { NavigationExtras, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CampaignsEngineService } from '@apps/services/campaigns-engine.service';
import { ICampaignScreen } from '@apps/models/interfaces/campaign-screen';
import {CampaignType, TemplateType} from '@apps/models/types/types';

@Component({
  selector: 'app-list-welcomepacks',
  templateUrl: './list-welcomepacks.component.html',
  styleUrls: ['./list-welcomepacks.component.scss']
})
export class ListWelcomepacksComponent implements OnInit {
    public isLoading = true;
    public modifyingCampaign = false;
    public dataSources = {
      welcome: new MatTableDataSource(),
      'P. productos': new MatTableDataSource(),
      'P. beneficios': new MatTableDataSource(),
      'P. Ripley puntos': new MatTableDataSource()
    };
    public tabsIterator = [
      'welcome',
      'P. productos',
      'P. beneficios',
      'P. Ripley puntos'
    ];
    public displayedColumns = {
      welcome: [
        'priority',
        'id',
        'views',
        'goals',
        'statusTogglePWA',
        'actions'
      ],
      'P. productos': [
        'id',
        'subTitle',
        'backgroundColor',
        'screenActions'
      ],
      'P. beneficios': [
        'id',
        'mainTitle',
        'subTitle',
        'screenActions'
      ],
      'P. Ripley puntos': [
        'id',
        'mainTitle',
        'subTitle',
        'screenActions'
      ]
    };
    public tabSelected = 0;
    public downloading = false;

    constructor(
        private router: Router,
        private campaignsEngineService: CampaignsEngineService,
        private modalDialogService: ModalDialogService
    ) { }

    ngOnInit(): void {
      this.isLoading = true;
      Promise.all([
        this.getWelcomepackList('welcome'),
        this.getScreenListByType('page-cards-welcomepack', 'P. productos'),
        this.getScreenListByType('page-benefits-welcomepack', 'P. beneficios'),
        this.getScreenListByType('page-flex', 'P. Ripley puntos')
      ]).then(() => this.isLoading = false)
        .catch((err) => {
          this.isLoading = false;
          console.log(`Error: \n${err}`);
        });
    }

    tabChanged(tabEvent: MatTabChangeEvent) {
      this.tabSelected = tabEvent.index;
    }
    public setPriorityOnWelcomepack(element: any) {
      this.modifyingCampaign = true;
      const campaignData = { priority: element.priority };
      this.updateWelcomepack(element, campaignData);
    }

    public updateWelcomepack(campaign, campaignData: any) {
      this.campaignsEngineService.updateCampaign(campaign.id, campaignData, campaign.type)
        .then(() => {
          this.getWelcomepackList(campaign.type);
        })
        .catch(() => {
          this.getWelcomepackList(campaign.type);
        });
    }

    async getWelcomepackList(type: CampaignType) {
      try {
        this.modifyingCampaign = false;
        const welcomeCampaigns = await this.campaignsEngineService.getCampaignWithStats(type);
        const welcomepacks = welcomeCampaigns.filter(welcomeCampaign => !welcomeCampaign.minime);
        const on = welcomepacks.filter((c) => c.activePWA).sort((a, b) => (a.priority > b.priority) ? 1 : -1);
        const off = welcomepacks.filter((c) => !c.activePWA).sort((a, b) => (a.priority > b.priority) ? 1 : -1);
        this.dataSources[type].data = on.concat(off);
      } catch (error) {
        console.log(`Error geting welcomepacksStats: ${error}`);
      }
    }

    public async getScreenListByType(type: TemplateType, dataSourceType: string) {
      const screens = await this.campaignsEngineService.getScreensByTemplate(type);
      this.dataSources[dataSourceType].data = screens;
    }

    public editScreen(screen, copy = false) {
      let navigationExtras: NavigationExtras;
      const {id, template }: ICampaignScreen = screen;
      if (copy) {
        navigationExtras = { queryParams: { copyId: id } };
      } else {
        navigationExtras = { queryParams: { id } };
      }
      switch (template) {
      case 'page-cards-welcomepack':
        this.router.navigate(['/new-cards-screen'], navigationExtras);
        break;
      case 'page-benefits-welcomepack':
        this.router.navigate(['/new-benefit-screen'], navigationExtras);
        break;
      case 'page-flex':
        this.router.navigate(['/new-ripley-points-screen'], navigationExtras);
        break;
      default:
        console.error('Edit page for', template, 'does not exist');
        break;
      }
    }

    public toggleChange(element: any, control: 'active' | 'activePWA') {
      this.modifyingCampaign = true;
      const fieldToModify = { [control]: !element[control] };
      this.updateWelcomepack(element, fieldToModify);
    }

    public copyScreen(screen) {
      this.modalDialogService.openModal('copyConfirmScreen')
        .then(btnPressed => {
          if (btnPressed === 'right') {
            this.editScreen(screen, true);
          }
        });
    }

    public applyFilter(filterValue: string) {
      this.dataSources['welcome'].filter = filterValue.trim().toLowerCase();
      this.dataSources['P. productos'].filter = filterValue.trim().toLowerCase();
      this.dataSources['P. beneficios'].filter = filterValue.trim().toLowerCase();
      this.dataSources['P. Ripley puntos'].filter = filterValue.trim().toLowerCase();
    }

    public editWelcomepack(element: any, copy = false) {
      let navigationExtras: NavigationExtras;
      if (copy) {
        navigationExtras = { queryParams: { copyId: element.id } };
      } else {
        navigationExtras = { queryParams: { id: element.id } };
      }
      if (element.type === 'welcome' && !element.minime) {
        const url = copy ? '/new-welcomepack-campaign' : '/edit-welcomepack-campaign';
        this.router.navigate([url], navigationExtras);
      } else {
        console.error('Edit page for', element.type, 'does not exist');
      }
    }

    public copyWelcomepack(campaign: any) {
      this.modifyingCampaign = true;
      this.modalDialogService.openModal('copyConfirmCampaign')
        .then(btnPressed => {
          if (btnPressed === 'right') {
            this.modifyingCampaign = false;
            this.editWelcomepack(campaign, true);
          } else {
            this.modifyingCampaign = false;
          }
        });
    }

    public async downloadCounters(campaign: any, counter: 'views' | 'goals') {
      this.downloading = true;
      this.modifyingCampaign = true;
      await this.campaignsEngineService.downloadCounters(campaign.type, campaign.id, counter);
      this.downloading = false;
      this.modifyingCampaign = false;
    }
}
