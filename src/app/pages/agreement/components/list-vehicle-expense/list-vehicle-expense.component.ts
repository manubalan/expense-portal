import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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
import { AddVehicleExpensesComponent } from '../add-vehicle-expenses/add-vehicle-expenses.component';

@Component({
  selector: 'ems-list-vehicle-expense',
  templateUrl: './list-vehicle-expense.component.html',
})
export class ListVehicleExpenseComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [];
  dataSource: any;
  pageAttributes: PageAttrModel = { ...PAGE_ATTR_DATA };

  subscriptionArray: Subscription[] = [];

  hasResult = false;
  vehicleFilterForm: FormGroup;
  agreementList: any[] = [];
  materialList: any[] = [];
  locationList: any[] = [];
  driverList: any[] = [];

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
    this.vehicleFilterForm = this.fBuilder.group({
      agreement: new FormControl(null),
      material: new FormControl(null),
      location: new FormControl(null),
      driver: new FormControl(null),
      startDate: new FormControl(null),
      endDate: new FormControl(null),
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
      'vehicle_type',
      'vehicle_details',
      'driver_name',
      'materials_from_details',
      'materials',
      'qty_type',
      'quantity',
      'delivery_date',
      'amount',
      'amount_paid',
      'betha',
      'betha_paid',
      'vechicle_charge',
      'total_amount',
      'action',
    ];
  }

  editVehicleExpense(ID: number): void {
    this.dialog.open(AddVehicleExpensesComponent).componentInstance.editMode = {
      isActive: true,
      agreementID: ID,
    };
  }

  deleteVehicleExpense(ID: number): void {
    const ref = this.dialogeService.openDialog('Are sure want to delete ?');
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loaderService.show();
        const delSubs = this.agreementService
          .deleteVehicleExp(ID)
          .subscribe((response) => {
            this.agreementService.vehicleExpUpdated$.next(true);
            this.snackBarService.success(
              'Vehicle Expense removed Successfully ! ',
              'Done'
            );
            this.loaderService.hide();
          });

        this.subscriptionArray.push(delSubs);
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
    this.setMaterialList();
    this.setLocationList();
    this.setDriverList();
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

  setMaterialList(search?: string): void {
    this.loaderService.show();
    const vehicleSubs = this.masterService
      .getMaterialsList(
        search !== undefined && search !== null ? '?search=' + search : ''
      )
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.materialList = data.results;
        }
      });

    this.subscriptionArray.push(vehicleSubs);
  }

  setDriverList(search?: string): void {
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
          this.driverList = data.results;
        }
      });
    this.subscriptionArray.push(empSubs);
  }

  setLocationList(search?: string): void {
    this.loaderService.show();
    const vehicleSubs = this.masterService
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


  detectFilterForms(): void {
    const detectSubs = this.vehicleFilterForm
      .get('agreement')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.setAgreementList(value);
      });
    if (detectSubs) this.subscriptionArray.push(detectSubs);

    const workSubs = this.vehicleFilterForm
      .get('material')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.setMaterialList(value);
      });
    if (workSubs) this.subscriptionArray.push(workSubs);

    const matSubs = this.vehicleFilterForm
    .get('location')
    ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
    .subscribe((value: any) => {
      if (typeof value === 'string') this.setLocationList(value);
    });
  if (matSubs) this.subscriptionArray.push(matSubs);

    const empSubs = this.vehicleFilterForm
      .get('driver')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.setDriverList(value);
      });
    if (empSubs) this.subscriptionArray.push(empSubs);
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

    if (
      this.vehicleFilterForm.value.driver &&
      this.vehicleFilterForm.value.driver.id
    ) {
      paramList.push(`driver_name=${this.vehicleFilterForm.value.driver.id}`);
    }

    if (
      this.vehicleFilterForm.value.materialsFrom &&
      this.vehicleFilterForm.value.materialsFrom.id
    ) {
      paramList.push(`materials_from=${this.vehicleFilterForm.value.materialsFrom.id}`);
    }

    if (
      this.vehicleFilterForm.value.vehicleType &&
      this.vehicleFilterForm.value.vehicleType.id
    ) {
      paramList.push(
        `materials=${this.vehicleFilterForm.value.vehicleType.id}`
      );
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

    if (paramList.length > 0) {
      paramList.map((par) => {
        paramUrl = paramUrl + par + '&';
      });
    }

    this.loaderService.show();
    this.agreementService
      .getVehicleExpense(`?` + paramUrl.slice(0, -1))
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
    this.vehicleFilterForm.reset();
    this.pageAttributes.pageSize = this.pageAttributes.pageSizeOpt[0];
    this.pageAttributes.currentPage = 0;
    this.searchNow();
  }

  ngOnDestroy(): void {
    this.agreementService.vehicleExpUpdated$.complete();
    if (this.subscriptionArray.length > 0) {
      this.subscriptionArray.forEach((sub) => {
        sub.unsubscribe();
      });
    }
  }
}
