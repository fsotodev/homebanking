import { ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import { AfterViewInit, Component, OnInit} from '@angular/core';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CampaignsEngineService } from '@apps/services/campaigns-engine.service';
import { CampaignType } from '@apps/models/types/types';
import { TypeInput } from '@apps/shared/utils/constants';

@Component({
  selector: 'app-list-campaigns',
  templateUrl: './list-campaigns.component.html',
  styleUrls: ['./list-campaigns.component.scss']
})
export class ListCampaignsComponent implements OnInit, AfterViewInit {
  public filterStr: string;
  public isLoading = true;
  public modifyingCampaign = false;
  public dataSources = {
    slider: new MatTableDataSource(),
    welcome: new MatTableDataSource(),
    avsav: new MatTableDataSource(),
    avsavSimulation: new MatTableDataSource(),
    dashboard: new MatTableDataSource(),
    ccSimulation: new MatTableDataSource()
  };
  public tabsIterator = [
    'slider',
    'welcome',
    'avsav',
    'avsavSimulation',
    'dashboard',
    'ccSimulation'
  ];
  public displayedColumns = {
    slider: [
      'priority',
      'id',
      // 'totalUsers',
      'views',
      'goals',
      'effectiveness',
      // 'percentageGoals',
      'statusTogglePWA',
      'actions',
    ],
    welcome: [
      'priority',
      'id',
      'minime',
      // 'totalUsers',
      'withButton',
      'views',
      'goals',
      'effectiveness',
      // 'percentageViews',
      // 'percentageGoals',
      'statusTogglePWA',
      'actions',
    ],
    avsav: [
      'priority',
      'id',
      // 'totalUsers',
      // 'views',
      // 'goals',
      // 'percentageViews',
      // 'percentageGoals',
      'statusTogglePWA',
      'actions',
    ],
    avsavSimulation: [
      'priority',
      'id',
      // 'totalUsers',
      // 'views',
      // 'goals',
      // 'percentageViews',
      // 'percentageGoals',
      'statusTogglePWA',
      'actions',
    ],
    dashboard: [
      'priority',
      'id',
      'statusTogglePWA',
      'actions',
    ],
    ccSimulation: [
      'priority',
      'id',
      'statusTogglePWA',
      'actions',
    ]
  };
  public tabSelected = 0;
  public downloading = false;

