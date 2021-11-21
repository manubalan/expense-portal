import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PageAttrEventModel, PageAttrModel, PAGE_ATTR_DATA } from 'src/app/core';
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
})
export class ListEmployeeExpenseComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [];
  dataSource: any;
  pageAttributes: PageAttrModel = PAGE_ATTR_DATA;

  subscriptionArray: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
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

    this.displayedColumns = [
      'agreement',
      'day',
      'name',
      'work_type_details',
      'work_date',
      'kooli',
      'kooli_paid',
      'paid_date',
      'action',
    ];
  }

  getEmpExpenseList(): void {
    const paramList = [];
    let paramUrl = '';
    if (this.pageAttributes.pageSize > 0) {
      paramList.push(`limit=${this.pageAttributes.pageSize}`);
    }
    if (this.pageAttributes.currentPage > 0) {
      paramList.push(
        `offset=${
          this.pageAttributes.currentPage * this.pageAttributes.pageSize
        }`
      );
    } else if (this.pageAttributes.currentPage === 0) {
      paramList.push(`offset=${this.pageAttributes.currentPage}`);
    }

    if (paramList.length > 0) {
      paramList.map((par) => {
        paramUrl = paramUrl + par + '&';
      });
    }

    this.loaderService.show();
    this.agreementService.getEmpExpense().subscribe((data) => {
      this.loaderService.hide();
      if (data && data.results) {
        this.dataSource = data.results;
        if (data.count) this.pageAttributes.totalRecord = data.count;
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

  handlePage(event: PageAttrEventModel): void {
    this.pageAttributes.pageSize = event.pageSize
      ? event.pageSize
      : this.pageAttributes.pageSize;
      if (event.pageIndex !== undefined)
      this.pageAttributes.currentPage =
        event.pageIndex >= 0
          ? event.pageIndex
          : this.pageAttributes.currentPage;
    this.pageAttributes.prevPage = event.previousPageIndex
      ? event.previousPageIndex
      : this.pageAttributes.prevPage;
    this.getEmpExpenseList();
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
