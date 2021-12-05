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
import { LoaderService } from 'src/app/shared';
import { ReportService } from '../../services/report.services';

@Component({
  selector: 'ems-driver-expense',
  templateUrl: './driver-expense.component.html',
  host: {
    class: 'full-width-card',
  },
})
export class DriverExpenseComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [];
  driverReports: any;
  driverFilterForm: FormGroup;
  agreementList: any[] = [];
  driverList: any[] = [];
  hasResult = false;
  pageAttributes: PageAttrModel = { ...PAGE_ATTR_DATA };

  subscriptionArray: Subscription[] = [];

  constructor(
    private resportService: ReportService,
    private loaderService: LoaderService,
    private fbuilder: FormBuilder,
    private agreementService: AgreementService,
    private masterService: MasterDataService
  ) {
    this.driverFilterForm = this.fbuilder.group({
      agreement: new FormControl(''),
      driverName: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      search: new FormControl(''),
    });

    this.getAgreementList();
    this.getDriverList();
    this.detectFilterForms();
  }

  ngOnInit(): void {
    this.displayedColumns = [
      'driver_name__name',
      'betha',
      'betha_paid',
      'balance',
    ];
    this.searchNow();
  }

  detectFilterForms(): void {
    const detectSubs = this.driverFilterForm
      .get('agreement')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.getAgreementList(value);
      });
    if (detectSubs) this.subscriptionArray.push(detectSubs);

    const empSubs = this.driverFilterForm
      .get('driverName')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.getDriverList(value);
      });
    if (empSubs) this.subscriptionArray.push(empSubs);
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

  getDriverList(search?: string): void {
    const empSubs = this.masterService
      .getEmployeesList(
        search !== null && search !== undefined
          ? `?search=${search}`
          : undefined
      )
      .subscribe((data) => {
        if (data && data.results) {
          this.driverList = data.results;
        }
      });
    this.subscriptionArray.push(empSubs);
  }

  public employeeOptionView(option: any): string {
    return option ? option.name : '';
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
      this.driverFilterForm.value.agreement &&
      this.driverFilterForm.value.agreement.id
    ) {
      paramList.push(`agreement=${this.driverFilterForm.value.agreement.id}`);
    }
    if (
      this.driverFilterForm.value.driverName &&
      this.driverFilterForm.value.driverName.id
    ) {
      paramList.push(`driver_id=${this.driverFilterForm.value.driverName.id}`);
    }
    if (this.driverFilterForm.value.search) {
      paramList.push(`search=${this.driverFilterForm.value.search}`);
    }

    if (paramList.length > 0) {
      paramList.map((par) => {
        paramUrl = paramUrl + par + '&';
      });
    }

    this.loaderService.show();
    this.resportService
      .getDriverReport(`?` + paramUrl.slice(0, -1))
      .subscribe((data) => {
        this.loaderService.hide();
        if (data) {
          this.driverReports = data.results;
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
    this.driverFilterForm.reset();
    this.pageAttributes.pageSize = this.pageAttributes.pageSizeOpt[0];
    this.pageAttributes.currentPage = 0;
    this.searchNow();
  }

  downloadNow(): void {
    return;
  }

  ngOnDestroy(): void {
    if (this.subscriptionArray.length > 0) {
      this.subscriptionArray.map((subs) => subs.unsubscribe());
    }
  }
}
