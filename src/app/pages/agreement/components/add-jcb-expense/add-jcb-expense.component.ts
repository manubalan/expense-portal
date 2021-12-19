import { Component, OnInit } from '@angular/core';
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
import { JCBFormModel, MasterDataService } from 'src/app/core';
import { LoaderService, SnackBarService } from 'src/app/shared';
import { AddAgreementComponent } from '..';
import { AgreementService } from '../../services';

@Component({
  selector: 'ems-add-jcb-expense',
  templateUrl: './add-jcb-expense.component.html',
})
export class AddJcbExpenseComponent implements OnInit {
  addJcbExpenseForm: FormGroup;
  editMode = {
    isActive: false,
    fuelExpenseID: 0,
  };

  calculation = {
    hours: 0,
    amount: 0,
    total: 0,
    grantTotal: 0,
    error: { hasError: false, message: '' },
  };

  locationList: any[] = [];
  agreementList: any[] = [];
  operatorList: any[] = [];

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
    this.addJcbExpenseForm = this.fbuilder.group({
      date: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      starting_reading: new FormControl(null, Validators.required),
      closing_reading: new FormControl(null, Validators.required),
      per_hour_charge: new FormControl(null, Validators.required),
      bata: new FormControl(null),
      tipper_rent: new FormControl(null),
      old_balance: new FormControl(null),
      other_charge: new FormControl(null),
      narration: new FormControl(null),
      location: new FormControl(null),
      agreement: new FormControl(null),
      operator: new FormControl(null, Validators.required),
    });
    this.dateAdapter.setLocale('en-GB');
  }

  public locationListOptionView(option: any): any {
    return option ? `${option.name}` : '';
  }

  ngOnInit(): void {
    this.setMasterdata();
    this.detectFormValueChange();
    this.detectFieldsCalculations();
    this.patchFormData();
  }

  setMasterdata(): void {
    this.setLocationList();
    this.setAgreementList();
    this.setOperatorList();
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

  setOperatorList(search?: string): void {
    this.loaderService.show();
    const employSubs = this.masterDataService
      .getEmployeesList(
        search !== undefined && search !== null ? '?search=' + search : ''
      )
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.operatorList = data.results;
        }
      });

    this.subscriptionsArray.push(employSubs);
  }

  public agreementOptionView(option: any): string {
    return option ? `${option.agreement_number} - ${option.name}` : '';
  }

  // DETECT VALue Change
  detectFormValueChange(): void {
    this.addJcbExpenseForm.updateValueAndValidity();
    // Field 1
    const location = this.addJcbExpenseForm
      .get('location')
      ?.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.setLocationList(value);
      });
    if (location) this.subscriptionsArray.push(location);

    // Field 2
    const vehiclenumber = this.addJcbExpenseForm
      .get('agreement')
      ?.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.setAgreementList(value);
      });
    if (vehiclenumber) this.subscriptionsArray.push(vehiclenumber);

    // Field 3
    const detectSubs = this.addJcbExpenseForm
      .get('operator')
      ?.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.setOperatorList(value);
      });
    if (detectSubs) this.subscriptionsArray.push(detectSubs);
  }

  evaluateReading(values: JCBFormModel) {
    if (values.starting_reading && values.closing_reading) {
      const start = values.starting_reading;
      const end = values.closing_reading;
      if (start && end)
        if (Number(end) > Number(start)) {
          this.calculation.hours = Number((end - start).toFixed(2));
          this.calculation.error = {
            hasError: false,
            message: '',
          };
        } else {
          this.calculation.error = {
            hasError: true,
            message: 'Closing Reading should be greater than Starting Reading',
          };
        }
    }

    if (values.per_hour_charge && this.calculation.hours) {
      if (values.per_hour_charge > 0 && this.calculation.hours > 0) {
        this.calculation.amount =
          values.per_hour_charge * this.calculation.hours;
      }
    }

    this.calculation.total =
      Number(this.calculation.amount) +
      Number(values.bata > 0 ? values.bata : 0);

    this.calculation.grantTotal =
      Number(this.calculation.total) +
      Number(values.tipper_rent > 0 ? values.tipper_rent : 0) +
      Number(values.old_balance > 0 ? values.old_balance : 0) +
      Number(values.other_charge > 0 ? values.other_charge : 0);
  }

  detectFieldsCalculations(): void {
    this.addJcbExpenseForm.updateValueAndValidity();
    const detectUnit = this.addJcbExpenseForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.evaluateReading(this.addJcbExpenseForm.value);
      });
    if (detectUnit) this.subscriptionsArray.push(detectUnit);
  }

  postFormData(): void {
    this.addJcbExpenseForm.updateValueAndValidity();

    const requestBody = {
      date: this.addJcbExpenseForm.value.date
        ? moment(this.addJcbExpenseForm.value.date).format('YYYY-MM-DD')
        : null,
      name: this.addJcbExpenseForm.value.name
        ? this.addJcbExpenseForm.value.name
        : '',
      starting_reading: this.addJcbExpenseForm.value.starting_reading
        ? this.addJcbExpenseForm.value.starting_reading
        : null,
      closing_reading: this.addJcbExpenseForm.value.closing_reading
        ? this.addJcbExpenseForm.value.closing_reading
        : null,
      per_hour_charge: this.addJcbExpenseForm.value.per_hour_charge
        ? this.addJcbExpenseForm.value.per_hour_charge
        : null,
      bata: this.addJcbExpenseForm.value.bata
        ? this.addJcbExpenseForm.value.bata
        : null,
      tipper_rent: this.addJcbExpenseForm.value.tipper_rent
        ? this.addJcbExpenseForm.value.tipper_rent
        : null,
      old_balance: this.addJcbExpenseForm.value.old_balance
        ? this.addJcbExpenseForm.value.old_balance
        : null,
      other_charge: this.addJcbExpenseForm.value.other_charge
        ? this.addJcbExpenseForm.value.other_charge
        : null,
      narration: this.addJcbExpenseForm.value.narration
        ? this.addJcbExpenseForm.value.narration
        : '',
      location:
        typeof this.addJcbExpenseForm.value.location === 'object' &&
        this.addJcbExpenseForm.value.location.id
          ? this.addJcbExpenseForm.value.location.id
          : null,
      agreement:
        typeof this.addJcbExpenseForm.value.agreement === 'object' &&
        this.addJcbExpenseForm.value.agreement.id
          ? this.addJcbExpenseForm.value.agreement.id
          : null,
      operator:
        typeof this.addJcbExpenseForm.value.operator === 'object' &&
        this.addJcbExpenseForm.value.operator.id
          ? this.addJcbExpenseForm.value.operator.id
          : null,
    };

    const add = this.agreementService
      .postJcblExpense(
        requestBody,
        this.editMode.isActive ? true : false,
        this.editMode.fuelExpenseID ? this.editMode.fuelExpenseID : 0
      )
      .subscribe((response) => {
        if (response) {
          this.agreementService.jcbExpUpdated$.next(true);
          this.snackBarService.success(
            this.editMode.isActive
              ? 'JCB Expense updated Successfully ! '
              : 'JCB Expense added Successfully !',
            'Done'
          );

          if (this.editMode.isActive) this.dialogRef.close();
          this.addJcbExpenseForm.reset();
        }
        this.loaderService.hide();
      });

    if (add) this.subscriptionsArray.push(add);
  }

  // UPDATE MODE
  patchFormData(): void {
    if (this.editMode.isActive) {
      const agreementIDSub = this.agreementService
        .getJcbExpenseID(this.editMode.fuelExpenseID)
        .subscribe((data) => {
          debugger;
          if (data) {
            this.addJcbExpenseForm.patchValue({
              date: data?.date,
              name: data?.name,
              starting_reading: data?.starting_reading,
              closing_reading: data?.closing_reading,
              per_hour_charge: data?.per_hour_charge,
              bata: data?.bata,
              tipper_rent: data.tipper_rent,
              old_balance: data?.old_balance,
              other_charge: data?.other_charge,
              narration: data?.narration,
              location: {
                id: data?.location,
                name: data?.location_details?.name,
              },
              agreement: this.patchAgreement(
                data.agreement,
                data?.agreement_details?.agreement_number
              ),
              operator: {
                id: data?.operator,
                name: data?.operator_details?.name,
              },
            });
          }
        });

      this.subscriptionsArray.push(agreementIDSub);
    }
  }

  patchAgreement(id: any, name: any): any {
    if (id && name)
      return {
        agreement_number: id,
        name: name,
      };
    else return null;
  }

  ngOnDestroy(): void {
    if (this.subscriptionsArray.length > 0) {
      this.subscriptionsArray.forEach((subs) => [subs.unsubscribe()]);
    }
  }
}
