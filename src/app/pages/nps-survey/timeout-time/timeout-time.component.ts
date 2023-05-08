import { Component, OnInit } from '@angular/core';
import { NpsService } from '../../../services/nps.service';
import { TimeoutTime } from '../../../models/nps';
import { Utils } from '../../shared-components/utils/utils';
import { ModalDialogService } from '../../../services/modal-dialog.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-timeout-time',
  templateUrl: './timeout-time.component.html',
  styleUrls: ['./timeout-time.component.scss'],
})

export class TimeoutTimeComponent implements OnInit {
    public displayedColumns: string[] = ['flowName', 'seconds'];
    public timeoutTime: Array<{flowName: string; seconds: number; flowCode: string}> = [];
    public timeoutTimeInfo: TimeoutTime;
    public isLoading = true;
    constructor(
        private npsService: NpsService,
        private utils: Utils,
        private modalService: ModalDialogService,
        private router: Router
    ) { }

    public async ngOnInit() {
      await this.getTimeoutTime();
    }

    public setSecondsOnSurvey(setType: Array<{flowName: string; seconds: number}>) {
      this.timeoutTimeInfo[setType['flowCode']] = setType['seconds'];
    }

    public async getTimeoutTime() {
      this.timeoutTimeInfo = await this.npsService.getTimeoutTime();
      for (const [key, value] of Object.entries(this.timeoutTimeInfo)) {
        const keyString = this.utils.getLegibleTextNpsString(key);
        this.timeoutTime.push({flowName: keyString, seconds: value, flowCode: key});
      }
      this.isLoading = false;
    }

    public saveChanges(): void {
      this.npsService.setTimeoutTime(this.timeoutTimeInfo)
        .then(() => {
          this.modalService.openModal('saveNpsTimeoutTimeSuccess')
            .then((btnPressed) => {
              if (btnPressed === 'right') {
                this.router.navigateByUrl('/home');
              }
              if (btnPressed === 'left') {
                this.ngOnInit();
              }
            });
        })
        .catch(() => {
          this.modalService.openModal('genericError')
            .then((btnPressed) => {
              if (btnPressed === 'right') {
                this.router.navigate(['/home']);
              }
            });
        });
    }

}
