import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
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
  selector: 'ems-vehicle-driver-expense',
  templateUrl: './vehicle-driver-expense.component.html',
  host: {
    class: 'full-width-card',
  },
})
export class VehicleDriverExpenseComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [];
  vehicleReports: any;
  vehicleFilterForm: FormGroup;

  agreementList: any[] = [];
  employeeList: any[] = [];
  hasResult = false;
  pageAttributes: PageAttrModel = PAGE_ATTR_DATA;

  subscriptionArray: Subscription[] = [];

  constructor(
    private resportService: ReportService,
    private loaderService: LoaderService,
    private fbuilder: FormBuilder,
    private agreementService: AgreementService,
    private masterService: MasterDataService
  ) {
    this.vehicleFilterForm = this.fbuilder.group({
      agreement: new FormControl(''),
      employee: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      search: new FormControl(''),
    });

    this.getAgreementList();
    this.getEmployeeList();
    this.detectFilterForms();
  }

  ngOnInit(): void {
    this.displayedColumns = [
      'delivery_date',
      'agreement',
      'location',
      'materials_details',
      'materials_from_details',
      'qty_type',
      'quantity',
      'vehicle_type_details',
      'vehicle_details',
      'driver_name',
      'betha',
      'betha_paid',
      'vechicle_charge',
      'total_amount',
    ];
    this.searchNow();
  }

  detectFilterForms(): void {
    const detectSubs = this.vehicleFilterForm
      .get('agreement')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (value && value !== null && typeof value === 'string') {
          this.getAgreementList(value);
        }
      });
    if (detectSubs) this.subscriptionArray.push(detectSubs);

    const empSubs = this.vehicleFilterForm
      .get('employee')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (value && value !== null && typeof value === 'string') {
          this.getEmployeeList(value);
        }
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

  searchNow(): void {
    const paramList = [];
    let paramUrl = '';
    if (this.pageAttributes.pageSize > 0) {
      paramList.push(`limit=${this.pageAttributes.pageSize}`);
    }
    if (this.pageAttributes.currentPage >= 0) {
      paramList.push(`offset=${this.pageAttributes.currentPage}`);
    }
    if (
      this.vehicleFilterForm.value.agreement &&
      this.vehicleFilterForm.value.agreement.id
    ) {
      paramList.push(`agreement=${this.vehicleFilterForm.value.agreement.id}`);
    }
    if (
      this.vehicleFilterForm.value.employee &&
      this.vehicleFilterForm.value.employee.id
    ) {
      paramList.push(`driver_name=${this.vehicleFilterForm.value.employee.id}`);
    }

    if (this.vehicleFilterForm.value.startDate) {
      paramList.push(
        `from_date=${moment(this.vehicleFilterForm.value.startDate).format(
          'YYYY-MM-DD'
        )}`
      );
    }
    if (this.vehicleFilterForm.value.endDate) {
      paramList.push(
        `to_date=${moment(this.vehicleFilterForm.value.endDate).format(
          'YYYY-MM-DD'
        )}`
      );
    }
    if (this.vehicleFilterForm.value.search) {
      paramList.push(`search=${this.vehicleFilterForm.value.search}`);
    }

    if (paramList.length > 0) {
      paramList.map((par) => {
        paramUrl = paramUrl + par + '&';
      });
    }

    this.loaderService.show();
    this.resportService
      .getVehicleReport(`?` + paramUrl.slice(0, -1))
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.vehicleReports = data.results;
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
    this.vehicleFilterForm.reset();
    this.searchNow();
  }

  ngOnDestroy(): void {
    if (this.subscriptionArray.length > 0) {
      this.subscriptionArray.map((subs) => subs.unsubscribe());
    }
  }
}
