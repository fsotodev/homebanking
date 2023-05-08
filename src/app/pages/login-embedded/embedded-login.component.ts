import { Component, OnInit } from '@angular/core';
import { EmbedConfig } from '@apps/models/types/config';
import { FirebaseService } from '@apps/services/firebase.service';
import { UtilsService } from '@apps/services/utils.service';
import { ModalDialogService } from '@apps/services/modal-dialog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-embedded-login',
  templateUrl: './embedded-login.component.html',
  styleUrls: ['./embedded-login.component.scss']
})
export class EmbeddedLoginComponent implements OnInit {

  public isLoading: boolean;
  public isLoadingImg: boolean;
  public config: EmbedConfig;
  public localConfig: EmbedConfig;

  constructor(
    private firebaseService: FirebaseService,
    private utils: UtilsService,
    private modalDialogService: ModalDialogService,
    private router: Router,
  ) { }

  public get wereChangesMade(): boolean {
    return !this.utils.areShallowEqual(this.localConfig, this.config);
  }

  public async ngOnInit() {
    this.isLoading = true;
    const snapshot = await this.firebaseService.getConfig('embeddedCredits');
    this.config = snapshot.data() as EmbedConfig;
    this.localConfig = { ...this.config };
    this.isLoading = false;
  }

  public modifyConfig(event: string, position: string) {
    this.localConfig[position] = event;
  }

  public resetConfig() {
    this.localConfig = { ...this.config };
  }

  public saveConfig() {
    this.modalDialogService.openModal('updateEmbeddedLoginConfig').then((btnPressed) => {
      if (btnPressed === 'right') {
        if (this.wereChangesMade) {
          this.firebaseService.updateConfig('embeddedCredits', this.localConfig);
        }
        this.router.navigateByUrl('/home');
      }
    });
  }

}
