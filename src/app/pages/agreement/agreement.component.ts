import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddAgreementComponent } from './components/add-agreement/add-agreement.component';
import { MasterDataService } from '../../core/services/master-data.service';
import { AgreementService } from './services';
import { AgreementListResponseModel } from 'src/app/core';
import { LoaderService } from 'src/app/shared/components';

@Component({
  selector: 'ems-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss'],
})
export class AgreementComponent implements OnInit {
  empExpenseListResult: any;

  constructor(
    public dialog: MatDialog,
    private masterDataService: MasterDataService,
    private agreementService: AgreementService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.getEmpExpenseList();
  }

  getEmpExpenseList(): void {
    this.loaderService.show();
    this.agreementService.getEmpExpense().subscribe((data) => {
      this.loaderService.hide();
      if (data) {
        this.empExpenseListResult = data;
      }
    });
  }

  addAgreementDialog(): void {
    this.dialog.open(AddAgreementComponent);
  }
}
