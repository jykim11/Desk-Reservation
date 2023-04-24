import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/router';
import { DeskService } from '../desk.service';
import { DeskReservationService } from '../desk-reservation.service';
import { Desk, DeskReservation, User, DeskEntry } from '../models';
import { permissionGuard } from '../permission.guard';

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
    { value: 'Windows Desktop i7' },
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

  selectedType!: string;

  public newDeskForm: DeskEntry = {
    tag: '',
    desk_type: '',
    included_resource: '',
    available: true
  };

  displayedColumns: string[] = ['pid', 'email', 'time', 'desk_tag', 'desk_type', 'included_resource', 'remove'];

  displayedColumnsDesks: string[] = ['desk_tag', 'desk_type', 'included_resource', 'available', 'reserve'];

  allDeskReservationsList: [DeskReservation, Desk, User][] = [];
  allDesks: Desk[] = [];
  constructor(
    private deskService: DeskService, private deskReservationService: DeskReservationService,
  ) { }

  ngOnInit(): void {
    this.getAllDeskReservations();
    this.getAllDesks();
  }

  /**
   * Create a new desk in the database.
   * Only available to Admin or users who have permission.
   * 
   */
  createDesk() {
    if (this.newDeskForm.tag === '' || this.newDeskForm.desk_type === '' || this.newDeskForm.available === null) {
      return;
    }
    this.deskService.createDesk(this.newDeskForm).subscribe();
    this.reloadPage();
  }


  /**
   * Remove a desk in the database.
   * Only available to Admin or users who have permission.
   */
  removeDesk(desk: Desk) {
    this.deskService.removeDesk(desk).subscribe();
    this.reloadPage();
  }


  /**
   * Retrieve all desks that are in the database.
   * 
   */
  getAllDesks(): void {
    this.deskService.getAllDesks().subscribe(
      desks => {
        this.allDesks = desks;
        console.log(this.allDesks)
      }
    )
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
        console.log(this.allDeskReservationsList[0][0].date)
      }
    )
  }


  /**
   * Cancel/Unreserve a Reserved a desk.
   *
   */
  removeDeskReservation(deskReservationsListItem: [DeskReservation, Desk, User]): void {
    this.deskReservationService.removeDeskReservation(deskReservationsListItem[1], deskReservationsListItem[0]).subscribe();
    console.log(deskReservationsListItem)
    this.reloadPage();
  }


  reloadPage() {
    location.reload();
  }

}