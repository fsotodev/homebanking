import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { FirebaseService } from '../../services/firebase.service';
import { ModalDialogService } from '../../services/modal-dialog.service';

@Component({
  selector: 'app-load-file-button',
  templateUrl: './load-file-button.component.html',
  styleUrls: ['./load-file-button.component.scss']
})
export class LoadFileButtonComponent implements OnInit, OnChanges {

  @Input() text: string;
  @Input() extensions: string[];
  @Input() description: string;
  @Input() isLoading = false;
  @Input() isDisabled = false;
  @Input() showUrl = true;
  @Input() emitUrl = false;
  @Input() showImage = false;
  @Input() showExtensions = true;
  @Input() folder = 'defaultUploads';
  @Input() inputUrl = null;
  @Output() file: EventEmitter<any>;
  @Output() url: EventEmitter<any>;
  @Input() fileUrl: string;
  @Input() fileFirebaseUrl: string;
  @Input() keepChanging: boolean;

  public isRenderingImg: boolean;
  public settedFromInput = false;
  public extensionNames: string[];
  public originalUrl: string;

  constructor(
    private clipboardService: ClipboardService,
    private firebaseService: FirebaseService,
    private modalDialogService: ModalDialogService
  ) {
    this.extensionNames = [];
    this.file = new EventEmitter<any>();
    this.url = new EventEmitter<any>();
  }

  ngOnInit() {
    for (const extension of this.extensions) {
      this.extensionNames.push('.' + extension + ' ');
      this.originalUrl = this.inputUrl;
    }
  }

  change(event) {
    const files = event.target.files;
    if (files.length > 0) {
      this.fileUrl = files[0].name;
      this.uploadImage(files, this.folder);
      this.file.emit(files);
      event.target.value = '';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.inputUrl && !this.settedFromInput) {
      this.fileFirebaseUrl = this.inputUrl;
      this.fileUrl = this.inputUrl;
      this.settedFromInput = true;
      this.isRenderingImg = true;
    }
    if (this.inputUrl && this.keepChanging) {
      this.fileFirebaseUrl = this.inputUrl;
      this.fileUrl = this.inputUrl;
    }
  }

  public copy(text: string) {
    this.clipboardService.copyFromContent(text);
  }

  public async uploadImage(event: FileList, folder: string) {
    if (event.length > 0) {
      this.isLoading = true;
      this.fileFirebaseUrl = null;
      this.firebaseService.uploadFileToFireStorage(event[0], folder)
        .then((url: string) => {
          this.fileFirebaseUrl = url;
          if (this.emitUrl) {
            this.url.emit(this.fileFirebaseUrl);
          }
          this.isLoading = false;
          this.isRenderingImg = true;
        })
        .catch(() => {
          this.isLoading = false;
          this.modalDialogService.openModal('genericError')
            .then((btnPressed) => {
              if (btnPressed === 'right') {
                this.uploadImage(event, folder);
              }
            });
        });
    } else {
      this.fileFirebaseUrl = null;
    }
  }

  public undoChanges() {
    this.fileFirebaseUrl = this.originalUrl;
    this.fileUrl = this.originalUrl;
    this.url.emit(this.fileFirebaseUrl);
  }

  public deleteImage() {
    this.fileFirebaseUrl = '';
    this.fileUrl = '';
    this.url.emit('');
  }

  public stopLoader() {
    this.isRenderingImg = false;
  }
}
