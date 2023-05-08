import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseService } from '@apps/services/firebase.service';
import * as moment from 'moment';
import { stringLength } from '@firebase/util';
import { AuthFirebaseService } from '@apps/shared/services/auth/auth-firebase.service';
@Component({
  selector: 'app-delete-product-transactions-dialog',
  templateUrl: 'delete-product-transactions-dialog.component.html',
})
export class DeleteProductTransactionsDialogComponent {
  result: string;
  loading = false;

  constructor(
    private dialogRef: MatDialogRef<DeleteProductTransactionsDialogComponent>,
    private firebase: FirebaseService,
    private authService: AuthFirebaseService,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
  public getParsedDate(date: any) {
    return !!date ? moment(date).format('DD-MM-YYYY HH:MM') : 'Sin fecha registrada';
  }

  public async confirmDeleteProductTransactions() {
    this.loading = true;
    if(this.data.productTransaction && this.data.productTransaction.id){
      await this.deleteProductTransactions(this.data.productTransaction);
      return;
    }
    await this.selectProductTransactionByCreatedAt();
    return;
  }

  private async selectProductTransactionByCreatedAt(){
    if(this.data.productTransaction && this.data.productTransaction.createdAt) {
      const date = this.firebase.getTimestampFromDate(new Date(this.data.productTransaction.createdAt)) ;
      const data = await this.firebase.getProductTransactionsByDate(this.data.userId, date);
      if(data.length === 1){
        await this.deleteProductTransactions(data[0]);
        return;
      }
    }

    this.result = 'No es posible eliminar transacción. Favor consultar con el administrador';
    this.loading = false;
  }

  private async deleteProductTransactions(data: any) {
    const user = await this.authService.userInfo();
    await this.firebase.addDeletedProductTransaction( data, user.email);
    this.result = 'Transacción respaldada: ' + data.id ;
    await this.firebase.deleteProductTransaction(data.id);
    this.close();
    return;
  }

  private close() {
    this.dialogRef.close();
  }
}
