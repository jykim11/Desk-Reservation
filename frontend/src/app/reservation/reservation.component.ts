import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/router';
import { isAuthenticated } from '../gate/gate.guard';
import { DeskService, Desk } from '../desk.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {

  public static Route: Route = {
    path: 'reservation',
    component: ReservationComponent,
    title: 'Reserve',
    canActivate: [isAuthenticated]
  }

  // Dummy desk array until backend can fetch database.
  // public desk$: Observable<Desk[]>
  desk: Desk[] = [];

  // For table display in reservation.html
  displayedColumns: string[] = ['name', 'available'];

  constructor(
    private deskService: DeskService
  ) { }

  ngOnInit(): void {
    this.getDesk();
  }

  getDesk(): void {
    this.deskService.getDesk().subscribe(desks => {
      this.desk = desks;
    })
  }

}
