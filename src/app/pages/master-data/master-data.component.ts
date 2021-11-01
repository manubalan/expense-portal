import { Component, OnInit } from '@angular/core';
const ELEMENT_DATA: any[] = [
  { position: 1, name: 'Hydrogen', phone: 1.0079 },
  { position: 2, name: 'Helium', phone: 4.0026 },
  { position: 3, name: 'Lithium', phone: 6.941 },
  { position: 4, name: 'Beryllium', phone: 9.0122 },
  { position: 5, name: 'Boron', phone: 10.811 },
  { position: 6, name: 'Carbon', phone: 12.0107 },
  { position: 7, name: 'Nitrogen', phone: 14.0067 },
  { position: 8, name: 'Oxygen', phone: 15.9994 },
  { position: 9, name: 'Fluorine', phone: 18.9984 },
  { position: 10, name: 'Neon', phone: 20.1797 },
];
@Component({
  selector: 'ems-master-data',
  templateUrl: './master-data.component.html',
  styleUrls: ['./master-data.component.scss'],
})
export class MasterDataComponent implements OnInit {
  displayedColumns: string[] = ['no', 'name', 'phone'];
  dataSource = ELEMENT_DATA;
  constructor() {}

  ngOnInit(): void {}
}
