import { Injectable } from '@angular/core';
import { DatabasePort } from '../ports/database.port';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebMenuListUseCase {
menuList$!: Observable<any[]>;
  constructor(private databasePort: DatabasePort) {}

  obtenerMenuList() {
      this.menuList$ = this.databasePort.getMenuList();
    return this.menuList$;
  }
}
