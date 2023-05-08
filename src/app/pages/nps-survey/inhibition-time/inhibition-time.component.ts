import { Component, OnInit } from '@angular/core';
import { InhibitionTime } from '../../../models/nps';
import { NpsService } from '../../../services/nps.service';
import { ModalDialogService } from '../../../services/modal-dialog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inhibition-time',
  templateUrl: './inhibition-time.component.html',
  styleUrls: ['./inhibition-time.component.scss']
})

export class InhibitionTimeComponent implements OnInit {
    public displayedColumns: string[] = ['flowType', 'days', 'description'];
    public inhibitionTime: Array<{flowType: string; days: number; description: string}> = [];
    public inhibitionTimeInfo: InhibitionTime;
    public isLoading = true;
    constructor(
        private npsService: NpsService,
        private modalService: ModalDialogService,
        private router: Router
    ) { }

    async ngOnInit() {
      await this.getInhibitionTime();
    }

    public setDaysOnSurvey(setType: Array<{flowType: string; days: number; description: string}>): void {
      this.inhibitionTimeInfo['Dias'][setType['flowType']] = setType['days'];
    }

    public saveChanges(): void {
      this.npsService.setInhibitionTime(this.inhibitionTimeInfo)
        .then(() => {
          this.modalService.openModal('saveNpsInhibitionTimeSuccess')
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

    private async getInhibitionTime() {
      this.inhibitionTimeInfo = await this.npsService.getInhibitionTime();
      const descriptionDic = {
        Otros: 'el flujo Otros, luego de recibir un modal sobre una encuesta del grupo Otros',
        Pagos: 'el flujo Pagos, luego de recibir un modal sobre una encuesta del grupo Pagos',
        TEF: 'el flujo TEF, luego de recibir un modal sobre una encuesta del grupo TEF',
        Venta: 'el flujo Venta, luego de recibir un modal sobre una encuesta del grupo Venta',
        'Última respuesta': 'en todos los flujos que correspondan a grupos distintos a la última encuesta que le apareció al cliente'
      };
      for (const [key, value] of Object.entries(this.inhibitionTimeInfo['Dias'])) {
        this.inhibitionTime.push({flowType: key.toString(), days: value, description: descriptionDic[key]});
      }
      this.isLoading = false;
    }
}
