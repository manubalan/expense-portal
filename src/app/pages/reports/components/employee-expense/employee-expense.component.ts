import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  DAY_TYPES,
  MasterDataService,
  PAGE_ATTR_DATA,
  PageAttrEventModel,
  PageAttrModel,
} from 'src/app/core';
import { AgreementService } from 'src/app/pages/agreement/services';
import { DialogBoxService, LoaderService, SnackBarService } from 'src/app/shared';
import { ReportService } from '../../services/report.services';

@Component({
  selector: 'ems-employee-expense',
  templateUrl: './employee-expense.component.html',
  host: {
    class: 'full-width-card full-card',
  },
})
export class EmployeeExpenseComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [];
  employeeData: any;
  agreementFilter: FormGroup;

  agreementList: any[] = [];
  employeeList: any[] = [];
  workTypeList: any[] = [];
  dayList: any[] = [];
  hasResult = false;
  pageAttributes: PageAttrModel = { ...PAGE_ATTR_DATA };

  subscriptionArray: Subscription[] = [];
  filterCriteria = '';

  constructor(
    private resportService: ReportService,
    private loaderService: LoaderService,
    private fbuilder: FormBuilder,
    private agreementService: AgreementService,
    private masterService: MasterDataService,
    private dateAdapter: DateAdapter<Date>,
    private dialogeService: DialogBoxService,
    private snackBarService: SnackBarService
  ) {
    this.agreementFilter = this.fbuilder.group({
      agreement: new FormControl(''),
      employee: new FormControl(''),
      workType: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      day: new FormControl(''),
      search: new FormControl(''),
    });

    this.getAgreementList();
    this.getEmployeeList();
    this.getWorkTypeList();
    this.detectFilterForms();
    this.getWorkDayType();

    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.displayedColumns = [
      'work_date',
      'name',
      'location',
      'day',
      'work_type_details',
      'kooli',
      'kooli_paid',
      'paid_date',
      'agreement',
    ];
    this.searchNow();
  }

  detectFilterForms(): void {
    const detectSubs = this.agreementFilter
      .get('agreement')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.getAgreementList(value);
      });
    if (detectSubs) this.subscriptionArray.push(detectSubs);

    const empSubs = this.agreementFilter
      .get('employee')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.getEmployeeList(value);
      });
    if (empSubs) this.subscriptionArray.push(empSubs);

    const workSubs = this.agreementFilter
      .get('workType')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.getWorkTypeList(value);
      });
    if (workSubs) this.subscriptionArray.push(workSubs);
  }

  getWorkDayType(): void {
    this.masterService.getWorkDayType().subscribe((data) => {
      if (data && data.results) {
        this.dayList = data.results;
      }
    });
  }

  getAgreementList(search?: string): void {
    const agreementSubs = this.agreementService
      .getAgreements(
        search !== null && search !== undefined
          ? `?search=${search}`
          : undefined
      )
      .subscribe((data) => {
        if (data && data.results) {
          this.agreementList = data.results;
        }
      });

    this.subscriptionArray.push(agreementSubs);
  }

  public agreementOptionView(option: any): string {
    return option ? `${option.agreement_number} - ${option.name}` : '';
  }

  getEmployeeList(search?: string): void {
    const empSubs = this.masterService
      .getEmployeesList(
        search !== null && search !== undefined
          ? `?search=${search}`
          : undefined
      )
      .subscribe((data) => {
        if (data && data.results) {
          this.employeeList = data.results;
        }
      });
    this.subscriptionArray.push(empSubs);
  }

  public employeeOptionView(option: any): string {
    return option ? option.name : '';
  }

  getWorkTypeList(search?: string): void {
    const workSubs = this.masterService
      .getWorktypesList(
        search !== null && search !== undefined
          ? `?search=${search}`
          : undefined
      )
      .subscribe((data) => {
        if (data && data.results) {
          this.workTypeList = data.results;
        }
      });
    this.subscriptionArray.push(workSubs);
  }

  public worktypeOptionView(option: any): string {
    return option ? option.name : '';
  }

  searchNow(): void {
    const paramList = [];
    let paramUrl = '';
    if (
      this.agreementFilter.value.agreement &&
      this.agreementFilter.value.agreement.id
    ) {
      paramList.push(`agreement=${this.agreementFilter.value.agreement.id}`);
    }
    if (
      this.agreementFilter.value.employee &&
      this.agreementFilter.value.employee.id
    ) {
      paramList.push(`name=${this.agreementFilter.value.employee.id}`);
    }
    if (
      this.agreementFilter.value.workType &&
      this.agreementFilter.value.workType.id
    ) {
      paramList.push(`work_type=${this.agreementFilter.value.workType.id}`);
    }
    if (this.agreementFilter.value.startDate) {
      paramList.push(
        `from_date=${moment(this.agreementFilter.value.startDate).format(
          'YYYY-MM-DD'
        )}`
      );
    }
    if (this.agreementFilter.value.endDate) {
      paramList.push(
        `to_date=${moment(this.agreementFilter.value.endDate).format(
          'YYYY-MM-DD'
        )}`
      );
    }
    if (this.agreementFilter.value.day) {
      paramList.push(`day_type=${this.agreementFilter.value.day}`);
    }
    if (this.agreementFilter.value.search) {
      paramList.push(`search=${this.agreementFilter.value.search}`);
    }

    if (paramList.length > 0) {
      paramList.map((par) => {
        this.filterCriteria = this.filterCriteria + par + '&';
      });
    }

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
    this.resportService
      .getEmployeeReport(`?` + paramUrl.slice(0, -1))
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.employeeData = data.results;
          this.hasResult = data.results.length > 0 ? true : false;
          this.pageAttributes.totalRecord = data.count;
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

  resetSearch(): void {
    this.agreementFilter.reset();
    this.pageAttributes.pageSize = this.pageAttributes.pageSizeOpt[0];
    this.pageAttributes.currentPage = 0;
    this.searchNow();
  }

  downloadNow(): void {
    const ref = this.dialogeService.openDialog('Are sure want to Download ?');
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.resportService.downloadReports(
          'employee_wise',
          this.filterCriteria.slice(0, -1)
        );

        this.filterCriteria = '';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptionArray.length > 0) {
      this.subscriptionArray.map((subs) => subs.unsubscribe());
    }
  }
}
