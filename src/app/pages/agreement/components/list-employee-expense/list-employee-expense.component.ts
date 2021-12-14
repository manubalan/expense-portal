import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  MasterDataService,
  PageAttrEventModel,
  PageAttrModel,
  PAGE_ATTR_DATA,
} from 'src/app/core';
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
  pageAttributes: PageAttrModel = { ...PAGE_ATTR_DATA };

  subscriptionArray: Subscription[] = [];

  hasResult = false;
  employeeFilterForm: FormGroup;
  agreementList: any[] = [];
  employeeList: any[] = [];
  workTypeList: any[] = [];

  constructor(
    public dialog: MatDialog,
    private agreementService: AgreementService,
    private loaderService: LoaderService,
    private dialogeService: DialogBoxService,
    private snackBarService: SnackBarService,
    private fBuilder: FormBuilder,
    private masterService: MasterDataService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.employeeFilterForm = this.fBuilder.group({
      agreement: new FormControl(null),
      employee: new FormControl(null),
      workType: new FormControl(null),
      startDate: new FormControl(null),
      endDate: new FormControl(null)
    });

    this.setFilterLists();
    this.searchNow();

    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    const subjectSubs = this.agreementService.vehicleExpUpdated$.subscribe(
      (update) => {
        if (update) {
          this.searchNow();
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
    this.searchNow();
  }

  // Filter Functions
  public employeeOptionView(option: any): string {
    return option ? option.name : '';
  }

  public agreementOptionView(option: any): string {
    return option ? `${option.agreement_number} - ${option.name}` : '';
  }

  setFilterLists(): void {
    this.setAgreementList();
    this.setEmployeeList();
    this.setWorkTypeList();
    this.detectFilterForms();
  }

  setAgreementList(search?: string): void {
    this.loaderService.show();
    const agreementSubs = this.agreementService
      .getAgreements(
        search !== null && search !== undefined
          ? `?search=${search}`
          : undefined
      )
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.agreementList = data.results;
        }
      });

    this.subscriptionArray.push(agreementSubs);
  }

  setEmployeeList(search?: string): void {
    this.loaderService.show();
    const empSubs = this.masterService
      .getEmployeesList(
        search !== null && search !== undefined
          ? `?search=${search}`
          : undefined
      )
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.employeeList = data.results;
        }
      });
    this.subscriptionArray.push(empSubs);
  }

  setWorkTypeList(search?: string): void {
    this.loaderService.show();
    const workSubs = this.masterService
      .getWorktypesList(
        search !== null && search !== undefined
          ? `?search=${search}`
          : undefined
      )
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.workTypeList = data.results;
        }
      });
    this.subscriptionArray.push(workSubs);
  }

  detectFilterForms(): void {
    const detectSubs = this.employeeFilterForm
      .get('agreement')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.setAgreementList(value);
      });
    if (detectSubs) this.subscriptionArray.push(detectSubs);

    const empSubs = this.employeeFilterForm
      .get('employee')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.setEmployeeList(value);
      });
    if (empSubs) this.subscriptionArray.push(empSubs);

    const workSubs = this.employeeFilterForm
      .get('workType')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.setWorkTypeList(value);
      });
    if (workSubs) this.subscriptionArray.push(workSubs);
  }

  searchNow(): void {
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

    if (
      this.employeeFilterForm.value.agreement &&
      this.employeeFilterForm.value.agreement.id
    ) {
      paramList.push(`agreement=${this.employeeFilterForm.value.agreement.id}`);
    }

    if (
      this.employeeFilterForm.value.employee &&
      this.employeeFilterForm.value.employee.id
    ) {
      paramList.push(`name=${this.employeeFilterForm.value.employee.id}`);
    }

    if (
      this.employeeFilterForm.value.workType &&
      this.employeeFilterForm.value.workType.id
    ) {
      paramList.push(`work_type=${this.employeeFilterForm.value.workType.id}`);
    }

    if (this.employeeFilterForm.value.startDate) {
      paramList.push(
        `from_date=${moment(this.employeeFilterForm.value.startDate).format(
          'YYYY-MM-DD'
        )}`
      );
    }

    if (this.employeeFilterForm.value.endDate) {
      paramList.push(
        `to_date=${moment(this.employeeFilterForm.value.endDate).format(
          'YYYY-MM-DD'
        )}`
      );
    }

    if (paramList.length > 0) {
      paramList.map((par) => {
        paramUrl = paramUrl + par + '&';
      });
    }

    this.loaderService.show();
    this.agreementService
      .getEmpExpense(`?` + paramUrl.slice(0, -1))
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.dataSource = data.results;
          this.hasResult = data.results.length > 0 ? true : false;
          if (data.count) this.pageAttributes.totalRecord = data.count;
        }
      });
  }

  resetSearch(): void {
    this.employeeFilterForm.reset();
    this.pageAttributes.pageSize = this.pageAttributes.pageSizeOpt[0];
    this.pageAttributes.currentPage = 0;
    this.searchNow();
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