  private CampaignTypeNavigator = {
    slider: (nav: any, minime: any) => {
      this.router.navigate(['/new-slider-campaign'], nav);
    },
    avsav: (nav: any, minime: any) => {
      this.router.navigate(['/new-avsav-campaign'], nav);
    },
    avsavSimulation: (nav: any, minime: any) => {
      this.router.navigate(['/new-credit-sim-campaign'], nav);
    },
    welcome: (nav: any, minime: any) => {
      if (minime) {
        this.router.navigate(['/new-welcome-campaign'], nav);
        return;
      }
      this.router.navigate(['/new-welcomepack-campaign'], nav);
    },
    dashboard: (nav: any, minime: any) => {
      this.router.navigate(['/new-dashboard-campaign'], nav);
    },
    ccSimulation: (nav: any, minime: any) => {
      this.router.navigate(['/new-credit-sim-campaign'], nav);
    }
  };
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private campaignsEngineService: CampaignsEngineService,
    private modalDialogService: ModalDialogService
  ) { }

  ngAfterViewInit(): void {
    this.route.fragment.subscribe((fragment) => {
      const findIndexTab = this.tabsIterator.findIndex((tab) => tab === fragment);
      if (fragment && findIndexTab) {
        this.tabSelected = findIndexTab;
      }
    });
  }

  ngOnInit() {
    this.isLoading = true;
    Promise.all([
      this.getCampaignList('slider'),
      this.getCampaignList('welcome'),
      this.getCampaignList('avsav'),
      this.getCampaignList('avsavSimulation'),
      this.getCampaignList('dashboard'),
    ])
      .then(() => this.isLoading = false)
      .catch((err) => {
        this.isLoading = false;
        console.error('Error', err);
      });
  }

  tabChanged(tabEvent: MatTabChangeEvent) {
    this.tabSelected = tabEvent.index;
  }

  public editCampaign(element: any, copy = false): void {
    let navigationExtras: NavigationExtras;
    if (copy) {
      navigationExtras = { queryParams: { copyId: element.id, type: element.type } };
    } else {
      navigationExtras = { queryParams: { id: element.id, type: element.type } };
    }

    this.CampaignTypeNavigator[element.type](navigationExtras, element.minime);
  }

  public setPriorityOnCampaign(element: any) {
    this.modifyingCampaign = true;
    this.updateCampaign(element, element);
  }

  public toggleChange(element: any, control: 'active' | 'activePWA') {
    this.modifyingCampaign = true;
    const fieldToModify = { [control]: !element[control] };
    this.updateCampaign(element, fieldToModify);
  }

  public updateCampaign(campaign, campaignData: any) {
    this.campaignsEngineService.updateCampaign(campaign.id, campaignData, campaign.type)
      .then(() => {
        this.getCampaignList(campaign.type);
      })
      .catch(() => {
        this.getCampaignList(campaign.type);
      });
  }

  public async getCampaignList(type: CampaignType, showDeleted = false) {
    this.modifyingCampaign = false;
    let campaigns = await this.campaignsEngineService.getCampaignWithStats(type);
    if (!showDeleted) {
      campaigns = campaigns.filter((c) => c.status !== 'deleted');
    }

    const on = campaigns.filter((c) => c.activePWA).sort((a, b) => a.priority - b.priority);
    const off = campaigns.filter((c) => !c.activePWA).sort((a, b) => a.priority - b.priority);

    const filterOfferType = [...on, ...off];
    let avsavSimulation;
    let consumerSimulation;
    if (type === 'avsavSimulation') {
      avsavSimulation = filterOfferType.filter((c) => c.offerType !== 'cc');
      consumerSimulation = filterOfferType.filter((c) => c.offerType === 'cc');
      consumerSimulation.forEach((c) => c.type = 'ccSimulation');
      this.dataSources['avsavSimulation'].data = avsavSimulation;
      this.dataSources['ccSimulation'].data = consumerSimulation;
    } else {
      this.dataSources[type].data = filterOfferType;
    }

  }

  public applyFilter(filterValue: string) {
    this.dataSources['slider'].filter = filterValue.trim().toLowerCase();
    this.dataSources['welcome'].filter = filterValue.trim().toLowerCase();
    this.dataSources['avsav'].filter = filterValue.trim().toLowerCase();
    this.dataSources['avsavSimulation'].filter = filterValue.trim().toLowerCase();
    this.dataSources['dashboard'].filter = filterValue.trim().toLowerCase();
  }

  public copyCampaign(campaign: any) {
    this.modifyingCampaign = true;
    this.modalDialogService.openModal('copyConfirmCampaign')
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.modifyingCampaign = false;
          this.editCampaign(campaign, true);
        } else {
          this.modifyingCampaign = false;
        }
      });
  }

  public columnGoalsName(type: CampaignType) {
    return type === 'welcome' ? 'Goals' : 'Clicks';
  }

  public showBCopyEditButtons(campaign: any) {
    return campaign.type === 'slider' ||
      campaign.type === 'welcome' ||
      campaign.type === 'welcome' ||
      campaign.type === 'avsavSimulation' ||
      campaign.type === 'avsav' ||
      campaign.type === 'dashboard' ||
      campaign.type === 'ccSimulation';
  }

  public showDownloadButton(type: CampaignType) {
    return type === 'slider' || type === 'dashboard' ||
    type === 'welcome' || type === 'avsavSimulation' || type === 'avsav';
  }

  public async downloadCounters(campaign: any, counter: 'views' | 'goals') {
    this.downloading = true;
    this.modifyingCampaign = true;
    await this.campaignsEngineService.downloadCounters(campaign.type, campaign.id, counter);
    this.downloading = false;
    this.modifyingCampaign = false;
  }

  public getColumnsByType(type: string) {
    const confColumns = { slider: [/*'selector',*/ 'priority', 'name', 'views', 'goals', 'ctr', 'activePWA', 'actions'],
      welcome: [/*'selector', */'priority', 'name','minime', 'withbutton', 'views', 'goals', 'ctr', 'activePWA', 'actions']};
    return confColumns[type];
  }

  public getDefinitionColsByType(type: string) {
    const confCols = { slider: [
      {
        columnDef: 'selector',
        header: 'selector',
        type: TypeInput.matCheckbox,
        cell: (element: any) => {
        },
      },
      {
        columnDef: 'priority',
        header: 'Prioridad',
        type: TypeInput.matInput,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        style: {'max-width': '45px', 'text-align': 'center'},
        cell: (element: any) => `${element.priority}`,
      },
      {
        columnDef: 'name',
        header: 'Nombre',
        cell: (element: any) => `${element.name}`,
      },
      {
        columnDef: 'views',
        header: 'Views',
        cell: (element: any) => `${element.views ? element.views : 0}`,
      },
      {
        columnDef: 'goals',
        header: 'Goals',
        cell: (element: any) => `${element.goals ? element.goals : 0}`,
      },
      {
        columnDef: 'activePWA',
        header: 'Activo en PWA',
        type: TypeInput.matSlideToggle,
        cell: (element: any) => `${element.activePWA}`,
      },
      {
        columnDef: 'ctr',
        header: '%CTR',
        cell: (element: any) => `${element.ctr ? element.ctr : '0.00%'}`,
      },
      {
        columnDef: 'actions',
        header: ' ',
        type: TypeInput.actions,
        cell: (element: any) => element.actions
      }
    ], welcome: [{
      columnDef: 'selector',
      header: 'selector',
      type: TypeInput.matCheckbox,
      cell: (element: any) => {
      },
    },
    {
      columnDef: 'priority',
      header: 'Prioridad',
      type: TypeInput.matInput,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      style: {'max-width': '45px', 'text-align': 'center'},
      cell: (element: any) => `${element.priority}`,
    },
    {
      columnDef: 'name',
      header: 'Nombre',
      cell: (element: any) => `${element.name}`,
    },
    {
      columnDef: 'minime',
      header: 'Minime',
      type: TypeInput.matSlideToggle,
      cell: (element: any) => `${element.minime}`,
    },
    {
      columnDef: 'withbutton',
      header: 'Con Botón',
      type: TypeInput.matSlideToggle,
      cell: (element: any) => `${element.withButton}`,
    },
    {
      columnDef: 'views',
      header: 'Views',
      cell: (element: any) => `${element.views ? element.views : 0}`,
    },
    {
      columnDef: 'goals',
      header: 'Goals',
      cell: (element: any) => `${element.goals ? element.goals : 0}`,
    },
    {
      columnDef: 'activePWA',
      header: 'Activo en PWA',
      type: TypeInput.matSlideToggle,
      cell: (element: any) => `${element.activePWA}`,
    },
    {
      columnDef: 'ctr',
      header: '%CTR',
      cell: (element: any) => `${element.ctr ? element.ctr : '0.00%'}`,
    },
    {
      columnDef: 'actions',
      header: ' ',
      type: TypeInput.actions,
      cell: (element: any) => element.actions
    }
    ]};
    return confCols[type];
  }

  public getDatasourceByType(type: string) {
    const dataCamp = this.dataSources[type].filteredData;
    return dataCamp.map((row, index, arr)=> ({ allData: row, name: row.id,
      priority: row.priority,
      activePWA: row.activePWA,
      minime: row.minime,
      withButton: row.withButton,
      views: row.stats.count_users_with_views,
      goals: row.stats.count_users_with_goals,
      ctr: row.stats.effectiveness,
      actions : [
        { nameButton: 'Editar', redirection: () => this.editCampaign(row, false) },
        { nameButton: 'Duplicar', redirection: () => this.editCampaign(row, true) },
        { nameButton: '•••', redirection: () => {}, actions: [
          { nameButton: 'Views', redirection: () => this.downloadCounters(row, 'views') },
          { nameButton: 'Goals', redirection: () => this.downloadCounters(row, 'goals') }
        ] }
      ]
    }));
  }

  public actionSelected($event) {
    return $event.button.redirection();
  }

  public updatingRow($event, type: string) {
    const objUpdate = {activePWA: () => this.toggleChange($event.data.allData, $event.column.columnDef),
      priority: () => {
        $event.data.allData.priority = parseInt($event.newValue, 10);
        this.setPriorityOnCampaign($event.data.allData);
      },
      minime: () => {
        $event.data.allData.minime = $event.newValue;
        this.updateCampaign($event.data.allData, $event.data.allData);
      },
      withbutton: () => {
        $event.data.allData.withButton = $event.newValue;
        this.updateCampaign($event.data.allData, $event.data.allData);
      }
    };
    if (!objUpdate[$event.column.columnDef]) {
      return;
    }
    objUpdate[$event.column.columnDef]();
  }

  public getEnabledDeleteByType(type: string) {
    const objEnabled = { slider: false, welcome: false};
    return objEnabled[type] || false;
  }
}
