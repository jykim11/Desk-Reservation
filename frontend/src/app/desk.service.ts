import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, mergeMap, of } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Desk, DeskReservation, DeskReservationTuple } from './models';
// export interface Desk {
//   id: number;
//   name: string;
//   available: boolean;
// }

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
    return this.http.get<Desk[]>('/api/reservation/available');
  }

  getReservations(): Observable<[[DeskReservation, Desk]]> {
    console.log(this.http.get<[[DeskReservation, Desk]]>('/api/reservation/desk_reservations'));
    return this.http.get<[[DeskReservation, Desk]]>('/api/reservation/desk_reservations')};
}
