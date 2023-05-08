import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError as observableThrowError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseAdapter {
  private apiUrl = 'http://localhost:3000/api/v1/test/';

  constructor(private http: HttpClient) { }

  getMenuList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}webMenus`).pipe(map(data => data['webRpgoMenus'].data));
  }

  async deleteMenuList(dataId: String): Promise<void> {
    return this.http.get<void>(`${this.apiUrl}deleteWebMenus?dataId=${dataId}`).toPromise();
  }

}

export default DatabaseAdapter;