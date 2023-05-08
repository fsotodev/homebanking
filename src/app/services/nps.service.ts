import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { InhibitionTime, TimeoutTime } from '../models/nps';

@Injectable()
export class NpsService {

  constructor(
        private firebaseService: FirebaseService,
  ) { }

  public async getInhibitionTime(): Promise<InhibitionTime> {
    const querySnapshot = await this.firebaseService.getFirebaseCollection('NPS-TimeManagement').doc('NPS-Type').ref.get();
    return {...querySnapshot.data()} as InhibitionTime;
  }

  public async setInhibitionTime(inhibitionTime: InhibitionTime): Promise<any> {
    const inhibitionTimeToUpdate = this.generateInhibitionTimeData(inhibitionTime);
    const querySnapshot = await this.firebaseService.getFirebaseCollection('NPS-TimeManagement').doc('NPS-Type').ref;
    return await querySnapshot.set(inhibitionTimeToUpdate)
      .then(() => true)
      .catch((error) => console.log(error));
  }

  public async getTimeoutTime(): Promise<TimeoutTime> {
    const querySnapshot = await this.firebaseService.getFirebaseCollection('NPS-TimeManagement').doc('NPS-Timeout').ref.get();
    return {...querySnapshot.data()} as TimeoutTime;
  }

  public async setTimeoutTime(timeoutTime: TimeoutTime): Promise<any> {
    const querySnapshot = await this.firebaseService.getFirebaseCollection('NPS-TimeManagement').doc('NPS-Timeout').ref;
    return await querySnapshot.set(timeoutTime)
      .then(() => true)
      .catch((error) => console.log(error));
  }

  private generateInhibitionTimeData(type: InhibitionTime): any {
    return {
      Dias: {
        'Última respuesta': type['Dias']['Última respuesta'],
        Otros: type['Dias']['Otros'],
        TEF: type['Dias']['TEF'],
        Venta: type['Dias']['Venta'],
        Pagos: type['Dias']['Pagos']
      }
    };
  }
}
