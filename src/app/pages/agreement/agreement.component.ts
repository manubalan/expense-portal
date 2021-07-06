import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddAgreementComponent } from './components/add-agreement/add-agreement.component';
import { MasterDataService } from '../../core/services/master-data.service';

@Component({
  selector: 'ems-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss'],
})
export class AgreementComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private masterDataService: MasterDataService
  ) {}

  ngOnInit(): void {
    this.setMasterDatas();
  }

  setMasterDatas(): void {
    // const datas = {
    //   states: this.masterDataService.stateList.subscribe(el => el),
    //   district: this.masterDataService.districtsList.subscribe(el => el),
    //   location: this.masterDataService.locationsList.subscribe(el => el),
    // };
    // console.log('=======>', datas);
  }

  addAgreementDialog(): void {
    this.dialog.open(AddAgreementComponent);
  }
}
