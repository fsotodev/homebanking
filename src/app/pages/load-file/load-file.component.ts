import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FirebaseService } from '../../services/firebase.service';
import { ModalDialogService } from '../../services/modal-dialog.service';
import { ClipboardService } from 'ngx-clipboard';


@Component({
  selector: 'app-load-file',
  templateUrl: './load-file.component.html',
  styleUrls: ['./load-file.component.scss']
})
export class LoadFileComponent implements OnInit {
  isModifyingBenefit: boolean;
  fileUrl: string;
  isUploading: boolean;

  text = 'Subir archivo';
  extensions = ['png', 'jpg', 'svg'];

  constructor(
    private location: Location,
    private firebaseService: FirebaseService,
    private modalDialogService: ModalDialogService,
    private clipboardService: ClipboardService
  ) {
    this.isModifyingBenefit = false;
    this.fileUrl = null;
    this.isUploading = false;
  }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

  copy(text: string) {
    this.clipboardService.copyFromContent(text);
  }

  async uploadMainImage(event: FileList) {
    if (event.length > 0) {
      this.isUploading = true;
      this.firebaseService.uploadFileToFireStorage(event[0], 'benefits')
        .then((url: string) => {
          this.fileUrl = url;
          this.isUploading = false;
        })
        .catch(() => {
          this.isUploading = false;
          this.modalDialogService.openModal('genericError')
            .then((btnPressed) => {
              if (btnPressed === 'right') {
                this.uploadMainImage(event);
              }
            });
        });
    } else {
      this.fileUrl = null;
    }
  }

}
