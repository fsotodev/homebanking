import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FirebaseService } from '@apps/services/firebase.service';
import { ModalDialogService } from '@apps/services/modal-dialog.service';

@Component({
  selector: 'app-list-datacards-users',
  templateUrl: './list-datacards-users.component.html',
  styleUrls: ['./list-datacards-users.component.scss']
})
export class ListDatacardsUsersComponent implements OnInit {

  loadingData = false;
  usersList: Array<any> = [];
  usersDataSource = new MatTableDataSource();
  modifiyingUser = false;

  displayedColumns = [
    'rut',
    'enabled',
    'modifyOrDelete'
  ];

  constructor(
    private firebaseService: FirebaseService,
    private modalDialogService: ModalDialogService,
  ) { }

  ngOnInit() {
    this.getUsersList();
  }

  async getUsersList() {
    this.loadingData = true;
    const querySnapshot = await this.firebaseService.getFirebaseCollection('datacardUsers').ref.get();
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach(doc => {
        const docData = doc.data();
        this.usersList.push(docData);
      });
    }
    this.loadingData = false;
    this.usersDataSource.data = this.usersList;
  }

  applyFilter(filterValue: string) {
    this.usersDataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleChange(user: any) {
    this.modifiyingUser = true;
    user.enabled = !user.enabled;
    this.firebaseService.updateUserDatacard(user)
      .then(() => {
        this.modifiyingUser = false;
      })
      .catch(() => {
        this.modifiyingUser = false;
        user.enabled = !user.enabled;
      });
  }

  deleteUser(user: any) {
    this.modifiyingUser = true;
    this.modalDialogService.openModal('deleteConfirmDatacardUser')
      .then(btnPressed => {
        if (btnPressed === 'right') {
          this.firebaseService.deleteUserDatacard(user.rut)
            .then(() => {
              this.deleteUserFromMemory(user);
              this.modifiyingUser = false;
            })
            .catch(() => {
              this.modifiyingUser = false;
            });
        } else {
          this.modifiyingUser = false;
        }
      });
  }

  deleteUserFromMemory(user: any) {
    this.usersList = this.usersList.filter(usersListed => usersListed.rut !== user.rut);
    this.usersDataSource.data = this.usersList;
  }
}
