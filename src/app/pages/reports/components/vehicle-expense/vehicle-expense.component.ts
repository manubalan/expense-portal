import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MasterDataService } from 'src/app/core';
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
      'materials_details',
      'materials_from_details',
      'qty_type',
      'quantity',
      'vehicle_type_details',
      'vehicle_details',
      'amount',
      'betha',
      'vechicle_charge',
      'total_amount',
    ];
    this.getREportData();
  }

  getREportData(): void {
    this.loaderService.show();
    const resultSub = this.resportService
      .getVehicleReport()
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.vehicleReports = data.results;
          this.hasResult = data.results.length > 0 ? true : false;
        }
      });

    this.subscriptionArray.push(resultSub);
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
      .get('location')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (value && value !== null && typeof value === 'string') {
          this.getLocationList(value);
        }
      });
    if (empSubs) this.subscriptionArray.push(empSubs);

    const workSubs = this.vehicleFilterForm
      .get('material')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (value && value !== null && typeof value === 'string') {
          this.getMaterialList(value);
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

  getLocationList(search?: string): void {
    const empSubs = this.masterService
      .getLocationsList(
        0,
        search !== null && search !== undefined
          ? `?search=${search}`
          : undefined
      )
      .subscribe((data) => {
        if (data && data.results) {
          this.locationList = data.results;
        }
      });
    this.subscriptionArray.push(empSubs);
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

  searchNow(): void {
    const paramList = [];
    let paramUrl = '';
    if (this.vehicleFilterForm.value.agreement) {
      paramList.push(`agreement=${this.vehicleFilterForm.value.agreement}`);
    }
    if (this.vehicleFilterForm.value.vehicleNo) {
      paramList.push(`vehicle_no=${this.vehicleFilterForm.value.vehicleNo}`);
    }
    if (this.vehicleFilterForm.value.location) {
      paramList.push(`materials_from=${this.vehicleFilterForm.value.location}`);
    }
    if (this.vehicleFilterForm.value.material) {
      paramList.push(`materials=${this.vehicleFilterForm.value.material}`);
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
        }
      });
  }

  resetSearch(): void {
    this.vehicleFilterForm.reset();
    this.getREportData();
  }

  ngOnDestroy(): void {
    if (this.subscriptionArray.length > 0) {
      this.subscriptionArray.map((subs) => subs.unsubscribe());
    }
  }
}
