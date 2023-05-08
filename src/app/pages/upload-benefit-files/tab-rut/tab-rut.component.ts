import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Benefit } from '@apps/models/benefit';
import { NewBenefit } from '@apps/models/new-benefit';
import { BenefitsService } from '@apps/services/benefits.service';
import { FirebaseService } from '@apps/services/firebase.service';
import { AuthFirebaseService } from '@apps/shared/services/auth/auth-firebase.service';

@Component({
  selector: 'app-tab-rut',
  templateUrl: './tab-rut.component.html',
  styleUrls: ['./tab-rut.component.scss']
})
export class TabRutComponent implements OnInit {
  hasAccess = false;
  benefitRutDataSource = new MatTableDataSource();
  personalBenefitsList: Array<Benefit> = [];
  benefitListFilter: NewBenefit[] = [];
  displayedColumns = [
    'type',
    'title',
    'id',
    'rutsStock',
    'status',
    'addFileRut'
  ];
  constructor(
    private auth: AuthFirebaseService,
    private benefitsService: BenefitsService,
    private router: Router,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    this.getBenefitListPersonal();
    this.benefitRutDataSource.filterPredicate = this.filterPredicate;
  }

  filterValue = (filterValue) => {
    this.benefitRutDataSource.filter =  filterValue.trim().toLowerCase();
    this.benefitRutDataSource.filterPredicate = this.filterPredicate;
  };

  filterPredicate = (data: any, filter) => {
    const dataStr =JSON.stringify(data).toLowerCase();
    return dataStr.indexOf(filter) !== -1;
  };

  async getBenefitListPersonal() {
    this.hasAccess = await this.auth.hasAccessTo('benefits');
    this.benefitsService.getRawNewBenefits().then(benefitsList => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const benefitList = benefitsList.filter(data => {
        if (typeof data.endDate == 'object') {
          const t = new Date(1970, 0, 1);
          t.setSeconds(data.endDate.seconds);
          return t >= now;
        } else {
          return new Date(data.endDate) >= now;
        }
      }).filter(x => x.type === 'personal');
      this.benefitRutDataSource.data = benefitList;
      this.benefitListFilter = benefitList;
    });
  }

  async uploadRutFiles(idBenefit) {
    const data = this.benefitListFilter.filter(x => x.id === idBenefit)[0];
    const benefitRef = this.firebaseService.getFirebaseCollection('benefits').ref.doc(idBenefit);
    const benefit = await benefitRef.get();
    const path = benefit.data().rutsFilePath;
    this.benefitsService.setBenefitCodeRut(data, path);
    this.router.navigateByUrl('upload-ruts/' + idBenefit);
  }
}
