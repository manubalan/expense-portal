import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddAgreementComponent } from './components/add-agreement/add-agreement.component';
import { MasterDataService } from './services/master-data.service';

@Component({
  selector: 'ems-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss'],
})
export class AgreementComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private masterData: MasterDataService
  ) {}

  ngOnInit(): void {
    // this.masterData.getMasterData();
  }

  addAgreementDialog(): void {
    this.dialog.open(AddAgreementComponent);
  }
}
