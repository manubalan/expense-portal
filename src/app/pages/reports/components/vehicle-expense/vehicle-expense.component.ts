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
  selector: 'ems-vehicle-expense',
  templateUrl: './vehicle-expense.component.html',
  host: {
    class: 'full-width-card',
  },
})
export class VehicleExpenseComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [];
  vehicleReports: any;
  vehicleFilterForm: FormGroup;

  agreementList: any[] = [];
  locationList: any[] = [];
  materialList: any[] = [];
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
    this.vehicleFilterForm = this.fbuilder.group({
      agreement: new FormControl(''),
      vehicleNo: new FormControl(''),
      location: new FormControl(''),
      material: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      search: new FormControl(''),
    });

    this.getAgreementList();
    this.getLocationList();
    this.getMaterialList();
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
      'amount',
      'amount_paid',
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
        if (typeof value === 'string') this.getAgreementList(value);
      });
    if (detectSubs) this.subscriptionArray.push(detectSubs);

    const empSubs = this.vehicleFilterForm
      .get('location')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.getLocationList(value);
      });
    if (empSubs) this.subscriptionArray.push(empSubs);

    const workSubs = this.vehicleFilterForm
      .get('material')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.getMaterialList(value);
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

  getLocationList(search?: string): void {
    const empSubs = this.masterService
      .getLocationsList(
        0,
        search !== null && search !== undefined ? `search=${search}` : undefined
      )
      .subscribe((data) => {
        if (data && data.results) {
          this.locationList = data.results;
        }
      });
    this.subscriptionArray.push(empSubs);
  }

  public locationOptionView(option: any): string {
    return option ? option.name : '';
  }

  getMaterialList(search?: string): void {
    const empSubs = this.masterService
      .getMaterialsList(
        search !== null && search !== undefined
          ? `?search=${search}`
          : undefined
      )
      .subscribe((data) => {
        if (data && data.results) {
          this.materialList = data.results;
        }
      });
    this.subscriptionArray.push(empSubs);
  }

  public materialOptionView(option: any): string {
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
      this.vehicleFilterForm.value.agreement &&
      this.vehicleFilterForm.value.agreement.id
    ) {
      paramList.push(`agreement=${this.vehicleFilterForm.value.agreement.id}`);
    }
    if (this.vehicleFilterForm.value.vehicleNo) {
      paramList.push(`vehicle_no=${this.vehicleFilterForm.value.vehicleNo}`);
    }
    if (
      this.vehicleFilterForm.value.location &&
      this.vehicleFilterForm.value.location.id
    ) {
      paramList.push(
        `materials_from=${this.vehicleFilterForm.value.location.id}`
      );
    }
    if (
      this.vehicleFilterForm.value.material &&
      this.vehicleFilterForm.value.material.id
    ) {
      paramList.push(`materials=${this.vehicleFilterForm.value.material.id}`);
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
