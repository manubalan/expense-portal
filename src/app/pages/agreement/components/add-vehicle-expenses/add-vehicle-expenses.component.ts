import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  AgreementListResultModel,
  ConstantDataModel,
  MasterDataService,
  ResultDataModel,
} from 'src/app/core';
import { LoaderService, SnackBarService } from 'src/app/shared/components';
import { AgreementService } from '../../services';

@Component({
  selector: 'ems-add-vehicle-expenses',
  templateUrl: './add-vehicle-expenses.component.html',
})
export class AddVehicleExpensesComponent implements OnInit, OnDestroy {
  addVehicleExpenseForm: FormGroup;
  agreementList: AgreementListResultModel[] = [];
  vehicleTypeList: ResultDataModel[] = [];
  materialItemList: ResultDataModel[] = [];
  qtyTypeList: ConstantDataModel[] = [];
  vehicleNumberList: any[] = [];
  employeeList: any;
  locationList: any;

  editMode = {
    isActive: false,
    agreementID: 0,
  };

  private subscriptionsArray: Subscription[] = [];

  constructor(
    private fbuilder: FormBuilder,
    private masterDataService: MasterDataService,
    private agreementService: AgreementService,
    private loaderService: LoaderService,
    private snackBarService: SnackBarService,
    private dialogRef: MatDialogRef<AddVehicleExpensesComponent>,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.addVehicleExpenseForm = this.fbuilder.group({
      no: new FormControl('', Validators.required),
      vehicleType: new FormControl(''),
      vehicleDetails: new FormControl(''),
      driverName: new FormControl(''),
      materialFrom: new FormControl(''),
      materialItem: new FormControl(''),
      qtyType: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      deliveryDate: new FormControl(''),
      amount: new FormControl(0),
      amountPaid: new FormControl(0),
      paidDate: new FormControl(''),
      betha: new FormControl(0),
      bethaPaid: new FormControl(0),
      betaPaidDate: new FormControl(''),
      vehicleCahrge: new FormControl(0),
      narration: new FormControl(''),
      totalAmount: new FormControl(0),
    });
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.patchFormData();
    this.setAgreementList();
    this.setVehicleTypeList();
    this.setVehicleList();
    this.setMaterialList();
    this.setEmployeeList();
    this.setLocationList();
    this.setQuantityType();
    this.detectFields();
  }

  patchFormData(): void {
    if (this.editMode.isActive) {
      const agreementIDSub = this.agreementService
        .getVehicleExpenseID(this.editMode.agreementID)
        .subscribe((data) => {
          if (data) {
            this.addVehicleExpenseForm.patchValue({
              no: {
                id: data.agreement,
                agreement_number: data.agreement_details?.agreement_number
                  ? data.agreement_details?.agreement_number
                  : '',
                name: data.agreement_details?.name
                  ? data.agreement_details?.name
                  : '',
              },
              vehicleType: {
                id: data.vehicle_type,
                name: data.vehicle_type_details?.name
                  ? data.vehicle_type_details?.name
                  : '',
              },
              vehicleDetails: data.vehicle_details,
              driverName: {
                id: data.driver_name,
                name: data.driver_name_details?.name
                  ? data.driver_name_details?.name
                  : '',
              },
              materialFrom: {
                id: data.materials_from,
                name: data.materials_from_details?.name
                  ? data.materials_from_details?.name
                  : '',
              },
              materialItem: {
                id: data.materials,
                name: data.materials_details?.name
                  ? data.materials_details?.name
                  : '',
              },
              qtyType: data.si_unit,
              quantity: data.quantity,
              deliveryDate: data.delivery_date,
              amount: data.amount,
              amountPaid: data.amount_paid,
              paidDate: data.amount_date,
              betha: data.betha,
              bethaPaid: data.betha_paid,
              betaPaidDate: data.betha_paid_date,
              vehicleCahrge: data.vechicle_charge,
              narration: data.narration,
              totalAmount: data.total_amount,
            });
          }
        });

      this.subscriptionsArray.push(agreementIDSub);
    }
  }

