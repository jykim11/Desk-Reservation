import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/router';
import { isAuthenticated } from '../gate/gate.guard';
import { DeskService } from '../desk.service';
import { DeskReservationService } from '../desk-reservation.service';
import { Desk, DeskReservation } from '../models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ReservationDialogComponent } from '../reservation-dialog/reservation-dialog.component';
import { Router } from '@angular/router';


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
    private deskService: DeskService,
    private deskReservationService: DeskReservationService,
    public dialog: MatDialog,
    private router: Router,
    protected snackBar: MatSnackBar
  ) { }

  openDialog(selectedDesk: Desk): void {
    const dialogRef = this.dialog.open(ReservationDialogComponent, {
      data: { myDesk: selectedDesk },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.resTime = result;

      setTimeout(() => {
        this.reloadPage();
      }, 0);

    });
  }

  ngOnInit(): void {
    // Sorting the desk by Desk Tag (Alphabetically)
    this.deskService.getAvailableDesks().subscribe(desks => {
      this.desk = desks.sort((a, b) => a.tag.localeCompare(b.tag));
    });

    // Get the desk reservations
    this.deskReservationService.getDeskReservationsByUser().subscribe(reservations => {
      this.deskReservationsList = reservations;
    });
  }

  /**
   * Retrieve all desks that are available.
   * 
   */
  getAvailableDesks(): void {
    this.deskService.getAvailableDesks().subscribe(desks => {
      this.desk = desks;
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

    let reservationDate = new Date(deskReservationsListItem[0].date);
    let reservationTime = reservationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let formattedDate = reservationDate.toLocaleDateString('en-US',
      {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })

    this.deskReservationService.removeDeskReservation(deskReservationsListItem[1], deskReservationsListItem[0]).subscribe();

    let message = `Desk Reservation on ${formattedDate} at ${reservationTime} canceled`;
    this.snackBar.open(message, "", { duration: 4000 });

    this.reloadPage();
  }


  formatDate(date: Date): string {
    const isoString = date.toISOString();
    const parts = isoString.split('T')[0].split('-');
    return `${parts[0]}-${parts[1]}-${parts[2]}`;
  }

  /**
   * Disabled reloading to allow users to see the SnackBar after their actions.
   * 
   */
  reloadPage(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/reservation']);
    });

  }

}