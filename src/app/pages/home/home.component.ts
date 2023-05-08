import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Benefit, BenefitCategory } from '../../models/benefit';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { BenefitsService } from '../../services/benefits.service';
import { ModalDialogService } from '../../services/modal-dialog.service';
import { AuthFirebaseService } from '@apps/shared/services/auth/auth-firebase.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable) benefitTable: MatTable<any>;
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.benefitsDataSource.paginator = paginator;
  }
  modifiyingBenefit = false;
  loadingData = false;
  benefitOrder = 0;
  tabSelected = 0;
  selectedTypeIndex = 0;
  displayedColumns = [
    'order',
    'periodicity',
    'title',
    'startDate',
    'statusToogle',
    'modifyOrDelete'
  ];
  hasAccess = false;
  categories: BenefitCategory[] = [];
  benefitsList: Array<Benefit> = [];
  benefitCategories = [];
  benefitsDataSource = new MatTableDataSource();
  validities: any = [];
  onlyPublished = false;
  originalTypes: any[] = [
    { id: 'monthly', ref: 'monthly' }
    ,{ id: 'novelty',ref: 'novelty'}
    ,{ id: 'opex',ref: 'productOPEX'}
    ,{ id: 'restofans',ref: 'restofan'}
    ,{ id: 'weekly',ref: 'weekly'}
    ,{ id: 'personal',ref: 'personal'}];
  filterButtonList: SegmentationOption[] = [];
  filterSelectObj: Record<string, SegmentationOption> = {};
  matSelectPlan: Record<string, string>;
  matSelectProduct: Record<string, string>;
  matSelectCategory: Record<string, string>;
  withoutSegmentation: boolean;
  selectedType: string;
  segmentationConfig: any[];
  segmentationList: any;
  constructor(
    private benefitsService: BenefitsService,
    private router: Router,
    private modalDialogService: ModalDialogService,
    private auth: AuthFirebaseService
  ) { }

  async ngOnInit() {
    await this.getBenefitsList();
    await this.configSegmentationList();
  }

  filterPredicate = (data: any, filter) => {
    const dataStr =JSON.stringify(data).toLowerCase();
    return dataStr.indexOf(filter) !== -1;
  };

  ngOnDestroy() {
  }

  //Filtra los datos actuales del data source de manera que sólo
  //muestre aquellos que esten publicados y vigentes
  onlyPublishedAndVigent(event) {
    if(event.checked) {
      this.filterPublishedAndVigent();
    } else if (Object.keys(this.filterSelectObj).length >= 1) {
      this.filterBasedOnSelectObj();
    } else {
      this.selectType(this.selectedTypeIndex, false);
      if(this.withoutSegmentation) {
        this.filterWithoutSegmentation();
      }
    }
  }

  filterPublishedAndVigent() {
    const currentBenefitsDS: Array<Benefit> = this.benefitsDataSource.data as Array<Benefit>;
    this.benefitsDataSource.data = currentBenefitsDS.filter(
      (benefit => (this.isPublished(benefit)) && (this.isVigent(benefit.newBenefit.startDate, benefit.newBenefit.endDate)))
    );
  }

  //Filtra los datos de la categoria actual para mostrar
  //sólo los beneficios sin segmentar.
  onlyWithoutSegmentation(event) {
    if (event.checked) {
      if(Object.keys(this.filterSelectObj).length > 0) {
        this.unselectAllSelectFilters();
      }
      this.filterWithoutSegmentation();
    } else {
      this.selectType(this.selectedTypeIndex, false);
    }
    if(this.onlyPublished) {
      this.filterPublishedAndVigent();
    }
  }

  filterWithoutSegmentation() {
    const currentBenefitsCategories = this.benefitCategories[this.selectedTypeIndex].benefitList as Array<any>;
    this.benefitsDataSource.data = currentBenefitsCategories.filter(
      benefit => !benefit.newBenefit.selectedSegmentation || benefit.newBenefit.selectedSegmentation === 'sinsegmentacion'
    );
  }

  reduceStringLength(matTabContent: string) {
    let checkLengthAndReduce = matTabContent.length > 32 ? (matTabContent.substring(0,31) + '...'): matTabContent;
    if (window.innerWidth < 1517) {
      checkLengthAndReduce = matTabContent.length > 25 ? (matTabContent.substring(0,24) + '...'): matTabContent;
    }
    return checkLengthAndReduce;
  }

  public selectType(index: number, calledFromTemplate: boolean) {
    if(calledFromTemplate) {
      this.unselectAllSelectFilters();
      this.withoutSegmentation = false;
      this.onlyPublished = false;
      this.benefitsDataSource.paginator.firstPage();
    }
    this.selectedTypeIndex = index;
    this.benefitsDataSource.data = this.benefitCategories[index].benefitList;
  }

  async configSegmentationList() {
    this.segmentationConfig = await this.benefitsService.getSegmentationConfig();
    this.segmentationList = [];
    for(const segmentation of this.segmentationConfig) {
      for(const item of segmentation.values) {
        this.segmentationList.push({
          id: segmentation.type,
          text: item.id
        });
      }
    }
  }

  async getCategories() {
    this.categories = await this.benefitsService.getCategories();
    this.categories.find(doc => doc.type === 'personal').order = -1;
    this.categories.sort((a, b) => a.order - b.order);
  }

  async getNewBenefits() {
    this.benefitsList = await this.benefitsService.getAllBenefits();
    this.normalizeBenefit();
  }

  normalizeBenefit() {
    this.benefitsList.forEach(doc =>{
      this.benefitsService.normalizeDate(doc);
      this.validities[doc.id] = this.isVigent(doc.newBenefit.startDate, doc.newBenefit.endDate);
      if(!doc.newBenefit.typeId){
        const originalId = this.originalTypes.find(type => type.ref === doc.newBenefit.type);
        doc.newBenefit.typeId = originalId ? originalId.id : 'monthly';
      }
    });
  }


  isVigent(start: string, end: string) {
    const today = new Date();
    if(!start || !end) {
      return false;
    }
    const startDate = new Date(start);
    const endDate = new Date(end);
    return new Date(startDate.getFullYear(),  startDate.getMonth(),   startDate.getDate()) <= today
      && new Date(endDate.getFullYear(),  endDate.getMonth(),   endDate.getDate(), 23, 59, 59) >= today;

  }

  configBenefits() {
    this.groupBenefitByType(this.categories, this.benefitsList);
    this.benefitsDataSource.data = this.benefitsList;
    this.benefitsDataSource.filterPredicate = this.filterPredicate;
    const calledFromTemplate = false;
    this.selectType(0, calledFromTemplate);
  }

  async replaceDoc(data: any) {
    const index = this.benefitsList.findIndex(b => b.id === data.id);
    if (index !== -1) {
      this.benefitsList[index] = data;
      this.normalizeBenefit();
      this.configBenefits();
    }
  }

  async updateSourceData() {
    this.benefitsDataSource.data = this.benefitsList.filter(
      benefit => benefit.newBenefit.typeId === this.categories[this.selectedTypeIndex].id);
  }

  async getBenefitsList() {
    this.loadingData = true;
    this.hasAccess = await this.auth.hasAccessTo('benefits');
    await this.getCategories();
    await this.getNewBenefits();
    this.configBenefits();
    this.loadingData = false;

  }

  groupBenefitByType(categories: BenefitCategory[], benefitsList: Benefit[]) {
    this.benefitCategories = [];
    this.benefitCategories.push(this.getPlanType());
    this.benefitCategories.push(this.getProductType());

    categories.forEach( type => {
      const groupList = benefitsList.filter(benefit => type.id === benefit.newBenefit.typeId);
      const publishedBenefit = groupList.filter(
        (benefit => (this.isPublished(benefit))
          && this.isVigent(benefit.newBenefit.startDate, benefit.newBenefit.endDate)));
      this.benefitCategories.push({
        type,
        benefitList: groupList,
        publishedBenefit
      });
    });
  }

  getPlanType() {
    return { type: { type: 'plan', order: -3, sectionTitle: 'Planes', active:true, id: 'plan'  },
      benefitList: this.benefitsList.filter(benefit =>  benefit.newBenefit.selectedSegmentation === 'plan'),
      publishedBenefit: this.benefitsList.filter(benefit =>  benefit.newBenefit.selectedSegmentation === 'plan'
      && (this.isPublished(benefit)) && this.isVigent(benefit.newBenefit.startDate, benefit.newBenefit.endDate))};
  }
  getProductType() {
    return { type: { type: 'productos', order: -2, sectionTitle: 'Productos', active:true, id: 'productos' },
      benefitList: this.benefitsList.filter(benefit => benefit.newBenefit.selectedSegmentation === 'productos'),
      publishedBenefit: this.benefitsList.filter(benefit => benefit.newBenefit.selectedSegmentation === 'productos'
      && (this.isPublished(benefit)) && this.isVigent(benefit.newBenefit.startDate, benefit.newBenefit.endDate))};
  }
  isPublished(benefit: Benefit) {
    return (benefit.newBenefit.type !== 'personal' && benefit.newBenefit.status === 'Publicado')
      || (benefit.newBenefit.type === 'personal' && benefit.newBenefit.statusPersonalBenefit === 'Publicado');
  }

  deleteBenefitFromMemory(benefit: Benefit) {
    this.benefitsList = this.benefitsList.filter(benefitListed => benefitListed.id !== benefit.id);
    this.benefitsDataSource.data = this.benefitsList;
    this.configBenefits();
  }

  deleteBenefit(benefit: Benefit) {
    this.modifiyingBenefit = true;
    this.modalDialogService.openModal('deleteConfirm')
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.benefitsService.deleteBenefit(benefit.id)
            .then(() => {
              this.deleteBenefitFromMemory(benefit);
              this.modifiyingBenefit = false;
            })
            .catch((ee) => {
              console.error(ee);
              this.modifiyingBenefit = false;
            });
        } else {
          this.modifiyingBenefit = false;
        }
      });
  }

  addNewBenefit() {
    this.benefitsService.setIsModifyingBoolean(false);
    this.benefitsService.setIsCreatingAndBackBoolean(false);
    this.router.navigate(['/new-benefit-creation']);
  }

  copyBenefitConfirm(benefit: Benefit) {
    this.modalDialogService.openModal('copyConfirm')
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.copyBenefit(benefit);
        } else {
          this.modifiyingBenefit = false;
        }
      });
  }

  modifyBenefit(benefit: Benefit) {
    this.benefitsService.setBenefitToCreateData(benefit);
    this.benefitsService.setIsModifyingBoolean(true);
    this.benefitsService.setIsCreatingAndBackBoolean(false);
    this.router.navigate([`/new-benefit-creation/${benefit.id}`]);
  }

  modifyBenefitCodesPeriod(benefit: Benefit) {
    this.benefitsService.setBenefitToModifyPeriodData(benefit);
    this.router.navigate(['/benefit-periods']);
  }

  toggleChange(benefit: Benefit) {
    this.modifiyingBenefit = true;

    if (benefit.newBenefit.type === 'personal') {
      benefit.newBenefit.statusPersonalBenefit = benefit.newBenefit.statusPersonalBenefit === 'Publicado' ? 'No Publicado' : 'Publicado';
      benefit.statusPersonalBenefit = benefit.newBenefit.statusPersonalBenefit;
      benefit.newBenefit.status = 'No Publicado';
      benefit.status = 'No Publicado';
    } else {
      benefit.newBenefit.status = benefit.newBenefit.status === 'Publicado' ? 'No Publicado' : 'Publicado';
      benefit.status = benefit.newBenefit.status;
    }
    this.benefitsService.updateBenefit(benefit)
      .then(() => {
        if (this.onlyPublished) {
          this.updateTableAfterPublicationChange(benefit);
        }
        this.modifiyingBenefit = false;
      })
      .catch(() => {
        this.modifiyingBenefit = false;
        benefit.newBenefit.status = benefit.newBenefit.status === 'Publicado' ? 'No Publicado' : 'Publicado';
        benefit.status = benefit.newBenefit.status;
      });
  }

  updateTableAfterPublicationChange(benefit: Benefit) {
    const newDataSource = [...this.benefitsDataSource.data];
    const index = newDataSource.indexOf(benefit);
    newDataSource.splice(index, 1);
    this.benefitsDataSource.data = newDataSource;
  }

  setOrderOnBenefit(benefit: Benefit) {
    if (benefit.newBenefit.orderPriority && benefit.newBenefit.orderPriority > 0) {
      benefit.order = benefit.newBenefit.orderPriority;
      this.benefitsService.updateBenefit(benefit)
        .then(() => {
          this.benefitsList.sort((a, b) => a.order - b.order);
          this.updateSourceData();

        }); // Faltaría capturar el error y mostarlo en una modal de error.
    }
  }

  //Esta función verifica el valor del select y lo agrega al objeto this.filterSelectObj
  //o lo quita de ella y luego aplica el filtro.
  applyFilterSelect(event, selectType: string) {
    if(event.value === undefined) {
      delete this.filterSelectObj[selectType];
    } else {
      if(this.withoutSegmentation) {
        this.withoutSegmentation = false;
      }
      this.selectedType = event.value.id;
      const criterio = new SegmentationOption(event.value.id, event.value.text);
      this.filterSelectObj[selectType] = criterio;
    }
    this.filterBasedOnSelectObj();
  }

  filterBasedOnSelectObj() {
    if(Object.keys(this.filterSelectObj).length === 0){
      this.selectType(this.selectedTypeIndex, false);
    } else {
      const currentBenefitsCategories = this.benefitCategories[this.selectedTypeIndex].benefitList as Array<any>;
      this.benefitsDataSource.data = currentBenefitsCategories.filter(
        benefit => this.verifyBenefitBasedOnSelectObj(benefit)
      );
    }
    if (this.onlyPublished) {
      this.filterPublishedAndVigent();
    }
  }

  verifyBenefitBasedOnSelectObj(benefit: Benefit)  {
    const valuesFilterSelectObj = Object.values(this.filterSelectObj);
    return valuesFilterSelectObj.some(
      filterValue => this.isBenefitSegmentatedAndValid(filterValue, benefit)
    );
  }

  isBenefitSegmentatedAndValid(item, benefit: Benefit) {
    return benefit.newBenefit.selectedSegmentation !== 'sinsegmentacion' && benefit.newBenefit.segmentationInfo?.some(
      segmentationItem => segmentationItem.id === item.value && segmentationItem.active
    );
  }

  unselectAllSelectFilters() {
    this.matSelectPlan = this.matSelectProduct = this.matSelectCategory = undefined;
    this.filterSelectObj = {};
  }

  applyFilter(filterValue: string) {
    this.benefitsDataSource.filter = filterValue.trim().toLowerCase();
  }

  public showTagBenefitModal(idBenefit: string) {
    this.benefitsService.setIdBenefitEdit(idBenefit);
    this.modalDialogService.openTagBenefitModal();
  }

  private  copyBenefit(benefit: Benefit) {
    this.modifiyingBenefit = true;
    this.benefitsService.addNewBenefit(this.generateCopiedBenefitData(benefit))
      .then(() => {
        this.modifiyingBenefit = false;
        this.ngOnInit();
      })
      .catch((ee) => {
        console.error(ee);
        this.modifiyingBenefit = false;
      });
  }

  private generateCopiedBenefitData(benefit: Benefit): Benefit {
    return {
      ...benefit,
      codesFilePath: [],
      rutsFilePath: [],
      status: 'No Publicado',
      statusPersonalBenefit: 'No Publicado',
      newBenefit : {
        ...benefit.newBenefit,
        benefitDiscount: `Copia de ${benefit.newBenefit.benefitDiscount}`,
        status: 'No Publicado',
        statusPersonalBenefit: 'No Publicado'
      }
    };
  }
}

class SegmentationOption {
  public type: string;
  public value: string;

  constructor(type: string, value: string) {
    this.type = type;
    this.value = value;
  }
};
