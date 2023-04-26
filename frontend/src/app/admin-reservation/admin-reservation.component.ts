import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/router';
import { DeskService } from '../desk.service';
import { DeskReservationService } from '../desk-reservation.service';
import { Desk, DeskReservation, User, DeskEntry } from '../models';
import { permissionGuard } from '../permission.guard';
import { FormControl, Validators } from '@angular/forms';

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

  displayedColumns: string[] = ['pid', 'email', 'time', 'desk_tag', 'desk_type', 'included_resource', 'remove'];

  displayedColumnsDesks: string[] = ['desk_tag', 'desk_type', 'included_resource', 'available', 'reserve'];

  allDeskReservationsList: [DeskReservation, Desk, User][] = [];
  allDesks: Desk[] = [];
  newDeskTag: FormControl
  newDeskType: FormControl
  newDeskIncludedResource: FormControl
  constructor(
    private deskService: DeskService, private deskReservationService: DeskReservationService,
  ) {
    this.newDeskTag = new FormControl('', [Validators.required, this.existingDeskTagValidator.bind(this)]);
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
    let deskTag: string = this.newDeskTag.value;
    let deskType: string = this.newDeskType.value;
    let includedResource: string = this.newDeskIncludedResource.value;
    let deskForm: DeskEntry = {tag: deskTag, desk_type: deskType, included_resource: includedResource, available: true};
    this.deskService.createDesk(deskForm).subscribe();
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