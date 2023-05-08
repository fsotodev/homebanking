import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { CampaignsEngineService } from '@apps/services/campaigns-engine.service';

export const screenIdValidator = (campaignService: CampaignsEngineService): AsyncValidatorFn =>
  (ctrl: AbstractControl) => campaignService
    .checkIfScreenExists(ctrl.value)
    .then((result) => result ? { screenExistance: 'El id ya está en uso' } : null)
    .catch((err) => {
      console.log(`Error checking if document exists: \n${err}`);
      return { screenExistance: 'No se pudo verificar el id' };
    });
