import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, mergeMap, of } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Desk, DeskReservation, DeskReservationEntry } from './models';
@Injectable({
  providedIn: 'root'
})
export class DeskReservationService {

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
  ) { }

  createDeskReservation(desk: Desk, reservation: DeskReservationEntry): Observable<DeskReservation> {
    console.log({desk, reservation})
    return this.http.post<DeskReservation>('/api/reservation/reserve', {desk, reservation});
  }

  cancelDeskReservation(desk: Desk, reservation: DeskReservation): Observable<DeskReservation> {
    return this.http.post<DeskReservation>('/api/reservation/unreserve', {desk, reservation});
  }
}