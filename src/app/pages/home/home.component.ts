import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Benefit, BenefitType, BenefitCategory } from '../../models/benefit';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { BenefitsService } from '../../services/benefits.service';
import { ModalDialogService } from '../../services/modal-dialog.service';
import { AuthFirebaseService } from '@apps/shared/services/auth/auth-firebase.service';
import { CampaignService } from '../../services/campaign.service';
import { Subscription } from 'rxjs/';
import { AngularFirestore } from '@angular/fire/firestore';
import { NewBenefit } from '@apps/models/new-benefit';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable) benefitTable: MatTable<any>;
  modifiyingBenefit = false;
  loadingData = false;
  benefitOrder = 0;
  tabSelected = 0;
  selectedTypeIndex = 0;
  displayedColumns = [
    'order',
    'periodicity',
    'title',
    'status',
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

  constructor(
    private benefitsService: BenefitsService,
    private router: Router,
    private modalDialogService: ModalDialogService,
    private auth: AuthFirebaseService,
    private campaign: CampaignService,
    private aFirestore: AngularFirestore,
  ) { }

  async ngOnInit() {
    await this.getBenefitsList();
  }

  filterPredicate = (data: any, filter) => {
    const dataStr =JSON.stringify(data).toLowerCase();
    return dataStr.indexOf(filter) !== -1;
  };

  ngOnDestroy() {
  }

  public selectType(index: number) {
    this.selectedTypeIndex = index;
    this.benefitsDataSource.data = this.benefitsList.filter( benefit => benefit.newBenefit.typeId === this.categories[index].id);
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
    this.selectType(0);
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
        this.modifiyingBenefit = false;
      })
      .catch(() => {
        this.modifiyingBenefit = false;
        benefit.newBenefit.status = benefit.newBenefit.status === 'Publicado' ? 'No Publicado' : 'Publicado';
        benefit.status = benefit.newBenefit.status;
      });
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
