import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Utils, ModalDataObject } from '../utils/utils';
import { FirebaseService } from '@apps/services/firebase.service';

@Component({
  selector: 'app-modal-balance',
  templateUrl: './modal-balance.component.html',
  styleUrls: ['./modal-balance.component.scss']
})
export class ModalBalanceComponent implements OnInit {
  giftCardBalance: any;
  modalData: ModalDataObject;
  params: any;
  constructor(
    private utils: Utils,
    private dialogRef: MatDialogRef<ModalBalanceComponent>,
    private balance: FirebaseService,
    @Inject(MAT_DIALOG_DATA) modalDataFromService
  ) {
    this.modalData = this.utils.getModalDataObject(modalDataFromService.modalType);
    this.params = modalDataFromService.params;
  }

  ngOnInit() {
    this.getBalanceGiftCard();
  }

  async getBalanceGiftCard() {
    const folio = this.params.giftCardFolio;
    this.balance.getBalance(folio).then(
      (response) => {
        if(this.giftCardBalance !== -1) {
          this.giftCardBalance = response;
        } else {
          this.giftCardBalance = 'No se ha podido obtener el valor';
        }
      },
      (err) => {
        console.log('error al obtener el saldo', err);
      });
  }

  closeModal(btnPressed: string) {
    this.dialogRef.close({btnPressed});
  }
}
