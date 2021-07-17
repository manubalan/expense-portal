import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  AgreementListResultModel,
  ConstantDataModel,
  MasterDataService,
  QuqntityType,
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
  employeeList: any;

  qtyTypeList: ConstantDataModel[] = QuqntityType;

  private subscriptionsArray: Subscription[] = [];

  constructor(
    private fbuilder: FormBuilder,
    private masterDataService: MasterDataService,
    private agreementService: AgreementService,
    private loaderService: LoaderService,
    private snackBarService: SnackBarService
  ) {
    this.addVehicleExpenseForm = this.fbuilder.group({
      no: new FormControl('', Validators.required),
      vehicleType: new FormControl(''),
      vehicleDetails: new FormControl(''),
      driverName: new FormControl(''),
      materialFrom: new FormControl(''),
      materialItem: new FormControl(''),
      qtyType: new FormControl(''),
      quantity: new FormControl(''),
      deliveryDate: new FormControl(''),
      amount: new FormControl(0),
      amountPaid: new FormControl(0),
      paidDate: new FormControl(''),
      betha: new FormControl(0),
      bethaPaid: new FormControl(0),
      vehicleCahrge: new FormControl(0),
      narration: new FormControl(''),
      totalAmount: new FormControl(0),
    });
  }

  ngOnInit(): void {
    this.setAgreementList();
    this.setVehicleTypeList();
    this.setMaterialList();
    this.setEmployeeList();
    this.detectFormData();
  }

  setAgreementList(): void {
    this.loaderService.show();
    this.agreementList = [];
    const agreementSubs = this.agreementService
      .getAgreements()
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.agreementList = data.results;
        }
      });

    this.subscriptionsArray.push(agreementSubs);
  }

  setVehicleTypeList(): void {
    this.loaderService.show();
    const vehicleSubs = this.masterDataService
      .getVehicletypesList()
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.vehicleTypeList = data.results;
        }
      });

    this.subscriptionsArray.push(vehicleSubs);
  }

  setMaterialList(): void {
    this.loaderService.show();
    const materialSubs = this.masterDataService
      .getMaterialsList()
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.materialItemList = data.results;
        }
      });

    this.subscriptionsArray.push(materialSubs);
  }

  setEmployeeList(): void {
    this.loaderService.show();
    const employSubs = this.masterDataService
      .getEmployeesList()
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.employeeList = data.results;
        }
      });

    this.subscriptionsArray.push(employSubs);
  }

  detectFormData(): void {
    const amountSubs = this.addVehicleExpenseForm
      .get('amountPaid')
      ?.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        this.addVehicleExpenseForm
          .get('totalAmount')
          ?.setValue(this.addVehicleExpenseForm.value.totalAmount + value);
      });

    if (amountSubs) {
      this.subscriptionsArray.push(amountSubs);
    }

    const bathSubs = this.addVehicleExpenseForm
      .get('bethaPaid')
      ?.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        this.addVehicleExpenseForm
          .get('totalAmount')
          ?.setValue(this.addVehicleExpenseForm.value.totalAmount + value);
      });

    if (bathSubs) {
      this.subscriptionsArray.push(bathSubs);
    }

    const vehicleSubs = this.addVehicleExpenseForm
      .get('vehicleCahrge')
      ?.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        this.addVehicleExpenseForm
          .get('totalAmount')
          ?.setValue(this.addVehicleExpenseForm.value.totalAmount + value);
      });

    if (vehicleSubs) {
      this.subscriptionsArray.push(vehicleSubs);
    }
  }

  postFormData(): void {
    this.loaderService.show();
    const requestBody = {
      vehicle_details:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.vehicleDetails
          ? this.addVehicleExpenseForm.value.vehicleDetails
          : '',
      qty_type:
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
          : null,
      amount_paid:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.amountPaid
          ? this.addVehicleExpenseForm.value.amountPaid
          : null,
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
          : null,
      betha_paid:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.bethaPaid
          ? this.addVehicleExpenseForm.value.bethaPaid
          : null,
      vechicle_charge:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.vehicleCahrge
          ? this.addVehicleExpenseForm.value.vehicleCahrge
          : null,
      narration:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.narration
          ? this.addVehicleExpenseForm.value.narration
          : '',
      agreement:
        this.addVehicleExpenseForm.value && this.addVehicleExpenseForm.value.no
          ? this.addVehicleExpenseForm.value.no
          : null,
      vehicle_type:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.vehicleType
          ? this.addVehicleExpenseForm.value.vehicleType
          : null,
      driver_name:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.driverName
          ? this.addVehicleExpenseForm.value.driverName
          : null,
      materials_from:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.materialFrom
          ? this.addVehicleExpenseForm.value.materialFrom
          : null,
      materials:
        this.addVehicleExpenseForm.value &&
        this.addVehicleExpenseForm.value.materialItem
          ? Number(this.addVehicleExpenseForm.value.materialItem)
          : null,
    };

    const postDatSubs = this.agreementService
      .postEmployeeExpense(requestBody)
      .subscribe(
        (resposne) => {
          if (resposne) {
            this.snackBarService.success(
              'Vehicle Expense added Successfully ! ',
              'Done'
            );
            this.addVehicleExpenseForm.reset();
          }
          this.loaderService.hide();
          console.log('response');
        },
        (error) => {
          console.log(error);
          this.loaderService.hide();
        }
      );

    this.subscriptionsArray.push(postDatSubs);
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
