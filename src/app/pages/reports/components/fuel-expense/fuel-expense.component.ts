import { Component, OnInit } from '@angular/core';
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
import { AgreementService } from 'src/app/pages/agreement/services';
import {
  LoaderService,
  DialogBoxService,
  SnackBarService,
} from 'src/app/shared';
import { ReportService } from '../../services/report.services';

@Component({
  selector: 'ems-fuel-expense',
  templateUrl: './fuel-expense.component.html',
})
export class FuelExpenseComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource: any;
  pageAttributes: PageAttrModel = { ...PAGE_ATTR_DATA };

  subscriptionArray: Subscription[] = [];
  fuelFilterForm: FormGroup;
  hasResult = false;

  driverList: any[] = [];
  locationList: any[] = [];
  vehicleList: any[] = [];
  fuelList: any[] = [];

  filterCriteria = '';

  constructor(
    public dialog: MatDialog,
    private resportService: ReportService,
    private loaderService: LoaderService,
    private fBuilder: FormBuilder,
    private masterDataService: MasterDataService,
    private dateAdapter: DateAdapter<Date>,
    private dialogeService: DialogBoxService,
  ) {
    this.fuelFilterForm = this.fBuilder.group({
      driver_name: new FormControl(null),
      location: new FormControl(null),
      vehicle_number: new FormControl(null),
      fuel: new FormControl(null),
      from_date: new FormControl(null),
      to_date: new FormControl(null),
    });

    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.displayedColumns = [
      'driver_name_details',
      'vehicle_number_details',
      'location_details',
      'date',
      'fuel_details',
      'unit_price',
      'quantity',
      'total_amount',
    ];
    this.setMasterData();
    this.searchNow();
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

  // FILTER Area
  public employeeOptionView(option: any): string {
    return option ? option.name : '';
  }

  setMasterData(): void {
    this.setDriverList();
    this.setVehicleList();
    this.setLocationList();
    this.setFuelTypeList();
    this.detectFilterForms();
  }

  setDriverList(search?: string): void {
    this.loaderService.show();
    const employSubs = this.masterDataService
      .getEmployeesList(
        search !== undefined && search !== null ? '?search=' + search : ''
      )
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.driverList = data.results;
        }
      });

    this.subscriptionArray.push(employSubs);
  }

  setVehicleList(search?: string): void {
    this.loaderService.show();
    const employSubs = this.masterDataService
      .getVehicleNumberList(
        search !== undefined && search !== null ? '?search=' + search : ''
      )
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.vehicleList = data.results;
        }
      });

    this.subscriptionArray.push(employSubs);
  }

  setLocationList(search?: string): void {
    this.loaderService.show();
    const vehicleSubs = this.masterDataService
      .getLocationsList(
        0,
        search !== undefined && search !== null ? 'search=' + search : ''
      )
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.locationList = data.results;
        }
      });

    this.subscriptionArray.push(vehicleSubs);
  }

  setFuelTypeList(search?: string): void {
    this.loaderService.show();
    const employSubs = this.masterDataService
      .getFuelTypeList(
        search !== undefined && search !== null ? '?search=' + search : ''
      )
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.fuelList = data.results;
        }
      });

    this.subscriptionArray.push(employSubs);
  }

  detectFilterForms(): void {
    const detectSubs = this.fuelFilterForm
      .get('driver_name')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.setDriverList(value);
      });
    if (detectSubs) this.subscriptionArray.push(detectSubs);

    const empSubs = this.fuelFilterForm
      .get('location')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.setLocationList(value);
      });
    if (empSubs) this.subscriptionArray.push(empSubs);

    const workSubs = this.fuelFilterForm
      .get('vehicle_number')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.setVehicleList(value);
      });
    if (workSubs) this.subscriptionArray.push(workSubs);

    const fuelSubs = this.fuelFilterForm
      .get('fuel')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.setFuelTypeList(value);
      });
    if (fuelSubs) this.subscriptionArray.push(fuelSubs);
  }

  searchNow(): void {
    const paramList = [];
    let paramUrl = '';
    if (
      this.fuelFilterForm.value.driver_name &&
      this.fuelFilterForm.value.driver_name.id
    ) {
      paramList.push(`driver_name=${this.fuelFilterForm.value.driver_name.id}`);
    }

    if (
      this.fuelFilterForm.value.location &&
      this.fuelFilterForm.value.location.id
    ) {
      paramList.push(`location=${this.fuelFilterForm.value.location.id}`);
    }

    if (
      this.fuelFilterForm.value.vehicle_number &&
      this.fuelFilterForm.value.vehicle_number.id
    ) {
      paramList.push(
        `vehicle_number=${this.fuelFilterForm.value.vehicle_number.id}`
      );
    }

    if (this.fuelFilterForm.value.fuel && this.fuelFilterForm.value.fuel.id) {
      paramList.push(`fuel=${this.fuelFilterForm.value.fuel.id}`);
    }

    if (this.fuelFilterForm.value.from_date) {
      paramList.push(
        `from_date=${moment(this.fuelFilterForm.value.from_date).format(
          'YYYY-MM-DD'
        )}`
      );
    }

    if (this.fuelFilterForm.value.to_date) {
      paramList.push(
        `to_date=${moment(this.fuelFilterForm.value.to_date).format(
          'YYYY-MM-DD'
        )}`
      );
    }

    if (paramList.length > 0) {
      paramList.map((par) => {
        this.filterCriteria = this.filterCriteria + par + '&';
      });
    }

    // PAGINATION
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
      .getFuelExpenseReport(`?` + paramUrl.slice(0, -1))
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
    this.fuelFilterForm.reset();
    this.pageAttributes.pageSize = this.pageAttributes.pageSizeOpt[0];
    this.pageAttributes.currentPage = 0;
    this.searchNow();
  }

  downloadNow(): void {
    const ref = this.dialogeService.openDialog('Are sure want to Download ?');
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.resportService.downloadReports(
          'fuel',
          this.filterCriteria.slice(0, -1)
        );

        this.filterCriteria = '';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptionArray.length > 0) {
      this.subscriptionArray.map((sub) => sub.unsubscribe());
    }
  }
}
