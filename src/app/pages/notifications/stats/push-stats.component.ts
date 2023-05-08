import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FirebaseService } from '@apps/services/firebase.service';
import { PushStats } from '@apps/models/campaign';
import { PushCampaignsService } from '@apps/services/push-campaigns.service';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { UtilsService } from '@apps/services/utils.service';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ExportService } from '@apps/services/export.service';

@Component({
  selector: 'app-push-stats',
  templateUrl: './push-stats.component.html',
  styleUrls: ['./push-stats.component.scss']
})
export class PushStatsComponent implements OnInit {
  @ViewChild('table', {static: false}) table: MatTable<any>;
  public tabNames = {
    marketing: 'marketing',
    remarketing: 'remarketing',
    redeem: 'canje',
    transactional: 'transaccional',
  };
  public simulationTypes = ['advance', 'superAdvance'];
  public simulationNames = {
    advance: 'Avances',
    superAdvance: 'Super Avances',
  };
  public statusLimit = 1;
  public isLoading = true;
  public isLoadingData = false;
  public dataSources = {
    marketing: new MatTableDataSource<any>(),
    transactional: new MatTableDataSource<any>(),
    redeem: new MatTableDataSource<any>(),
    remarketing: new MatTableDataSource<any>(),
  };
  public tabsIterator = [
    'marketing',
    'transactional',
    'redeem',
    'remarketing',
  ];
  public limitSelectForStatus = Array(12).fill(0).map((x, i) => i + 1);
  public displayedColumns = {
    marketing: [
      'id',
      'mktName',
      'title',
      'description',
      'sentDate',
      'totalRuts',
      'totalTokens',
      'totalUniqueRut',
      'ratio',
      'actions',
    ],
    transactional: [
      'type',
      'description',
      'sent',
      'readFromSystem',
      'readFromTray',
      'actions',
    ],
    redeem: [
      'id',
      'category',
      'name',
      'sent',
      'readFromSystem',
      'readFromTray',
      'actions',
    ],
    remarketing: [
      'type',
      'sent',
      'readFromSystem',
      'readFromTray',
      'actions',
    ],
  };
  public tabSelected = 0;
  public filterForms = {};
  public addForms = {};
  public maxBatchLimit = 500;
  public fileDelimiter = ';';
  public campaignToAdd: string;
  public errorMessage: string;
  public highlightedId: string;

  constructor(
    private firebaseService: FirebaseService,
    private pushService: PushCampaignsService,
    private utilsService: UtilsService,
    private exportService: ExportService,
  ) { }

