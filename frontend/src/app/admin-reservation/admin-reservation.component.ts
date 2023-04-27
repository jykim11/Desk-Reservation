import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/router';
import { DeskService } from '../desk.service';
import { DeskReservationService } from '../desk-reservation.service';
import { Desk, DeskReservation, User, DeskEntry } from '../models';
import { permissionGuard } from '../permission.guard';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface TypeSelector {
  value: string;
}

@Component({
  selector: 'app-admin-reservation',
  templateUrl: './admin-reservation.component.html',
  styleUrls: ['./admin-reservation.component.css']
})
export class AdminReservationComponent implements OnInit {

  typeoptions: TypeSelector[] = [
    { value: 'Computer Desk' },
    { value: 'Standing Desk' },
    { value: 'Open Study Desk' },
    { value: 'Enclosed Study Desk' },
    { value: 'Enclosed Study Office' },
  ];

  inc_resource_options: TypeSelector[] = [
    { value: '' },
    { value: 'Windows Desktop i5' },
    { value: 'Windows Desktop i7' },
    { value: 'Windows Desktop i9' },
    { value: 'iMac 24 w/ Mac Mini' },
    { value: 'iMac 24 w/ Mac Pro' },
    { value: 'iMac 24 w/ Mac Studio' },
    { value: 'Studio Display w/ Mac Mini' },
    { value: 'Studio Display w/ Mac Pro' },
    { value: 'Studio Display w/ Mac Studio' },
    { value: 'Pro Display XDR w/ Mac Mini' },
    { value: 'Pro Display XDR w/ Mac Pro' },
    { value: 'Pro Display XDR w/ Mac Studio' },
  ];

  public static Route: Route = {
    path: 'admin-reservation',
    component: AdminReservationComponent,
    title: 'Reservation Administration',
    canActivate: [permissionGuard('admin/', '*')]
  }

  public links = [
    { label: 'Users', path: '/admin/users' },
    { label: 'Roles', path: '/admin/roles' },
    { label: 'Reservations', path: '/admin-reservation' },
  ];

  selectedType!: string;

  displayedColumns: string[] = ['pid', 'email', 'time', 'desk_tag', 'desk_type', 'included_resource', 'remove'];

  displayedColumnsDesks: string[] = ['desk_tag', 'desk_type', 'included_resource', 'available', 'reserve'];

  allDeskReservationsList: [DeskReservation, Desk, User][] = [];
  allDesks: Desk[] = [];
  newDeskTag: FormControl
  newDeskType: FormControl
  newDeskIncludedResource: FormControl

  constructor(
    private deskService: DeskService,
    private deskReservationService: DeskReservationService,
    private router: Router,
    protected snackBar: MatSnackBar
  ) {
    this.newDeskTag = new FormControl('',
      [Validators.required,
      this.existingDeskTagValidator.bind(this),
      ]);

    this.newDeskType = new FormControl('', [Validators.required]);
    this.newDeskIncludedResource = new FormControl('',);
  }

  ngOnInit(): void {
    this.getAllDeskReservations();
    this.getAllDesks();
  }

  existingDeskTagValidator(control: FormControl): { [key: string]: boolean } | null {
    if (this.allDesks.find(desk => desk.tag.toLowerCase() === control.value.toLowerCase())) {
      return { existingDeskTag: true };
    }
    return null;
  }

  /**
   * Create a new desk in the database.
   * Only available to Admin or users who have permission.
   * 
   */
  createDesk() {
    this.newDeskTag.setValue(this.newDeskTag.value.toUpperCase());
    let deskTag: string = this.newDeskTag.value;
    let deskType: string = this.newDeskType.value;
    let includedResource: string = this.newDeskIncludedResource.value;
    let deskForm: DeskEntry = { tag: deskTag, desk_type: deskType, included_resource: includedResource, available: true };

    // Sorts the desk by tag when the desk is being created.
    this.deskService.createDesk(deskForm).subscribe(() => {
      this.allDesks.sort((a, b) => a.tag.localeCompare(b.tag));
    });

    this.snackBar.open(`Desk ${deskTag} Added`, "", { duration: 4000, panelClass: ['center-text'] })
    this.reloadPage();

  }


  /**
   * Remove a desk in the database.
   * Only available to Admin or users who have permission.
   */
  removeDesk(desk: Desk) {
    this.deskService.removeDesk(desk).subscribe();
    this.snackBar.open(`Desk ${desk.tag} Removed.`, "", { duration: 4000, panelClass: ['center-text'] })
    this.reloadPage();
  }


  /**
   * Retrieve all desks that are in the database.
   * The lists are sorted by Desk Tag.
   */
  getAllDesks(): void {
    this.deskService.getAllDesks().subscribe(
      desks => {
        this.allDesks = desks.sort((a, b) => a.tag.localeCompare(b.tag));
      })
  }


  /**
   * FOR ADMIN:
   * Retrieve all desk reservations for admin view.
   * 
   */
  getAllDeskReservations(): void {
    this.deskReservationService.getAllDeskReservations().subscribe(
      deskReservations => {
        this.allDeskReservationsList = deskReservations;
      }
    )
  }

  /**
   * Cancel/Unreserve a Reserved a desk.
   *
   */
  removeDeskReservation(deskReservationsListItem: [DeskReservation, Desk, User]): void {

    let reservationDate = new Date(deskReservationsListItem[0].date);
    let reservationTime = reservationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let pid = deskReservationsListItem[2].pid;

    let formattedDate = reservationDate.toLocaleDateString('en-US',
      {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })

    this.deskReservationService.removeDeskReservation(deskReservationsListItem[1], deskReservationsListItem[0]).subscribe();

    let message = `Desk Reservation on ${formattedDate} at ${reservationTime} Canceled. \n (Admin Override - PID: ${pid})`
    this.snackBar.open(message, '', { duration: 4000, panelClass: ['center-text', 'success-snackbar'] });

    this.reloadPage();

  }


  reloadPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/admin-reservation']);
    });
  }

}