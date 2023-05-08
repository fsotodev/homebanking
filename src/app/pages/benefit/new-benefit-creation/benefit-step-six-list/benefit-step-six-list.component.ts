import { Component, Inject, OnInit } from '@angular/core';
import { Collapsible } from '@apps/models/collapsible';
import { CollapsibleService } from '../../../../services/collapsible.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BenefitStepSixAddComponent } from '../benefit-step-six-add/benefit-step-six-add.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDialogService } from '@apps/services/modal-dialog.service';


export interface DialogData {
  titulo: string;
}

@Component({
  selector: 'app-benefit-step-six-list',
  templateUrl: './benefit-step-six-list.component.html',
  styleUrls: ['./benefit-step-six-list.component.scss']
})
export class BenefitStepSixListComponent implements OnInit {

  collapsibles: Collapsible[];
  displayedColumns: string[] = ['title', 'description', 'priority', 'icon', 'options'];
  dataSourceCollapsible = new MatTableDataSource();

  constructor(
    public dialog: MatDialog,
    public collapsibleService: CollapsibleService,
    private modalDialogService: ModalDialogService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.collapsibles = this.collapsibleService.getCollapsible();
    this.loadTable();
  }

  loadTable() {
    this.dataSourceCollapsible.data = this.collapsibles;
  }

  showConfirmRemove() {

  }

  removeCollapsible(collapsible: Collapsible) {
    this.modalDialogService.openModal('deleteConfirm')
      .then((btnPressed) => {
        if (btnPressed === 'right') {
          this.showConfirmRemove();
          this.collapsibleService.removeCollapsible(collapsible);
          this.snackBar.open('Registro eliminado exitosamente!', '', {
            duration: 3000
          });
          this.loadTable();
        }
      });
  }

  addEditCollapsible(collapsible?: Collapsible) {
    if (collapsible === undefined) {
      collapsible = {
        id: 0,
        title: '',
        description: '',
        priority: 0,
        icon: ''
      };
    }
    const modalForm = this.dialog.open(BenefitStepSixAddComponent, {
      width: '650px',
      disableClose: true,
      data: { collapsible }
    });

    modalForm.afterClosed().subscribe(
      () => {
        this.loadTable();
      }
    );
  }
}
