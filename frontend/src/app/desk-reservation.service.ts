import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Desk, DeskReservation, DeskReservationEntry, User } from './models';
@Injectable({
  providedIn: 'root'
})
export class DeskReservationService {

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
  ) { }


  /**
   * FOR ADMIN:
   * Retrieve all desk reservations for admin view.
   * 
   * @returns observable array of [DeskReservation, Desk, User].
   */
  getAllDeskReservations(): Observable<[[DeskReservation, Desk, User]]> {
    return this.http.get<[[DeskReservation, Desk, User]]>('/api/reservation/admin/all')
  }

  /**
   * Retrieve the list of desk reservations by User.
   * 
   * @returns observable array of DeskReservation objects.
   */
  getDeskReservationsByUser(): Observable<[[DeskReservation, Desk]]> {
    return this.http.get<[[DeskReservation, Desk]]>('/api/reservation/desk_reservations')
  };

  /**
   * Retrieve the list of desk reservations by Desk ID
   * 
   * @returns observable array of DeskReservation objects.
   */
  getDeskReservationDeskId(desk: Desk): Observable<DeskReservation[]> {
    return this.http.get<DeskReservation[]>(`/api/reservation/${desk.id}`);
  }

  /**
   * Reserve a desk to use.
   * 
   * @returns observable DeskReservation object.
   */
  createDeskReservation(desk: Desk, reservation: DeskReservationEntry): Observable<DeskReservation> {
    console.log({ desk, reservation })
    return this.http.post<DeskReservation>('/api/reservation/reserve', { desk, reservation });
  }

  /**
   * Cancel/Unreserve a Reserved a desk.
   * 
   * @returns observable DeskReservation object.
   */
  removeDeskReservation(desk: Desk, reservation: DeskReservation): Observable<DeskReservation> {
    return this.http.post<DeskReservation>('/api/reservation/unreserve', { desk, reservation });
  }

}