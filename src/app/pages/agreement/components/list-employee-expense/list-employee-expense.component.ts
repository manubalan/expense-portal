import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MasterDataService } from 'src/app/core';
import {
  DialogBoxService,
  LoaderService,
  SnackBarService,
} from 'src/app/shared/components';
import { AgreementService } from '../../services';
import { AddEmployeExpenseComponent } from '../add-employe-expense/add-employe-expense.component';

@Component({
  selector: 'ems-list-employee-expense',
  templateUrl: './list-employee-expense.component.html',
  styleUrls: ['./list-employee-expense.component.scss'],
})
export class ListEmployeeExpenseComponent implements OnInit, OnDestroy {
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
  subscriptionArray: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    private masterDataService: MasterDataService,
    private agreementService: AgreementService,
    private loaderService: LoaderService,
    private dialogeService: DialogBoxService,
    private snackBarService: SnackBarService
  ) {
    this.getEmpExpenseList();
  }

  ngOnInit(): void {
    const subjectSubs = this.agreementService.vehicleExpUpdated$.subscribe(
      (update) => {
        if (update) {
          this.getEmpExpenseList();
        }
      }
    );

    this.subscriptionArray.push(subjectSubs);
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

  deleteEmployeeExpense(ID: number): void {
    const ref = this.dialogeService.openDialog('Are sure want to delete ?');
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loaderService.show();
        const deleSubs = this.agreementService
          .deleteEmployeeExp(ID)
          .subscribe((response) => {
            this.agreementService.vehicleExpUpdated$.next(true);
            this.snackBarService.success(
              'Exployee Expense removed Successfully ! ',
              'Done'
            );
            this.loaderService.hide();
          });

        this.subscriptionArray.push(deleSubs);
      }
    });
  }

  ngOnDestroy(): void {
    this.agreementService.vehicleExpUpdated$.complete();
    if (this.subscriptionArray.length > 0) {
      this.subscriptionArray.forEach((subs) => {
        subs.unsubscribe();
      });
    }
  }
}
