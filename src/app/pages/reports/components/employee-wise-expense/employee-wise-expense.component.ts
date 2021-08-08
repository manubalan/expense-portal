import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MasterDataService } from 'src/app/core';
import { AgreementService } from 'src/app/pages/agreement/services';
import { LoaderService } from 'src/app/shared';
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

  subscriptionArray: Subscription[] = [];

  constructor(
    private resportService: ReportService,
    private loaderService: LoaderService,
    private fbuilder: FormBuilder,
    private agreementService: AgreementService,
    private masterService: MasterDataService
  ) {
    this.agreementWiseFilter = this.fbuilder.group({
      agreement: new FormControl(''),
      employeeId: new FormControl(''),
      workType: new FormControl(''),
      search: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.displayedColumnsWise = ['name__name', 'kooli', 'kooli_paid'];
    this.getReportData();
    this.getAgreementList();
    this.getEmployeeList();
    this.getWorkTypeList();
    this.detectFilterForms();
  }

  getReportData(): void {
    this.loaderService.show();
    const reportSubs = this.resportService
      .getEmployeeWiseReport()
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.employeeWiseData = data.results;
          this.hasResults = data.results.length > 0 ? true : false;
        }
      });

    this.subscriptionArray.push(reportSubs);
  }

  detectFilterForms(): void {
    const detectSubs = this.agreementWiseFilter
      .get('agreement')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (value && value !== null && typeof value === 'string') {
          this.getAgreementList(value);
        }
      });
    if (detectSubs) this.subscriptionArray.push(detectSubs);

    const empSubs = this.agreementWiseFilter
      .get('employeeId')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (value && value !== null && typeof value === 'string') {
          this.getEmployeeList(value);
        }
      });
    if (empSubs) this.subscriptionArray.push(empSubs);

    const workSubs = this.agreementWiseFilter
      .get('workType')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (value && value !== null && typeof value === 'string') {
          this.getWorkTypeList(value);
        }
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

  searchNow(): void {
    const paramList = [];
    let paramUrl = '';
    if (this.agreementWiseFilter.value.agreement) {
      paramList.push(
        `agreement_id=${this.agreementWiseFilter.value.agreement}`
      );
    }
    if (this.agreementWiseFilter.value.employeeId) {
      paramList.push(
        `employee_id=${this.agreementWiseFilter.value.employeeId}`
      );
    }
    if (this.agreementWiseFilter.value.workType) {
      paramList.push(`work_type_id=${this.agreementWiseFilter.value.workType}`);
    }
    if (this.agreementWiseFilter.value.search) {
      paramList.push(`search=${this.agreementWiseFilter.value.search}`);
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
        }
      });
  }

  resetSearch(): void {
    this.agreementWiseFilter.reset();
    this.getReportData();
  }

  ngOnDestroy(): void {
    if (this.subscriptionArray.length > 0) {
      this.subscriptionArray.map((subs) => subs.unsubscribe());
    }
  }
}
