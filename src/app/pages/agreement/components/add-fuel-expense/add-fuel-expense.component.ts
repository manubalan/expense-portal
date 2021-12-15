import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MasterDataService } from 'src/app/core';
import { LoaderService, SnackBarService } from 'src/app/shared';
import { AddAgreementComponent } from '..';
import { AgreementService } from '../../services';

@Component({
  selector: 'ems-add-fuel-expense',
  templateUrl: './add-fuel-expense.component.html'
})
export class AddFuelExpenseComponent implements OnInit {
  addFuelExpenseForm: FormGroup;
  editMode = {
    isActive: false,
    fuelExpenseID: 0,
  };

  driverList: any[] = [];
  vehicleNumberList: any[] = [];
  locationList: any[] = [];
  fuelList: any[] = [];

  subscriptionsArray: Subscription[] = [];

  constructor(
    private fbuilder: FormBuilder,
    private masterDataService: MasterDataService,
    private agreementService: AgreementService,
    private loaderService: LoaderService,
    private snackBarService: SnackBarService,
    private dialogRef: MatDialogRef<AddAgreementComponent>,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.addFuelExpenseForm = this.fbuilder.group({
      driver_name: new FormControl(null),
      vehicle_number: new FormControl(null),
      location: new FormControl(null),
      date: new FormControl(null),
      fuel: new FormControl(null),
      unit_price: new FormControl(null),
      quantity: new FormControl(null),
      total_amount: new FormControl(null),
      narration: new FormControl(null),
    });
    this.dateAdapter.setLocale('en-GB');
  }

  public locationListOptionView(option: any): any {
    return option ? `${option.name}` : '';
  }

  ngOnInit(): void {
    this.setMasterdata();
    this.detectFormValueChange();
    this.patchFormData();
  }

  setMasterdata(): void {
    this.setDriverList();
    this.setVehicleList();
    this.setLocationList();
    this.setFuelTypeList();
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

    this.subscriptionsArray.push(employSubs);
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
          this.vehicleNumberList = data.results;
        }
      });

    this.subscriptionsArray.push(employSubs);
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

    this.subscriptionsArray.push(vehicleSubs);
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

    this.subscriptionsArray.push(employSubs);
  }

  // DETECT VALue Change
  detectFormValueChange(): void {
    // Field 1
    const detectSubs = this.addFuelExpenseForm
      .get('driver_name')
      ?.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.setDriverList(value);
      });
    if (detectSubs) this.subscriptionsArray.push(detectSubs);

    // Field 2
    const vehiclenumber = this.addFuelExpenseForm
      .get('vehicle_number')
      ?.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.setVehicleList(value);
      });
    if (vehiclenumber) this.subscriptionsArray.push(vehiclenumber);

    // Field 3
    const location = this.addFuelExpenseForm
      .get('location')
      ?.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.setLocationList(value);
      });
    if (location) this.subscriptionsArray.push(location);

    // Field 4
    const fuel = this.addFuelExpenseForm
      .get('fuel')
      ?.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.setFuelTypeList(value);
      });
    if (fuel) this.subscriptionsArray.push(fuel);
  }

  postFormData(): void {
    const requestBody = {
      driver_name:
        typeof this.addFuelExpenseForm.value.driver_name === 'object' &&
        this.addFuelExpenseForm.value.driver_name.id
          ? this.addFuelExpenseForm.value.driver_name.id
          : null,
      vehicle_number:
        typeof this.addFuelExpenseForm.value.vehicle_number === 'object' &&
        this.addFuelExpenseForm.value.vehicle_number.id
          ? this.addFuelExpenseForm.value.vehicle_number.id
          : null,
      location:
        typeof this.addFuelExpenseForm.value.location === 'object' &&
        this.addFuelExpenseForm.value.location.id
          ? this.addFuelExpenseForm.value.location.id
          : null,
      date: this.addFuelExpenseForm.value.date
        ? moment(this.addFuelExpenseForm.value.date).format('YYYY-MM-DD')
        : null,
      fuel:
        typeof this.addFuelExpenseForm.value.fuel === 'object' &&
        this.addFuelExpenseForm.value.fuel.id
          ? this.addFuelExpenseForm.value.fuel.id
          : null,
      unit_price: this.addFuelExpenseForm.value.unit_price
        ? this.addFuelExpenseForm.value.unit_price
        : 0,
      quantity: this.addFuelExpenseForm.value.quantity
        ? this.addFuelExpenseForm.value.quantity
        : 0,
      total_amount: this.addFuelExpenseForm.value.total_amount
        ? this.addFuelExpenseForm.value.total_amount
        : 0,
      narration: this.addFuelExpenseForm.value.narration
        ? this.addFuelExpenseForm.value.narration
        : '',
    };

    const add = this.agreementService
      .postFuelExpense(
        requestBody,
        this.editMode.isActive ? true : false,
        this.editMode.fuelExpenseID ? this.editMode.fuelExpenseID : 0
      )
      .subscribe((response) => {
        if (response) {
          this.agreementService.fuelExpUpdated$.next(true);
          this.snackBarService.success(
            this.editMode.isActive
              ? 'Fuel Expense updated Successfully ! '
              : 'Fuel Expense added Successfully !',
            'Done'
          );

          if (this.editMode.isActive) this.dialogRef.close();
          this.addFuelExpenseForm.reset();
        }
        this.loaderService.hide();
      });

    if (add) this.subscriptionsArray.push(add);
  }

  // UPDATE MODE
  patchFormData(): void {
    if (this.editMode.isActive) {
      const agreementIDSub = this.agreementService
        .getFuelExpenseID(this.editMode.fuelExpenseID)
        .subscribe((data) => {
          if (data) {
            this.addFuelExpenseForm.patchValue({
              driver_name: {
                id: data?.driver_name,
                name: data?.driver_name_details?.name,
              },
              vehicle_number: {
                id: data?.vehicle_number,
                name: data?.vehicle_number_details?.name,
              },
              location: {
                id: data?.location,
                name: data?.location_details?.name,
              },
              date: data?.date,
              fuel: {
                id: data?.fuel,
                name: data?.fuel_details?.name,
              },
              unit_price: data?.unit_price,
              quantity: data?.quantity,
              total_amount: data?.total_amount,
              narration: data?.narration,
            });
          }
        });

      this.subscriptionsArray.push(agreementIDSub);
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptionsArray.length > 0) {
      this.subscriptionsArray.forEach((subs) => [subs.unsubscribe()]);
    }
  }
}
