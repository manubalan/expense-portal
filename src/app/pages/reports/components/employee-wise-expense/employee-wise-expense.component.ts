import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  MasterDataService,
  PageAttrEventModel,
  PageAttrModel,
  PAGE_ATTR_DATA,
} from 'src/app/core';
import { AgreementService } from 'src/app/pages/agreement/services';
import { DialogBoxService, LoaderService, SnackBarService } from 'src/app/shared';
import { ReportService } from '../../services/report.services';

@Component({
  selector: 'ems-employee-wise-expense',
  templateUrl: './employee-wise-expense.component.html',
  host: {
    class: 'full-width-card full-card',
  },
})
export class EmployeeWiseExpenseComponent implements OnInit, OnDestroy {
  displayedColumnsWise: string[] = [];
  employeeWiseData: any;
  agreementWiseFilter: FormGroup;

  agreementList: any[] = [];
  employeList: any[] = [];
  workTypeList: any[] = [];
  hasResults = false;
  pageAttributes: PageAttrModel = { ...PAGE_ATTR_DATA };

  subscriptionArray: Subscription[] = [];
  filterCriteria = '';

  constructor(
    private resportService: ReportService,
    private loaderService: LoaderService,
    private fbuilder: FormBuilder,
    private agreementService: AgreementService,
    private masterService: MasterDataService,
    private dialogeService: DialogBoxService,
    private snackBarService: SnackBarService
  ) {
    this.agreementWiseFilter = this.fbuilder.group({
      agreement: new FormControl(''),
      employeeId: new FormControl(''),
      workType: new FormControl(''),
      search: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.displayedColumnsWise = [
      'name__name',
      'kooli',
      'kooli_paid',
      'balance',
    ];
    this.searchNow();
    this.getAgreementList();
    this.getEmployeeList();
    this.getWorkTypeList();
    this.detectFilterForms();
  }

  detectFilterForms(): void {
    const detectSubs = this.agreementWiseFilter
      .get('agreement')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (typeof value === 'string') this.getAgreementList(value);
      });
    if (detectSubs) this.subscriptionArray.push(detectSubs);

    const empSubs = this.agreementWiseFilter
      .get('employeeId')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (typeof value === 'string') this.getEmployeeList(value);
      });
    if (empSubs) this.subscriptionArray.push(empSubs);

    const workSubs = this.agreementWiseFilter
      .get('workType')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (typeof value === 'string') this.getWorkTypeList(value);
      });
    if (workSubs) this.subscriptionArray.push(workSubs);
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
          this.employeList = data.results;
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
      this.agreementWiseFilter.value.agreement &&
      this.agreementWiseFilter.value.agreement.id
    ) {
      paramList.push(
        `agreement_id=${this.agreementWiseFilter.value.agreement.id}`
      );
    }
    if (
      this.agreementWiseFilter.value.employeeId &&
      this.agreementWiseFilter.value.employeeId.id
    ) {
      paramList.push(
        `employee_id=${this.agreementWiseFilter.value.employeeId.id}`
      );
    }
    if (
      this.agreementWiseFilter.value.workType &&
      this.agreementWiseFilter.value.workType.id
    ) {
      paramList.push(
        `work_type_id=${this.agreementWiseFilter.value.workType.id}`
      );
    }
    if (this.agreementWiseFilter.value.search) {
      paramList.push(`search=${this.agreementWiseFilter.value.search}`);
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
      .getEmployeeWiseReport(`?` + paramUrl.slice(0, -1))
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.employeeWiseData = data.results;
          this.hasResults = data.results.length > 0 ? true : false;
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
    this.agreementWiseFilter.reset();
    this.pageAttributes.pageSize = this.pageAttributes.pageSizeOpt[0];
    this.pageAttributes.currentPage = 0;
    this.searchNow();
  }

  downloadNow(): void {
    const ref = this.dialogeService.openDialog('Are sure want to Download ?');
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.resportService.downloadReports(
          'employee',
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