  setAgreementList(search?: string): void {
    this.loaderService.show();
    this.agreementList = [];
    const agreementSubs = this.agreementService
      .getAgreements(
        search !== undefined && search !== null ? '?search=' + search : ''
      )
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.agreementList = data.results;
        }
      });

    this.subscriptionsArray.push(agreementSubs);
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
          this.vehicleNumberList = data.results.map((el) => el.name);
        }
      });

    this.subscriptionsArray.push(employSubs);
  }

  public agreementOptionView(option: any): string {
    return option ? `${option.agreement_number} - ${option.name}` : '';
  }

  public locationListOptionView(option: any): any {
    return option ? `${option.name}` : '';
  }

  setQuantityType(): void {
    this.masterDataService.getQuantityType().subscribe((data) => {
      if (data && data.results) {
        this.qtyTypeList = data.results;
      }
    });
  }

  setVehicleTypeList(search?: string): void {
    this.loaderService.show();
    const vehicleSubs = this.masterDataService
      .getVehicletypesList(
        search !== undefined && search !== null ? '?search=' + search : ''
      )
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.vehicleTypeList = data.results;
        }
      });

    this.subscriptionsArray.push(vehicleSubs);
  }

  setMaterialList(search?: string): void {
    this.loaderService.show();
    const materialSubs = this.masterDataService
      .getMaterialsList(
        search !== undefined && search !== null ? '?search=' + search : ''
      )
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.materialItemList = data.results;
        }
      });

    this.subscriptionsArray.push(materialSubs);
  }

  setEmployeeList(search?: string): void {
    this.loaderService.show();
    const employSubs = this.masterDataService
      .getEmployeesList(
        search !== undefined && search !== null ? '?search=' + search : ''
      )
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.employeeList = data.results;
        }
      });

    this.subscriptionsArray.push(employSubs);
  }

  setLocationList(search?: string): void {
    this.loaderService.show();
    const employSubs = this.masterDataService
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

    this.subscriptionsArray.push(employSubs);
  }

  public autoListView(option: any): string {
    return option ? `${option.name}` : '';
  }

  detectFields(): void {
    this.detectAgreement();
    this.detectVehicleType();
    this.detectDriverName();
    this.detectLocation();
    this.detectMaterial();
    this.detectVehicleDetails();
  }

  detectAgreement(): void {
    this.addVehicleExpenseForm
      .get('no')
      ?.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: any) => {
        if (
          value !== undefined &&
          value !== null &&
          typeof value === 'string'
        ) {
          this.setAgreementList(value);
          this.addVehicleExpenseForm.get('no')?.setErrors(Validators.required);
        }

        if (typeof value === 'object')
          this.addVehicleExpenseForm.get('no')?.clearValidators();
      });
  }

  detectVehicleType(): void {
    this.addVehicleExpenseForm
      .get('vehicleType')
      ?.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: any) => {
        if (
          value !== undefined &&
          value !== null &&
          typeof value === 'string'
        ) {
          this.setVehicleTypeList(value);
          this.addVehicleExpenseForm
            .get('vehicleType')
            ?.setErrors(Validators.required);
        }

        if (typeof value === 'object')
          this.addVehicleExpenseForm.get('vehicleType')?.clearValidators();
      });
  }

  detectVehicleDetails(): void {
    this.addVehicleExpenseForm
      .get('vehicleDetails')
      ?.valueChanges.pipe(distinctUntilChanged(), debounceTime(1000))
      .subscribe((value: any) => {
        if (typeof value === 'string') {
          this.setVehicleList(value);
        }
      });
  }

  detectDriverName(): void {
    this.addVehicleExpenseForm
      .get('driverName')
      ?.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: any) => {
        if (
          value !== undefined &&
          value !== null &&
          typeof value === 'string'
        ) {
          this.setEmployeeList(value);
          this.addVehicleExpenseForm
            .get('driverName')
            ?.setErrors(Validators.required);
        }

        if (typeof value === 'object')
          this.addVehicleExpenseForm.get('driverName')?.clearValidators();
      });
  }

  detectLocation(): void {
    this.addVehicleExpenseForm
      .get('materialFrom')
      ?.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: any) => {
        if (
          value !== undefined &&
          value !== null &&
          typeof value === 'string'
        ) {
          this.setLocationList(value);
          this.addVehicleExpenseForm
            .get('materialFrom')
            ?.setErrors(Validators.required);
        }

        if (typeof value === 'object')
          this.addVehicleExpenseForm.get('materialFrom')?.clearValidators();
      });
  }

  detectMaterial(): void {
    this.addVehicleExpenseForm
      .get('materialItem')
      ?.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: any) => {
        if (
          value !== undefined &&
          value !== null &&
          typeof value === 'string'
        ) {
          this.setMaterialList(value);
          this.addVehicleExpenseForm
            .get('materialItem')
            ?.setErrors(Validators.required);
        }

        if (typeof value === 'object')
          this.addVehicleExpenseForm.get('materialItem')?.clearValidators();
      });
  }

  postFormData(): void {
    const requestBody = {
      vehicle_details: this.addVehicleExpenseForm.value?.vehicleDetails
        ? this.addVehicleExpenseForm.value.vehicleDetails
        : '',
      si_unit:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.qtyType
          ? this.addVehicleExpenseForm.value.qtyType
          : null,
      quantity:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.quantity
          ? this.addVehicleExpenseForm.value.quantity
          : null,
      delivery_date:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.deliveryDate
          ? moment(this.addVehicleExpenseForm.value.deliveryDate).format(
              'YYYY-MM-DD'
            )
          : null,
      amount:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.amount
          ? this.addVehicleExpenseForm.value.amount
          : 0,
      amount_paid:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.amountPaid
          ? this.addVehicleExpenseForm.value.amountPaid
          : 0,
      amount_date:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.paidDate
          ? moment(this.addVehicleExpenseForm.value.paidDate).format(
              'YYYY-MM-DD'
            )
          : null,
      betha:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.betha
          ? this.addVehicleExpenseForm.value.betha
          : 0,
      betha_paid:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.bethaPaid
          ? this.addVehicleExpenseForm.value.bethaPaid
          : 0,
      betha_paid_date:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.betaPaidDate
          ? moment(this.addVehicleExpenseForm.value.betaPaidDate).format(
              'YYYY-MM-DD'
            )
          : null,
      vechicle_charge:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.vehicleCahrge
          ? this.addVehicleExpenseForm.value.vehicleCahrge
          : 0,
      narration:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.narration
          ? this.addVehicleExpenseForm.value.narration
          : '',
      agreement:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.no &&
        this.addVehicleExpenseForm.value.no.id
          ? this.addVehicleExpenseForm.value.no.id
          : null,
      vehicle_type:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.vehicleType &&
        this.addVehicleExpenseForm.value.vehicleType.id
          ? this.addVehicleExpenseForm.value.vehicleType.id
          : null,
      driver_name:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.driverName &&
        this.addVehicleExpenseForm.value.driverName.id
          ? this.addVehicleExpenseForm.value.driverName.id
          : null,
      materials_from:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.materialFrom &&
        this.addVehicleExpenseForm.value.materialFrom.id
          ? this.addVehicleExpenseForm.value.materialFrom.id
          : null,
      materials:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.materialItem &&
        this.addVehicleExpenseForm.value.materialItem.id
          ? Number(this.addVehicleExpenseForm.value.materialItem.id)
          : null,
    };

    if (typeof this.addVehicleExpenseForm.value.no === 'object') {
      this.loaderService.show();
      const postDatSubs = this.agreementService
        .postVehicleExpense(
          requestBody,
          this.editMode.isActive ? true : false,
          this.editMode.agreementID ? this.editMode.agreementID : 0
        )
        .subscribe(
          (resposne) => {
            if (resposne) {
              this.agreementService.vehicleExpUpdated$.next(true);
              this.snackBarService.success(
                this.editMode.isActive
                  ? 'Vehicle Expense updated Successfully'
                  : 'Vehicle Expense added Successfully ! ',
                'Done'
              );
              this.addVehicleExpenseForm.reset();
              if (this.editMode.isActive) this.dialogRef.close();
            }
            this.loaderService.hide();
          },
          (error) => {
            console.log(error);
            this.loaderService.hide();
          }
        );

      this.subscriptionsArray.push(postDatSubs);
    } else {
      this.snackBarService.error(
        'Unable to create ! Agreement field is not valid ',
        'Done'
      );
    }
  }

  closeDialogBox(): void {}

  ngOnDestroy(): void {
    if (this.subscriptionsArray.length > 0) {
      this.subscriptionsArray.map((subs) => {
        subs.unsubscribe();
      });
    }
  }
}
