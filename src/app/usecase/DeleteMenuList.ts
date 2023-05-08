import { Injectable } from '@angular/core';
import { DatabasePort } from '../ports/database.port';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeleteMenuListUseCase {
  constructor(private databasePort: DatabasePort) {}

  eliminarMenuList(dataId: string) {
      this.databasePort.deleteMenuList(dataId);
  }
}
