import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/router';
import { isAuthenticated } from '../gate/gate.guard';
import { DeskService } from '../desk.service';
import { DeskReservationService } from '../desk-reservation.service';
import { Desk, DeskReservation } from '../models';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReservationDialogComponent } from '../reservation-dialog/reservation-dialog.component';


export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']

})
export class ReservationComponent implements OnInit {

  public static Route: Route = {
    path: 'reservation',
    component: ReservationComponent,
    title: 'Reservation',
    canActivate: [isAuthenticated]
  }


  desk: Desk[] = [];
  deskReservationsList: [DeskReservation, Desk][] = [];

  resTime: Date = new Date();
  displayedColumns: string[] = ['desk_tag', 'desk_type', 'included_resource', 'reserve'];
  dipslayedColumnsReservations: string[] = ['desk_tag', 'desk_type', 'included_resource', 'date', 'cancel'];



  constructor(
    private deskService: DeskService, private deskReservationService: DeskReservationService, private _formBuilder: FormBuilder, public dialog: MatDialog
  ) {
    selectedDate: Date;
    selectedTime: Date;
  }

  openDialog(selectedDesk: Desk): void {
    const dialogRef = this.dialog.open(ReservationDialogComponent, {
      data: { myDesk: selectedDesk },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.resTime = result;
      console.log(this.resTime)
      console.log(result)

      console.log('reached here')
      this.reloadPage();
    });
  }

  ngOnInit(): void {
    this.getAvailableDesks();
    this.getDeskReservationsByUser();
  }

  /**
   * Retrieve all desks that are available.
   * 
   */
  getAvailableDesks(): void {
    this.deskService.getAvailableDesks().subscribe(desks => {
      this.desk = desks;
      console.log(this.desk)
    })
  }


  /**
   * Retrieve the list of desk reservations by User.
   * 
   */
  getDeskReservationsByUser(): void {
    this.deskReservationService.getDeskReservationsByUser().subscribe(deskReservations => {
      this.deskReservationsList = deskReservations;
    })
  }


  /**
   * Cancel/Unreserve a Reserved a desk.
   * 
   */
  removeDeskReservation(deskReservationsListItem: [DeskReservation, Desk]): void {
    this.deskReservationService.removeDeskReservation(deskReservationsListItem[1], deskReservationsListItem[0]).subscribe();
    console.log(deskReservationsListItem)
    this.reloadPage();
  }


  formatDate(date: Date): string {
    const isoString = date.toISOString();
    const parts = isoString.split('T')[0].split('-');
    return `${parts[0]}-${parts[1]}-${parts[2]}`;
  }

  reloadPage() {
    location.reload();
  }

}