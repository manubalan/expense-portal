import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddAgreementComponent } from './components/add-agreement/add-agreement.component';
import { MasterDataService } from '../../core/services/master-data.service';
import { AgreementService } from './services';
import { AgreementListModel } from 'src/app/core';

@Component({
  selector: 'ems-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss'],
})
export class AgreementComponent implements OnInit {
  agreementListResult: AgreementListModel = {};
  empExpenseListResult: any;
  vehicleExpenseListResult: any;

  constructor(
    public dialog: MatDialog,
    private masterDataService: MasterDataService,
    private agreementService: AgreementService
  ) {}

  ngOnInit(): void {
    this.getAgreementList();
    this.getEmpExpenseList();
    this.getVehicleExpenseList();
  }

  getAgreementList(): void {
    this.agreementService.getAgreements().subscribe((data) => {
      console.log('AGREEMENTS LIST =>', data);
      if (data) {
        this.agreementListResult = data;
      }
    });
  }

  getEmpExpenseList(): void {
    this.agreementService.getEmpExpense().subscribe((data) => {
      console.log('EMP EXPENSE LIST =>', data);
      if (data) {
        this.empExpenseListResult = data;
      }
    });
  }

  getVehicleExpenseList(): void {
    this.agreementService.getVehicleExpense().subscribe((data) => {
      console.log('EMP EXPENSE LIST =>', data);
      if (data) {
        this.vehicleExpenseListResult = data;
      }
    });
  }

  addAgreementDialog(): void {
    this.dialog.open(AddAgreementComponent);
  }
}
