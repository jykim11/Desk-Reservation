import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeskReservationService } from '../desk-reservation.service';
import { Desk } from '../models';

@Component({
  selector: 'app-reservation-dialog',
  templateUrl: './reservation-dialog.component.html',
  styleUrls: ['./reservation-dialog.component.css']
})

export class ReservationDialogComponent {

  chosenDate!: Date;
  chosenTime!: string;
  chosenDesk: Desk;
  minDate: Date;
  maxDate: Date;
  reservedDates: Date[] = [];
  reservedTimes: Date[] = [];
  times = ['9:00 A.M.', '10:00 A.M.', '11:00 A.M', '12:00 P.M.', '1:00 P.M.', '2:00 P.M.', '3:00 P.M.', '4:00 P.M.'];

  constructor(
    private deskReservationService: DeskReservationService,
    public dialogRef: MatDialogRef<ReservationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.chosenDesk = data.myDesk;
    this.minDate = new Date();
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 30);
    this.deskReservationService.getDeskReservationDeskId(this.chosenDesk).subscribe(res => {
      res.forEach(reservation => {
        this.reservedDates.push(new Date(reservation.date));
      })
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {
    this.dialogRef.close();
    let chosenDateTime = this.parseDateTime(this.chosenDate, this.chosenTime);
    chosenDateTime.setTime(chosenDateTime.getTime() - chosenDateTime.getTimezoneOffset() * 1000 * 60);
    this.deskReservationService.createDeskReservation(this.chosenDesk, { date: chosenDateTime }).subscribe();
  }


  filterDates = (d: Date | null): boolean => {
    const date = (d || new Date());
    const day = (d || new Date()).getDay();
    if (day == 0 || day == 6) { return false; }
    else if (this.reservedDates.some((resDate) => resDate.toDateString() == date.toDateString())) {
      let counter = 0;
      this.reservedDates.forEach((resDate) => { if (resDate.toDateString() == date.toDateString()) { counter++; } })
      if (counter == 8) { return false; }
    }
    return true
  }


  isReserved(date: Date, time: string): boolean {
    return this.reservedDates.some((resDate) => resDate.toString() == this.parseDateTime(date, time).toString());
  }

  parseDateTime(date: Date, time: string): Date {
    if (time.includes('P.M.')) {
      time = time.split(':')[0];
      if (time != '12') {
        time = String(Number(time) + 12);
      }
    } else {
      time = time.split(':')[0];
    }
    let chosenDateTime = date;
    chosenDateTime.setHours(Number(time));
    return chosenDateTime;
  }
}
