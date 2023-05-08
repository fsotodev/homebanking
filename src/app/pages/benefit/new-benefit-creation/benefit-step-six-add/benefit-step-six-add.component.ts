import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Collapsible } from '@apps/models/collapsible';
import { FirebaseService } from '@apps/services/firebase.service';
import { CollapsibleService } from '../../../../services/collapsible.service';
import { ModalDialogService } from '@apps/services/modal-dialog.service';

@Component({
  selector: 'app-benefit-step-six-add',
  templateUrl: './benefit-step-six-add.component.html',
  styleUrls: ['./benefit-step-six-add.component.scss']
})
export class BenefitStepSixAddComponent implements OnInit {
  form: FormGroup;
  operation = 'Agregar ';
  isHiddenCreate = true;
  isHiddenSave = false;
  showUpdate = true;
  showCreate = true;
  collapseUpdateObject: Collapsible;
  url = 'https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-13.png';

  addCollapsibleRequest: Collapsible = {
    id: 0,
    title: '',
    description: '',
    priority: 1,
    icon: ''
  };
  constructor(
    public dialogRef: MatDialogRef<BenefitStepSixAddComponent>,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    public collapsibleService: CollapsibleService,
    private firebaseService: FirebaseService,
    private modalDialogService: ModalDialogService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: [null, Validators.min(0)],
      icon: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.isEdit(this.data.collapsible);
    if (this.data.collapsible.title === '') {
      this.operation = 'Crear ';
      this.showUpdate = false;
      this.showCreate = true;
      this.addCollapsibleRequest.icon = this.url;
    } else {
      this.operation = 'Editar ';
      this.showUpdate = true;
      this.showCreate = false;
    }
  }

  isEdit(collapsible: Collapsible) {
    this.addCollapsibleRequest.id = collapsible.id;
    this.addCollapsibleRequest.title = collapsible.title;
    this.addCollapsibleRequest.description = collapsible.description;
    this.addCollapsibleRequest.priority = collapsible.priority;
    this.addCollapsibleRequest.icon = collapsible.icon;
    this.collapseUpdateObject = collapsible;
  }

  updateCollapsible(idForm: any, icon) {
    const result = this.collapsibleService.verifyPrioriryUpdate(idForm, this.form.value.priority);
    if (result === 'update') {
      this.collapsibleService.removeCollapsible(this.collapseUpdateObject);
      this.collapsibleService.addCollapsible({
        id: this.form.value.id,
        title: this.form.value.title,
        description: this.form.value.description,
        priority: this.form.value.priority,
        icon,
      });
      this._snackBar.open('Campo colapsable registrado exitosamente!', '', {
        duration: 3000
      });
      this.dialogRef.close();
    } else if (result === 'duplicated') {
      this._snackBar.open('Prioridad ya existe. Ingrese otro número.', '', {
        duration: 5000
      });
    }
  }

  addEditCollapsible() {
    const countID = this.collapsibleService.createId();
    if (this.collapsibleService.verifyPriority(this.form.value.priority)) {
      this.collapsibleService.addCollapsible({
        id: countID,
        title: this.form.value.title,
        description: this.form.value.description,
        priority: this.form.value.priority,
        icon: this.url
      });

      this._snackBar.open('Campo colapsable registrado exitosamente!', '', {
        duration: 3000
      });
      this.dialogRef.close();
    } else {
      this._snackBar.open('Prioridad ya existe. Ingrese otro número.', '', {
        duration: 5000
      });
    }
  }

  uploadBenefitImage(event: FileList) {
    if (event.length <= 0) {
      //this.setImageBenefit[type]();
      return;
    }
    //this.setToggleLoading[type](true);
    this.firebaseService.uploadFileToFireStorage(event[0], 'benefits')
      .then((urlImage: string) => {
        //this.setToggleLoading[type](false);
        //this.setImageBenefit[type](urlImage);
        this.url = urlImage;
        this.addCollapsibleRequest.icon = this.url;
      })
      .catch(() => {
        //this.setToggleLoading[type](false);
        this.modalDialogService.openModal('genericError')
          .then((btnPressed) => {
            if (btnPressed === 'right') {
              this.uploadBenefitImage(event);
            }
          });
      });
  }

  onSelectIcon(e) {
    if (e.target.files) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
        this.addCollapsibleRequest.icon = this.url;
      };
    }
  }

  minus() {
    if (this.addCollapsibleRequest.priority > 0) {
      this.addCollapsibleRequest.priority = this.addCollapsibleRequest.priority - 1;
    }
  }

  plus() {
    this.addCollapsibleRequest.priority = this.addCollapsibleRequest.priority + 1;

  }

  cancel() {
    this.dialogRef.close();
  }
}
