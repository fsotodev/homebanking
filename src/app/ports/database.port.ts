import { Injectable } from '@angular/core';
import { DatabaseAdapter } from '../adapters/database.adapter';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabasePort {
  constructor(private databaseAdapter: DatabaseAdapter) {}

  getMenuList(): Observable<any[]> {
    return this.databaseAdapter.getMenuList();
  }

  deleteMenuList(dataId: string): Promise<void> {
    return this.databaseAdapter.deleteMenuList(dataId);
  }
}