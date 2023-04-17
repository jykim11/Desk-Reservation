import { Component, OnInit, Inject} from '@angular/core';
import { Route } from '@angular/router';
import { isAuthenticated } from '../gate/gate.guard';
<<<<<<< HEAD
import { DeskService} from '../desk.service';
import { Desk, DeskReservation, DeskReservationTuple } from '../models';
=======
import { DeskService, Desk } from '../desk.service';
>>>>>>> stage
// import { MatDatepickerModule } from '@angular/material/datepicker';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
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
    title: 'Reserve',
    canActivate: [isAuthenticated]
  }

  

  // Dummy desk array until backend can fetch database.
  // public desk$: Observable<Desk[]>
  desk: Desk[] = [];
  deskReservationsList: [DeskReservation, Desk][] = [];
  // For table display in reservation.html
  displayedColumns: string[] = ['desk_tag', 'desk_type', 'included_resource', 'available','reserve'];

<<<<<<< HEAD
  dipslayedColumnsReservations: string[] = ['desk_tag', 'desk_type', 'included_resource', 'available', 'date', 'cancel'];

=======
>>>>>>> stage
  animal: string = "";
  name: string = "";

  constructor(
    private deskService: DeskService, private _formBuilder: FormBuilder, public dialog: MatDialog
  ) { 
    selectedDate: Date;
    selectedTime: Date;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ReservationDialogComponent, {
      data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  ngOnInit(): void {
    this.getDesk();
    this.getDeskReservations();
  }

  getDesk(): void {
    this.deskService.getDesk().subscribe(desks => {
      this.desk = desks;
<<<<<<< HEAD
      console.log(this.desk)
    })
  }

  getDeskReservations(): void {
    this.deskService.getReservations().subscribe(deskReservations => {
      this.deskReservationsList = deskReservations;
      console.log(this.deskReservationsList[0][1].tag);
      console.log(this.deskReservationsList[0][1].desk_type);

      
=======

>>>>>>> stage
    })
  }

}
