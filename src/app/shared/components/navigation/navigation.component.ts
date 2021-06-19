import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav/sidenav';
// import { MatSidenav } from '@angular/material';

@Component({
  selector: 'ems-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  @Input()
  sidenav!: MatSidenav;


  constructor() { }

  ngOnInit(): void {
  }

}
