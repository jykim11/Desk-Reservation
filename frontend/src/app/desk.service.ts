import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, mergeMap, of } from 'rxjs';
import { AuthenticationService } from './authentication.service';

export interface Desk {
  id: number;
  name: string;
  available: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DeskService {

  public desk$!: Observable<Desk | undefined>;

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
  ) { }

  /**
   * Retrieve all desks that are available.
   * 
   * @returns observable array of Desk objects.
   */

  getDesk(): Observable<Desk[]> {
    // this.desk$ = this.auth.isAuthenticated$.pipe(
    //   mergeMap(isAuthenticated => {
    //     if (isAuthenticated) {
    //       return this.http.get<Desk>('/api/reservation');
    //     } else {
    //       return of(undefined);
    //     }
    //   })
    // );
    return this.http.get<Desk[]>('/api/reservation');
  }
}
