import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MasterDataService } from 'src/app/core';
import { LoaderService } from 'src/app/shared/components';
import { AgreementService } from '../../services';
import { AddEmployeExpenseComponent } from '../add-employe-expense/add-employe-expense.component';

@Component({
  selector: 'ems-list-employee-expense',
  templateUrl: './list-employee-expense.component.html',
  styleUrls: ['./list-employee-expense.component.scss'],
})
export class ListEmployeeExpenseComponent {
  displayedColumns: string[] = [
    'id',
    'agreement',
    'name',
    'day',
    'work_date',
    'kooli_paid',
    'action',
  ];
  dataSource: any;

  constructor(
    public dialog: MatDialog,
    private masterDataService: MasterDataService,
    private agreementService: AgreementService,
    private loaderService: LoaderService
  ) {
    this.getEmpExpenseList();
  }

  getEmpExpenseList(): void {
    this.loaderService.show();
    this.agreementService.getEmpExpense().subscribe((data) => {
      this.loaderService.hide();
      if (data && data.results) {
        this.dataSource = data.results;
      }
    });
  }

  editEmployeeExpense(ID: number): void {
    const instance = this.dialog.open(
      AddEmployeExpenseComponent
    ).componentInstance;
    instance.editMode = {
      isActive: true,
      agreementID: ID,
    };
  }
}