  async ngOnInit() {
    this.isLoading = true;
    for (const type of this.tabsIterator) {
      const filterControl = {};
      filterControl[type] = new FormControl();
      const addControl = {};
      addControl[type] = new FormControl();
      this.filterForms[type] = new FormGroup(filterControl);
      this.addForms[type] = new FormGroup(addControl);
      this.filterForms[type].get(type).valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
      ).subscribe((filter) => {
        if (type === 'marketing') {
          this.dataSources[type].filterPredicate = (data, text) =>
            data.campaignId.includes(text) ||
            data.name.toLowerCase().includes(text.toLowerCase()) ||
            JSON.stringify(data.options).toLowerCase().includes(text.toLowerCase());
        } else if (type === 'transactional') {
          this.dataSources[type].filterPredicate = (data, text) => JSON.stringify(data.options).toLowerCase().includes(text.toLowerCase());
        }
        this.dataSources[type].filter = filter.trim();
      });
      this.addForms[type].get(type).valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
      ).subscribe(async (field) => {
        if (field) {
          await this.getCampaignByField(field);
        }
      });
    }
    await Promise.all([
      this.getMarketingCampaigns(5),
      this.getProducts(),
    ]).then(async () => {
      await Promise.all([
        this.getTransactionalTypes(),
        this.loadRemarketingTypes(),
      ]);
    }).catch((err) => {
      this.isLoading = false;
      console.error('Error', err);
    }).finally(() => this.isLoading = false );
  }

  public tabChanged(tabEvent: MatTabChangeEvent) {
    this.tabSelected = tabEvent.index;
  }

  public valueToShow(value: string | number) {
    if (value === 0 || (Number(value) && isFinite(Number(value)))) {
      return value;
    }
    return '-';
  }

  public isDownloadable(campaign): boolean {
    return campaign.type === 'marketing' || campaign.type === 'remarketing';
  }

  public async showData(campaign: any) {
    campaign.downloading = true;
    if (campaign.type === 'redeem') {
      return this.showRedeemData(campaign);
    } else if (campaign.type === 'transactional') {
      return this.showTransactionalData(campaign);
    } else {
      campaign.downloading = false;
    }
  }

  public async downloadData(campaign: any, type: string) {
    campaign.downloading = true;
    if (campaign.type === 'marketing') {
      return this.downloadMarketingData(campaign, type);
    } else if (campaign.type === 'remarketing') {
      return this.downloadSimulationsData(campaign, type);
    } else if (campaign.type === 'redeem') {
      return this.showRedeemData(campaign);
    } else if (campaign.type === 'transactional') {
      return this.showTransactionalData(campaign);
    } else {
      campaign.downloading = false;
    }
  }

  public async downloadMarketingData(campaign, type: string) {
    let hasContent = false;
    let fileContent;
    if (type === 'csv') {
      ({ hasContent, content: fileContent } = this.parseMarketingDataCSV(campaign));
    } else if (type === 'xlsx') {
      ({ hasContent, content: fileContent } = this.parseMarketingDataXLSX(campaign));
    }
    const filename = `Desglose notificaciones Campaña ${campaign.campaignId} ${campaign.sendDateFilename}`;
    if (hasContent) {
      if (type === 'csv') {
        this.save(fileContent, filename);
      } else if (type === 'xlsx') {
        this.exportService.exportToExcel(fileContent, filename);
      }
    }
    campaign.downloading = false;
  }

  public async downloadSimulationsData(campaign: any, type: string) {
    let hasContent = false;
    let fileContent;
    await this.getRemarketingData(campaign);
    if (type === 'csv') {
      ({ hasContent, content: fileContent } = this.parseSimulationsDataCSV(campaign));
    } else if (type === 'xlsx') {
      ({ hasContent, content: fileContent } = this.parseSimulationsDataXLSX(campaign));
    }
    const filename = `Desglose notificaciones para simulaciones de ${campaign.id}`;
    if (hasContent) {
      if (type === 'csv') {
        this.save(fileContent, filename);
      } else if (type === 'xlsx') {
        this.exportService.exportToExcel(fileContent, filename);
      }
    }
    campaign.downloading = false;
  }

  public async showRedeemData(product) {
    await this.getRedeemData(product);
    product.downloading = false;
  }

  public async showTransactionalData(campaign) {
    await this.getTransactionalData(campaign);
    campaign.downloading = false;
  }

  public async getCampaignsWithDates(type: string, id: string) {
    const campaigns = await this.firebaseService.getFirebaseCollection(`pushStats/${type}/${id}`).ref
      .orderBy('sendDate', 'desc').limit(this.statusLimit).get();
    return campaigns.docs.map(doc => {
      const data = doc.data();
      data['ref'] = doc.ref;
      return data;
    });
  }

  public async getMarketingCampaigns(limit?: number) {
    const totalCampaigns = [];
    const campaigns = await this.pushService.getPushCampaigns(limit);
    await Promise.all(campaigns.map(async (campaign) => {
      const subCampaigns = await this.getCampaignsWithDates('marketing', campaign.id);
      for (const subCampaign of subCampaigns) {
        subCampaign.sendDate = subCampaign.sendDate.toDate();
        subCampaign.sendDateToShow = moment(subCampaign.sendDate).format('DD/MM/YYYY HH:mm:ss') || '';
        totalCampaigns.push({...campaign, ...subCampaign, type: 'marketing', downloading: false});
      }
    })
    );
    this.dataSources['marketing'].data = totalCampaigns.sort((a, b) => {
      if (a.campaignId === b.campaignId) {
        return b.sendDate - a.sendDate;
      }
      return a.campaignId.localeCompare(b.campaignId);
    });
    await this.getMarketingNotifications(totalCampaigns);
  }

  public async reloadMarketingCampaigns() {
    this.isLoading = true;
    await this.getMarketingCampaigns(5);
    this.isLoading = false;
  }

  public async getCampaignByField(field: string) {
    this.isLoadingData = true;
    if (field) {
      const isAlreadyLoaded = this.dataSources['marketing'].data.find((elem) => elem.name === field || elem.campaignId === field);
      if (isAlreadyLoaded) {
        this.errorMessage = 'Campaña ya cargada';
        this.isLoadingData = false;
        return;
      }

      let campaign = await this.pushService.getCampaignByName(field);
      if (!campaign) {
        campaign = await this.pushService.getCampaignById(field);
      }
      if (campaign && !isAlreadyLoaded) {
        const totalCampaigns = [];
        const subCampaigns = await this.getCampaignsWithDates('marketing', campaign.id);
        this.highlightedId = campaign.id;
        for (const subCampaign of subCampaigns) {
          subCampaign.sendDate = subCampaign.sendDate.toDate();
          subCampaign.sendDateToShow = moment(subCampaign.sendDate).format('DD/MM/YYYY HH:mm:ss') || '';
          totalCampaigns.push({...campaign, ...subCampaign, type: 'marketing', downloading: false});
        }
        totalCampaigns.sort((a, b) => {
          if (a.campaignId === b.campaignId) {
            return b.sendDate - a.sendDate;
          }
          return a.campaignId.localeCompare(b.campaignId);
        });
        this.errorMessage = '';
        this.dataSources['marketing'].data = totalCampaigns.concat(this.dataSources['marketing'].data);
        await this.getMarketingNotifications(totalCampaigns);
      } else if (!campaign) {
        this.errorMessage = 'Campaña no encontrada';
      }
    } else {
      this.errorMessage = '';
    }
    this.isLoadingData = false;
  }

  public async getNotificationsStats(campaign: any) {
    const rutsSent = [];
    const usersSent = await campaign.ref.collection('users').get();
    const usersData = usersSent.docs.map(doc => {
      rutsSent.push(doc.id);
      return doc.data();
    });
    const tapsFromSystem = usersData.reduce((a, b) => a + b.tappedFromSystem, 0);
    const tapsFromTray = usersData.reduce((a, b) => a + b.tappedFromTray, 0);
    const tapsFromSystemOrTray = usersData.reduce((a, b) => a + (b.tappedFromTray || b.tappedFromSystem), 0);
    const usersTappedFromSystem = usersData.filter(user => user.tappedFromSystem).map(elem => ({
      rut: elem.rut,
      dateTapped: moment(elem.dateTappedFromSystem.toDate()).format('DD/MM/YYYY HH:mm:ss')
    }));
    const usersTappedFromTray = usersData.filter(user => user.tappedFromTray).map(elem => ({
      rut: elem.rut,
      dateTapped: moment(elem.dateTappedFromTray.toDate()).format('DD/MM/YYYY HH:mm:ss')
    }));

    return {
      usersSent: rutsSent,
      totalPushSent: campaign.totalSent,
      tapsFromSystem,
      tapsFromTray,
      tapsFromSystemOrTray,
      usersTappedFromSystem,
      usersTappedFromTray,
    } as PushStats;
  }

  public async getMarketingNotifications(campaigns) {
    await Promise.all(campaigns.map(async (campaign) => {
      await this.getMarketingNotificationsByCampaign(campaign);
    }));
  }

  public async getMarketingNotificationsByCampaign(campaign) {
    const pushStats = await this.getNotificationsStats(campaign) as PushStats;
    const index = this.dataSources['marketing'].data.findIndex((c) =>
      campaign.id === c.id && campaign.campaignId === c.campaignId);
    if (pushStats) {
      this.dataSources['marketing'].data[index].sendDateFilename = moment(campaign.sendDate).format('DD-MM-YYYY HH-mm-ss') || '';
      this.dataSources['marketing'].data[index].sendDate = moment(campaign.sendDate).format('DD/MM/YYYY HH:mm:ss') || '';
      this.dataSources['marketing'].data[index].totalPushSent = pushStats.totalPushSent || 0;
      this.dataSources['marketing'].data[index].usersSent = pushStats.usersSent || [];
      this.dataSources['marketing'].data[index].totalUsersSent = pushStats.usersSent.length || 0;
      this.dataSources['marketing'].data[index].tapsFromSystem = pushStats.tapsFromSystem || 0;
      this.dataSources['marketing'].data[index].usersTappedFromSystem = pushStats.usersTappedFromSystem || [];
      this.dataSources['marketing'].data[index].tapsFromTray = pushStats.tapsFromTray || 0;
      this.dataSources['marketing'].data[index].usersTappedFromTray = pushStats.usersTappedFromTray || [];
      this.dataSources['marketing'].data[index].tapsFromSystemOrTray = pushStats.tapsFromSystemOrTray || 0;
      this.dataSources['marketing'].data[index].loadedData = true;
    }
  }

  public async getTransactionalTypes() {
    const pushTypesData = [];
    const pushTypes = await this.firebaseService.getFirebaseCollection('pushTransactionalConfig').ref.get();
    for (const type of pushTypes.docs) {
      const data = type.data();
      if (data.enabled) {
        pushTypesData.push({
          id: type.get('typeId'),
          options: {pushDescription: type.get('name')},
          type: 'transactional',
          ...data,
        });
      }
    }
    this.dataSources['transactional'].data = pushTypesData;
  }

  public async getTransactionalData(campaign) {
    if (campaign.enabled) {
      const index = this.dataSources['transactional'].data.findIndex((c) => campaign.typeId === c.typeId);
      const cumulativeData = await this.firebaseService.getFirebaseCollection(`pushStats/transactional/${campaign.typeId}`)
        .doc('cumulative').ref.get();
      const totalPushSent = cumulativeData.get('totalSent');
      let totalReadFromTray = 0;
      let totalReadFromSystem = 0;
      const statsUsers = await this.firebaseService.getFirebaseCollection(`pushStats/transactional/${campaign.typeId}`).ref
        .where('notificationGroup', '==', campaign.typeId).get();
      let count = 0;
      while (count < statsUsers.size) {
        await Promise.all(statsUsers.docs.slice(count, count + this.maxBatchLimit).map(async user => {
          const userNotifications = await this.firebaseService
            .getFirebaseCollection(`pushStats/transactional/${campaign.typeId}/${user.id}/dates`).ref.get();
          const userData = userNotifications.docs.map(doc => doc.data());
          totalReadFromSystem += userData.reduce((a, b) => a + b.tappedFromSystem, 0);
          totalReadFromTray += userData.reduce((a, b) => a + b.tappedFromTray, 0);
        }));
        count += this.maxBatchLimit;
      }
      this.dataSources['transactional'].data[index].totalPushSent = totalPushSent || 0;
      this.dataSources['transactional'].data[index].tapsFromSystem = totalReadFromSystem || 0;
      this.dataSources['transactional'].data[index].tapsFromTray = totalReadFromTray || 0;
      this.dataSources['transactional'].data[index].loadedData = true;
    }
  }

  public async getProducts(limit?: number) {
    const products = [];
    let productData;
    if (limit) {
      productData = await this.firebaseService.getFirebaseCollection('products').ref.limit(limit).get();
    } else {
      productData = await this.firebaseService.getFirebaseCollection('products').ref.get();
    }
    await Promise.all(productData.docs.map(async product => {
      const docData = product.data();
      const productCategory = await this.firebaseService.getFirebaseCollection('productCategories').ref
        .where('categoryId', '==', docData.category).get();
      let categoryName = '';
      if (productCategory.docs.length) {
        categoryName = productCategory.docs[0].get('name');
      }
      products.push({
        campaignId: product.id,
        categoryName,
        ...docData,
        type: 'redeem',
      });
    }));
    this.dataSources['redeem'].data = products;
  }

  public async getRedeemData(product) {
    const cumulativeData = await this.firebaseService.getFirebaseCollection(`pushStats/redeem/${product.campaignId}`)
      .doc('cumulative').ref.get();
    const index = this.dataSources['redeem'].data.findIndex((c) => product.campaignId === c.campaignId);
    if (cumulativeData.exists) {
      const totalPushSent = cumulativeData.get('totalSent');
      let totalReadFromTray = 0;
      let totalReadFromSystem = 0;
      const statsUsers = await this.firebaseService.getFirebaseCollection(`pushStats/redeem/${product.id}`).ref
        .where('id', '==', product.campaignId).get();
      let count = 0;
      while (count < statsUsers.size) {
        await Promise.all(statsUsers.docs.slice(count, count + this.maxBatchLimit).map(async user => {
          const userNotifications = await this.firebaseService
            .getFirebaseCollection(`pushStats/redeem/${product.id}/${user.id}/dates`).ref.get();
          const userData = userNotifications.docs.map(doc => doc.data());
          totalReadFromSystem += userData.reduce((a, b) => a + b.tappedFromSystem, 0);
          totalReadFromTray += userData.reduce((a, b) => a + b.tappedFromTray, 0);
        }));
        count += this.maxBatchLimit;
      }
      this.dataSources['redeem'].data[index].totalPushSent = totalPushSent;
      this.dataSources['redeem'].data[index].tapsFromSystem = totalReadFromSystem;
      this.dataSources['redeem'].data[index].tapsFromTray = totalReadFromTray;
    } else {
      this.dataSources['redeem'].data[index].totalPushSent = 0;
      this.dataSources['redeem'].data[index].tapsFromSystem = 0;
      this.dataSources['redeem'].data[index].tapsFromTray = 0;
    }
    this.dataSources['redeem'].data[index].loadedData = true;
  }

  public async loadRemarketingTypes() {
    const types = [];
    for (const type of this.simulationTypes) {
      types.push({
        simType: type,
        id: this.simulationNames[type],
        type: 'remarketing',
      });
    }
    this.dataSources['remarketing'].data = types;
  }

  public async getRemarketingData(campaign) {
    const index = this.dataSources['remarketing'].data.findIndex((c) => campaign.simType === c.simType);
    const simType = campaign.simType;
    const simulationNotifications = [];
    const cumulativeData = await this.firebaseService.getFirebaseCollection(`pushStats/remarketing/${simType}`)
      .doc('cumulative').ref.get();
    const totalPushSent = cumulativeData.get('totalSent');
    let totalReadFromTray = 0;
    let totalReadFromSystem = 0;
    const statsUsers = await this.firebaseService.getFirebaseCollection(`pushStats/remarketing/${simType}`).ref
      .where('simulationType', '==', simType).get();
    let count = 0;
    while (count < statsUsers.size) {
      await Promise.all(statsUsers.docs.slice(count, count + this.maxBatchLimit).map(async user => {
        const userNotifications = await this.firebaseService
          .getFirebaseCollection(`pushStats/remarketing/${simType}/${user.id}/dates`).ref.get();
        const userData = userNotifications.docs.map(doc => doc.data());
        simulationNotifications.push(...userData);
        totalReadFromSystem += userData.reduce((a, b) => a + b['tappedFromSystem'], 0);
        totalReadFromTray += userData.reduce((a, b) => a + b['tappedFromTray'], 0);
      }));
      count += this.maxBatchLimit;
    }
    this.dataSources['remarketing'].data[index].simulationNotifications = simulationNotifications || [];
    this.dataSources['remarketing'].data[index].totalPushSent = totalPushSent || 0;
    this.dataSources['remarketing'].data[index].tapsFromSystem = totalReadFromSystem || 0;
    this.dataSources['remarketing'].data[index].tapsFromTray = totalReadFromTray || 0;
    this.dataSources['remarketing'].data[index].loadedData = true;
  }

  public toPercent(amount: any) {
    return amount.toFixed(2);
  }

  getDate(date: any) {
    if (!date) {
      return 'Invalid Date';
    }
    if (date._seconds) {
      return this.firebaseService.convertTimestampToDate(date);
    }
    return date.toDate();
  }

  private parseMarketingDataCSV(campaign: any): { hasContent: boolean; content: string } {
    const header = 'ID campaña; Fecha envío; RUT; Click en Sistema; Fecha click Sistema; Click en Bandeja; Fecha click Bandeja';
    let fileContent = '';
    let hasContent = false;
    for (const rut of campaign.usersSent) {
      hasContent = true;
      const row = [];
      row.push(campaign.campaignId);
      row.push(campaign.sendDate);
      row.push(rut);
      if (campaign.usersTappedFromSystem.length) {
        const systemTap = campaign.usersTappedFromSystem.find(user => user.rut === rut);
        if (systemTap) {
          row.push('SI', systemTap.dateTapped);
        } else {
          row.push('NO', '');
        }
      } else {
        row.push('NO', '');
      }
      if (campaign.usersTappedFromTray.length) {
        const trayTap = campaign.usersTappedFromTray.find(user => user.rut === rut);
        if (trayTap) {
          row.push('SI', trayTap.dateTapped);
        } else {
          row.push('NO', '');
        }
      } else {
        row.push('NO', '');
      }
      fileContent += row.join(this.fileDelimiter) + '\n';
    }
    return { hasContent, content: header + '\n' + fileContent };
  }

  private parseMarketingDataXLSX(campaign): { hasContent: boolean; content: any[] } {
    const columnHeaders =
      ['ID campaña', 'Fecha envío', 'RUT', 'Click en Sistema', 'Fecha click Sistema', 'Click en Bandeja', 'Fecha click Bandeja'];
    const fileContent = [];
    let hasContent = false;
    for (const rut of campaign.usersSent) {
      hasContent = true;
      const row = {};
      row[columnHeaders[0]] = campaign.campaignId;
      row[columnHeaders[1]] = campaign.sendDate;
      row[columnHeaders[2]] = rut;
      if (campaign.usersTappedFromSystem.length) {
        const systemTap = campaign.usersTappedFromSystem.find(user => user.rut === rut);
        if (systemTap) {
          row[columnHeaders[3]] = 'SI';
          row[columnHeaders[4]] = systemTap.dateTapped;
        } else {
          row[columnHeaders[3]] = 'NO';
          row[columnHeaders[4]] = '';
        }
      } else {
        row[columnHeaders[3]] = 'NO';
        row[columnHeaders[4]] = '';
      }
      if (campaign.usersTappedFromTray.length) {
        const trayTap = campaign.usersTappedFromTray.find(user => user.rut === rut);
        if (trayTap) {
          row[columnHeaders[5]] = 'SI';
          row[columnHeaders[6]] = trayTap.dateTapped;
        } else {
          row[columnHeaders[5]] = 'NO';
          row[columnHeaders[6]] = '';
        }
      } else {
        row[columnHeaders[5]] = 'NO';
        row[columnHeaders[6]] = '';
      }
      fileContent.push(row);
    }
    return {hasContent, content: fileContent};
  }

  private parseSimulationsDataCSV(campaign: any): { hasContent: boolean; content: string } {
    const header = 'Tipo simulacion; RUT; Fecha simulacion; Monto, Cuotas; ' +
      'Fecha envio; Click en Sistema; Fecha click Sistema; Click en Bandeja; Fecha click Bandeja;';
    const dataSortedByUser = campaign.simulationNotifications
      .sort((a, b) => this.utilsService.compare(a.user, b.user) || this.utilsService.compare(a.sendDate, b.sendDate));
    const simType = campaign.id;
    let fileContent = '';
    let hasContent = false;
    for (const elem of dataSortedByUser) {
      hasContent = true;
      const row = [simType];
      row.push(elem.user);
      row.push(moment(this.getDate(elem.simulation.simulationDate)).format('DD/MM/YYYY HH:mm:ss'));
      row.push(elem.simulation.simulationAmount);
      row.push(elem.simulation.quotas);
      row.push(moment(this.getDate(elem.sendDate)).format('DD/MM/YYYY HH:mm:ss'));
      if (elem.tappedFromSystem) {
        row.push('SI', moment(elem.dateTappedFromSystem.toDate()).format('DD/MM/YYYY HH:mm:ss'));
      } else {
        row.push('NO', '');
      }
      if (elem.tappedFromTray) {
        row.push('SI', moment(elem.dateTappedFromTray.toDate()).format('DD/MM/YYYY HH:mm:ss'));
      } else {
        row.push('NO', '');
      }
      fileContent += row.join(this.fileDelimiter) + '\n';
    }
    return { hasContent, content: header + '\n' + fileContent };
  }

  private parseSimulationsDataXLSX(campaign): { hasContent: boolean; content: any[] } {
    const columnHeaders =
      ['Tipo simulacion', 'RUT', 'RUT', 'Fecha simulacion', 'Monto, Cuotas', 'Fecha envio', 'Click en Sistema',
        'Fecha click Sistema', 'Click en Bandeja', 'Fecha click Bandeja'];
    const fileContent = [];
    let hasContent = false;
    const dataSortedByUser = campaign.simulationNotifications
      .sort((a, b) => this.utilsService.compare(a.user, b.user) || this.utilsService.compare(a.sendDate, b.sendDate));
    const simType = campaign.id;
    for (const elem of dataSortedByUser) {
      hasContent = true;
      const row = {};
      row[columnHeaders[0]] = simType;
      row[columnHeaders[1]] = elem.user;
      row[columnHeaders[2]] = moment(this.getDate(elem.simulation.simulationDate)).format('DD/MM/YYYY HH:mm:ss');
      row[columnHeaders[3]] = elem.simulation.simulationAmount;
      row[columnHeaders[4]] = elem.simulation.quotas;
      row[columnHeaders[5]] = moment(this.getDate(elem.sendDate)).format('DD/MM/YYYY HH:mm:ss');
      if (elem.tappedFromSystem) {
        row[columnHeaders[6]] = 'SI';
        row[columnHeaders[7]] = moment(elem.dateTappedFromSystem.toDate()).format('DD/MM/YYYY HH:mm:ss');
      } else {
        row[columnHeaders[6]] = 'NO';
        row[columnHeaders[7]] = '';
      }
      if (elem.tappedFromTray) {
        row[columnHeaders[8]] = 'SI';
        row[columnHeaders[9]] = moment(elem.dateTappedFromTray.toDate()).format('DD/MM/YYYY HH:mm:ss');
      } else {
        row[columnHeaders[8]] = 'NO';
        row[columnHeaders[9]] = '';
      }
      fileContent.push(row);
    }
    return {hasContent, content: fileContent};
  }

  private save(fileContent: string, filename: string) {
    const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8' });
    saveAs.saveAs(blob, filename + '.csv');
  }
}
