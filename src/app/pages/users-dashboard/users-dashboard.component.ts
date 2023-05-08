import { Component, OnInit } from '@angular/core';
import { AuthFirebaseService } from '@apps/shared/services/auth/auth-firebase.service';
import { FirebaseService } from '../../services/firebase.service';
import { MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ModalUserComponent } from './_modal-user.component';
import { User } from '@apps/shared/models/user.interface';

@Component({
  selector: 'app-users-dashboard',
  templateUrl: './users-dashboard.component.html',
  styleUrls: ['./users-dashboard.component.scss']
})
export class UsersDashboardComponent implements OnInit {

  displayedColumns = [
    'displayName',
    'email',
    'type',
    'modifyOrDelete',
  ];
  modalDialogRef: MatDialogRef<any, any>;

  dataSource: MatTableDataSource<User> = new MatTableDataSource();

  constructor(
    private _auth: AuthFirebaseService,
    private firebaseService: FirebaseService,
    public materialDialog: MatDialog
  ) { }

  async ngOnInit() {
    const users: Array<any> = [];
    const querySnapshot = await this.firebaseService.getFirebaseCollection('adminUsers').ref.get();
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.forEach(doc => {
        const userData = doc.data();
        users.push(userData);
      });
    }
    this.dataSource = new MatTableDataSource(users);
  }

  totalUsers(): number {
    return this.dataSource.data.length;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openModal(user, type) {
    if (!this.modalDialogRef) {
      const modalConfig = new MatDialogConfig();
      modalConfig.disableClose = true;
      modalConfig.autoFocus = true;
      modalConfig.data = {
        height: '140px',
        width: '432px',
        modalType: type,
        user: type === 'editUser' ? user : { displayName: '', type: '', email: '' },
      };

      this.modalDialogRef = this.materialDialog.open(ModalUserComponent, modalConfig);
      this.modalDialogRef.afterClosed().subscribe(data => {
        this.modalDialogRef = null;
        if (data.btnPressed === 'right') {
          if (type === 'editUser') {
            this._auth.updateUser({ user: data.user })
              .then(() => console.log('actualizado'))
              .catch((err) => console.error('error: ', err));
          } else {
            this._auth.createUser(data.user)
              .then(() => console.log('usuario creado!'))
              .catch((err) => console.error('error', err));
          }
        }
      });
    }
  }

}
