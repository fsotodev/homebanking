import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../../services/firebase.service';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { BenefitTag } from '@apps/models/benefitTag';
import { Router } from '@angular/router';
import { BenefitsService } from '@apps/services/benefits.service';


@Component({
  selector: 'app-benefit-tag',
  templateUrl: './benefit-tag.component.html',
  styleUrls: ['./benefit-tag.component.scss']
})
export class BenefitTagComponent implements OnInit {
  public loadlist: boolean;
  public tagList: any[];
  public modifiyingTag: string;
  public enable: boolean;
  public order: number;
  public tagName: string;
  public savingTag: boolean;
  public currentId: string;
  public tagInEdition: BenefitTag;
  constructor(
    private firebaseService: FirebaseService,
    private modalDialogService: ModalDialogService,
    private router: Router,
    private benefitsService: BenefitsService
  ) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.savingTag = false;
    this.getTagList();
  }

  public getTagList(): void {
    this.loadlist = true;
    this.firebaseService.getCollectionWithDocId('benefitTag').then(
      (response) => {
        this.tagList = this.benefitsService.orderTagList(response);
        this.loadlist = false;
      }
    );
  }

  public toggleChange(tag: BenefitTag): void {
    tag.enable = !tag.enable;
    this.updateTag(tag);
  }

  public evaluateColor(enable: boolean): string {
    if (enable) {
      return 'primary';
    }
    return 'basic';
  }

  public disableSaveButton(): boolean {
    if (
      !this.tagName
      || this.tagName.trim() === ''
      || !this.order
      || this.savingTag
      || this.verifyDuplicateTag(this.tagName)
      || (this.enable !== true && this.enable !== false)
    ) {
      return true;
    }

    if (this.currentId) {
      if (
        this.tagName === this.tagInEdition.tagName
        && this.enable === this.tagInEdition.enable
        && this.order === this.tagInEdition.order
      ) {
        return true;
      }
    }
    return false;
  }

  public saveTag(): void {
    const benefitTag: BenefitTag = {
      enable: this.enable,
      order: this.order,
      tagName: this.tagName
    };
    if (!this.currentId || this.currentId === null) {
      this.createTag(benefitTag);
    } else {
      benefitTag.id = this.currentId;
      this.updateTag(benefitTag);
    }
  }

  public editTag(tag: BenefitTag): void {
    this.currentId = tag.id;
    this.tagInEdition = tag;
    this.tagName = tag.tagName;
    this.enable = tag.enable;
    this.order = tag.order;
  }

  public updateTag(tag: BenefitTag): void {
    this.modifiyingTag = tag.id;
    this.savingTag = true;
    this.firebaseService.getFirebaseCollection('benefitTag')
      .doc(tag.id)
      .set(tag, { merge: true })
      .then(() => {

        /* eslint-disable */
        for (let i = 0; i < this.tagList.length; i++) {
          if (this.tagList[i].id === tag.id ) {
            const auxOrder = this.tagList[i].order;
            this.tagList[i].tagName = tag.tagName;
            this.tagList[i].order = tag.order;
            this.tagList[i].enable = tag.enable;
            this.tagList = this.benefitsService.orderTagList(this.tagList);
            break;
          }
        }

        this.modifiyingTag = null;
        this.clearForm();
        this.savingTag = false;
      })
      .catch(() => {
        this.modifiyingTag = null;
        this.savingTag = false;
      });
  }

  public clearForm(): void {
    this.currentId = null;
    this.tagName = null;
    this.order = null;
    this.enable = null;
  }

  public createTag(tag: BenefitTag): void {
    this.savingTag = true;
    this.firebaseService.getFirebaseCollection('benefitTag')
      .add(tag)
      .then((docRef) => {
        tag.id = docRef.id;
        this.tagList.push(tag);
        this.tagList = this.benefitsService.orderTagList(this.tagList);
        this.savingTag = false;
        this.clearForm();
      })
      .catch(() => {
        this.savingTag = false;
      });
  }

  public verifyDuplicateTag(tagName: string): boolean {
    if (!tagName) {
      return false;
    }
    return this.tagList.some(
      (tag) => tag.tagName.toUpperCase() === tagName.toUpperCase() && tag.id !== this.currentId
    );
  }

  public removeTag(tag: BenefitTag): void {
    this.modalDialogService.openModal('deleteTagConfirm')
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.firebaseService.getFirebaseCollection('benefitTag')
          .doc(tag.id)
          .delete()
          .then(() => {
            this.tagList = this.tagList.filter(tagItem => tagItem.id !== tag.id);
          });
        }
      });
  }


}
