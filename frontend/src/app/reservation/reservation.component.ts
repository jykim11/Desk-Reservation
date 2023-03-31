import { Component } from '@angular/core';
import { Route } from '@angular/router';
import { isAuthenticated } from '../gate/gate.guard';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent {

  public static Route: Route = {
    path: 'reservation',
    component: ReservationComponent,
    title: 'Reserve',
    canActivate: [isAuthenticated]
  }
}
