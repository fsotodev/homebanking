import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Benefit } from '@apps/models/benefit';
import { NewBenefit } from '@apps/models/new-benefit';
import { BenefitsService } from '@apps/services/benefits.service';
import { FirebaseService } from '@apps/services/firebase.service';
import { AuthFirebaseService } from '@apps/shared/services/auth/auth-firebase.service';

@Component({
  selector: 'app-tab-code',
  templateUrl: './tab-code.component.html',
  styleUrls: ['./tab-code.component.scss']
})

export class TabCodeComponent implements OnInit {

  hasAccess = false;
  benefitCodeDataSource = new MatTableDataSource();
  benefitListFilter: NewBenefit[] = [];
  displayedColumns = [
    'type',
    'title',
    'id',
    'codesStock',
    'status',
    'addFileCode'
  ];

  constructor(
    private auth: AuthFirebaseService,
    private benefitsService: BenefitsService,
    private router: Router,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    this.getBenefitsList();
    this.benefitCodeDataSource.filterPredicate = this.filterPredicate;
  }

  filterValue = (filterValue) => {
    this.benefitCodeDataSource.filter =  filterValue.trim().toLowerCase();
  };

  filterPredicate = (data: any, filter) => {
    const dataStr =JSON.stringify(data).toLowerCase();
    return dataStr.indexOf(filter) !== -1;
  };

  async getBenefitsList() {
    let benefitList;
    this.hasAccess = await this.auth.hasAccessTo('benefits');
    this.benefitsService.getRawNewBenefits()
      .then(benefitsList => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        benefitList = benefitsList.filter(data => {
          if (typeof data.endDate == 'object') {
            const t = new Date(1970, 0, 1);
            t.setSeconds(data.endDate.seconds);
            return t >= now;
          } else {
            return new Date(data.endDate) >= now;
          }
        }).filter(x => x.codeSubType === 'variable');
        this.benefitCodeDataSource.data = benefitList;
        this.benefitListFilter = benefitList;
      });
  }


  async uploadCodeFiles(idBenefit) {
    const data = this.benefitListFilter.filter(x => x.id === idBenefit)[0];
    const benefitRef = this.firebaseService.getFirebaseCollection('benefits').ref.doc(idBenefit);
    const benefit = await benefitRef.get();
    const path = benefit.data().codesFilePath;
    this.benefitsService.setBenefitCodeRut(data, path);
    this.router.navigateByUrl('upload-codes/' + idBenefit);
  }
}
