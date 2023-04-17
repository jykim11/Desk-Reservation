import { Component, OnInit, Inject} from '@angular/core';
import { Route } from '@angular/router';
import { isAuthenticated } from '../gate/gate.guard';
import { DeskService} from '../desk.service';
import { DeskReservationService } from '../desk-reservation.service';
import { Desk, DeskReservation, User } from '../models';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReservationDialogComponent } from '../reservation-dialog/reservation-dialog.component';

@Component({
  selector: 'app-admin-reservation',
  templateUrl: './admin-reservation.component.html',
  styleUrls: ['./admin-reservation.component.css']
})
export class AdminReservationComponent implements OnInit {
    public static Route: Route = {
      path: 'admin-reservation',
      component: AdminReservationComponent,
      title: 'Reservation Administration',
      canActivate: [isAuthenticated]
    }

    displayedColumns: string[] = ['pid', 'email', 'time', 'desk_tag', 'desk_type', 'included_resource','remove'];

    displayedColumnsDesks: string[] = ['desk_tag', 'desk_type', 'included_resource', 'available','reserve'];

    allDeskReservationsList: [DeskReservation, Desk, User][] = [];
    allDesks: Desk[] = [];
    constructor(
      private deskService: DeskService,
    ){}

  ngOnInit(): void {
    this.getAllReservations();
    this.getAllDesks();
  }

  getAllReservations(): void {
    this.deskService.getAllDeskReservations().subscribe(
      deskReservations => {
        this.allDeskReservationsList = deskReservations;
        console.log(this.allDeskReservationsList[0][0].date)
      }
    )
  }

  getAllDesks(): void {
    this.deskService.getAllDesks().subscribe(
      desks => {
        this.allDesks = desks;
        console.log(this.allDesks)
      }
    )
  }

}
