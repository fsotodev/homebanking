import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { GroupService } from '@apps/services/group.service';
import { FirebaseService } from '@apps/services/firebase.service';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Group } from '@apps/models/group';


@Component({
  selector: 'app-list-group',
  templateUrl: './list-group.component.html',
  styleUrls: ['./list-group.component.scss']
})
export class ListGroupComponent implements OnInit {
  @ViewChild('table') table: MatTable<Group>;
  public isLoading = true;
  public groupsDataSource: Group[] = [];
  public groupsDataSourceBack: Group[] = [];
  public dragEnabled = false;
  public isEditing: boolean = false;
  public displayedColumns = [
    'order',
    'name',
    'icon',
    'active',
    'statusToogle'
  ];
  

  constructor(
    private groupService: GroupService,
    private firebaseService: FirebaseService,
    private modalDialogService: ModalDialogService
  ) { }

  ngOnInit(): void {
    this.getProductGroupList();
  }

  private async getProductGroupList() {
    this.isLoading = true;
    this.groupsDataSource = await this.groupService.getAllCGroups();
    this.isLoading = false;
  }

  toggleEditing = () => {
    this.groupsDataSourceBack = JSON.parse(JSON.stringify(this.groupsDataSource));
    this.isEditing = true;
    this.table.renderRows();
  }

  cancelEditing = () => {
    this.groupsDataSource = [...this.groupsDataSourceBack];
    this.groupsDataSourceBack = [];
    this.isEditing = false;
    this.table.renderRows();
  }
  toggleChange = (index, status) => {
    this.groupsDataSource[index].active = !status;
    this.table.renderRows();
  }

  dropTable(event: CdkDragDrop<Group[]>) {
    const prevIndex = this.groupsDataSource.findIndex((d) => d === event.item.data);
    moveItemInArray(this.groupsDataSource, prevIndex, event.currentIndex);
    this.setOrder();
    this.table.renderRows();
  }
  setOrder = () => {
    this.groupsDataSource = this.groupsDataSource.map((group, index) => ({...group, order: index + 1}));
  }

  saveChanges = async() => {
    try {
      let batch = this.firebaseService.getNewBatch();
      this.groupsDataSource.forEach(group => {
        const ref = this.firebaseService.getFirebaseCollection('productGroup').doc(group.id).ref;
        const obj = {...group};
        delete obj.id;
        batch.set(ref, obj);
      });
      await batch.commit();
      await this.getProductGroupList();
      this.groupsDataSourceBack = [];
      this.isEditing = false;
      this.table.renderRows();
    } catch (error) {
      console.log(error);
    }

  }

}
