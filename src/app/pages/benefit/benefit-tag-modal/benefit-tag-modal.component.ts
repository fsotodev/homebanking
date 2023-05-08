import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BenefitTagRelationship } from '@apps/models/benefitTagRelationship';
import { BenefitsService } from '@apps/services/benefits.service';
import { FirebaseService } from '@apps/services/firebase.service';
import { BenefitTag } from '@apps/models/benefitTag';

@Component({
  selector: 'app-benefit-tag-modal',
  templateUrl: './benefit-tag-modal.component.html',
  styleUrls: ['./benefit-tag-modal.component.scss']
})
export class BenefitTagModalComponent implements OnInit {

  public loadingTagList: boolean;
  public loadingBenefitTagRelationShip: boolean;
  public tagList: BenefitTag[];
  public tagBenefitRelationship: BenefitTagRelationship;
  public errorMessage: string;
  public savingTag: boolean;
  private idBenefit: string;

  constructor(
    private dialogRef: MatDialogRef<BenefitTagModalComponent>,
    private benefitsService: BenefitsService,
    private firebaseService: FirebaseService,
    private snackBar: MatSnackBar
  ) {
    this.idBenefit =  this.benefitsService.getIdBenefitEdit();
  }

  ngOnInit() {
    this.getTagList();
    this.getTagBenefitRelationship();
  }

  public closeModal(): void {
    this.dialogRef.close();
  }

  public toggleTagId(tagId: string): void {
    let tagExist = false;
    for (let i = 0; i < this.tagBenefitRelationship.idTagList.length; i++ ) {
      if (tagId === this.tagBenefitRelationship.idTagList[i]) {
        tagExist = true;
        this.tagBenefitRelationship.idTagList.splice(i, 1);
        break;
      }
    }

    if (!tagExist) {
      this.tagBenefitRelationship.idTagList.push(tagId);
    }
  }

  public tagInRelationship(tagId: string): boolean {
    if (!this.tagBenefitRelationship || this.tagBenefitRelationship.idTagList.length === 0 ) {
      return false;
    }
    return this.tagBenefitRelationship.idTagList.includes(tagId);
  }

  public evaluateColor(tagId: string): string {
    if (this.tagInRelationship(tagId)) {
      return 'primary';
    }
    return 'basic';
  }

  public save() {
    this.savingTag = true;
    if (this.tagBenefitRelationship.id) {
      this.firebaseService.getFirebaseCollection('benefitTagRelationship')
        .doc(this.tagBenefitRelationship.id)
        .set(this.tagBenefitRelationship, { merge: true })
        .then(() => {
          this.displayMessage('Exito al guardar');
          this.savingTag = false;
        })
        .catch(() => {
          this.displayMessage('Error al guardar');
          this.savingTag = false;
        });
    } else {
      this.firebaseService.getFirebaseCollection('benefitTagRelationship')
        .add(this.tagBenefitRelationship)
        .then((docRef) => {
          this.tagBenefitRelationship.id = docRef.id;
          this.savingTag = false;
        })
        .catch(() => {
          this.displayMessage('Error al guardar');
          this.savingTag = false;
        });
    }
  }

  private getTagList() {
    this.loadingTagList = true;
    this.firebaseService.getBenefitTagEnable().then(
      (response) => {
        this.tagList = this.benefitsService.orderTagList(response);
        this.loadingTagList = false;
      })
      .catch(() => {
        this.displayMessage('Error al obtener la lista de tags');
        this.loadingTagList = false;
      });
  }

  private getTagBenefitRelationship() {
    this.loadingBenefitTagRelationShip = true;

    this.firebaseService.getBenefitTagRelationship(this.idBenefit)
      .then( (response) => {
        if (response.docs[0]) {
          this.tagBenefitRelationship = {
            id: response.docs[0].id,
            idBenefit: response.docs[0].data().idBenefit,
            idTagList: response.docs[0].data().idTagList
          };
        } else {
          this.tagBenefitRelationship = {
            idBenefit: this.idBenefit,
            idTagList: []
          };
        }
        this.loadingBenefitTagRelationShip = false;
      })
      .catch((error) => {
        this.displayMessage('Error al cargar la relacion entre Tag y Beneficio');
        this.loadingBenefitTagRelationShip = false;
      });
  }

  private displayMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000
    });
  }

}
