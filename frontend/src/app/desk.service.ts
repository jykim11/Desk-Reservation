import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, mergeMap, of } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Desk, DeskReservation, User } from './models';

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

  getAllDesks(): Observable<Desk[]> {
    return this.http.get<Desk[]>('/api/reservation');
  }

  getReservations(): Observable<[[DeskReservation, Desk]]> {
    return this.http.get<[[DeskReservation, Desk]]>('/api/reservation/desk_reservations')
  };

  getAllDeskReservations(): Observable<[[DeskReservation, Desk, User]]> {
    return this.http.get<[[DeskReservation, Desk, User]]>('/api/reservation/admin/all')
  }

}
