import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddAgreementComponent } from './components/add-agreement/add-agreement.component';

@Component({
  selector: 'ems-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss'],
})
export class AgreementComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void { }
  
  addAgreementDialog(): void {
    this.dialog.open(AddAgreementComponent)
  }
}
