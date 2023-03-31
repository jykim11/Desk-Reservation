import { Component } from '@angular/core';


interface Equipment {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent {
  equipments: Equipment[] = [
    {value: 'Macbook', viewValue: 'Macbook'},
    {value: 'Windows-Laptop', viewValue: 'Windows-Laptop'},
    {value: 'Windows-Desktop', viewValue: 'Windows-Desktop'},
    {value: 'Keyboard', viewValue: 'Keyboard'},
  ];
}
