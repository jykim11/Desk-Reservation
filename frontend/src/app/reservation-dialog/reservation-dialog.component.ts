import { Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeskReservationService } from '../desk-reservation.service';
import { Desk } from '../models';
@Component({
  selector: 'app-reservation-dialog',
  templateUrl: './reservation-dialog.component.html',
  styleUrls: ['./reservation-dialog.component.css']
})

export class ReservationDialogComponent {

  chosenDateTime!: Date;
  chosenDesk: Desk;
  constructor(
    private deskresService: DeskReservationService,
    public dialogRef: MatDialogRef<ReservationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.chosenDesk = data.myDesk;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {
    this.dialogRef.close(this.chosenDateTime);

    this.deskresService.createDeskReservation(this.chosenDesk, {date: this.formatDate(this.chosenDateTime)}).subscribe();
    console.log(this.chosenDateTime);
    console.log(this.chosenDesk)
    
  }

  formatDate(date: Date): string {
    const isoString = date.toISOString();
    const parts = isoString.split('T')[0].split('-');
    return `${parts[0]}-${parts[1]}-${parts[2]}`;
  }
}
