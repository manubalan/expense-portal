import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  AgreementListResultModel,
  ConstantDataModel,
  DAY_TYPES,
  MasterDataService,
  ResultDataModel,
} from 'src/app/core';
import { LoaderService, SnackBarService } from 'src/app/shared/components';
import { AgreementService } from '../../services';

@Component({
  selector: 'ems-add-employe-expense',
  templateUrl: './add-employe-expense.component.html',
})
export class AddEmployeExpenseComponent implements OnInit, OnDestroy {
  addEmployeExpenseForm: FormGroup;
  agreementList: AgreementListResultModel[] = [];
  workTypeList: ResultDataModel[] = [];
  dayTypeList: ConstantDataModel[] = DAY_TYPES;
  employeeList: any;

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
    private dialogRef: MatDialogRef<AddEmployeExpenseComponent>
  ) {
    this.addEmployeExpenseForm = this.fbuilder.group({
      agreementNo: new FormControl('', Validators.required),
      dayType: new FormControl(''),
      employeeName: new FormControl('', Validators.required),
      workType: new FormControl(''),
      work_date: new FormControl(''),
      kooli: new FormControl('', Validators.required),
      kooliPaid: new FormControl(''),
      paid_date: new FormControl(''),
      narration: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.patchFormData();
    this.setAgreementList();
    this.setWorkTypeList();
    this.setEmployeeList();
    this.detectAgreement();
    this.detectEmployeName();
    this.detectWorkType();
  }

  patchFormData(): void {
    if (this.editMode.isActive) {
      const agreementIDSub = this.agreementService
        .getEmpExpenseID(this.editMode.agreementID)
        .subscribe((data) => {
          if (data) {
            this.addEmployeExpenseForm.patchValue({
              agreementNo: data.agreement,
              dayType: data.day,
              employeeName: data.name,
              workType: data.work_type,
              work_date: data.work_date,
              kooli: data.kooli,
              kooliPaid: data.kooli_paid,
              paid_date: data.paid_date,
              narration: data.narration,
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

  public agreementOptionView(option: any): string {
    return option ? `${option.agreement_number} - ${option.name}` : '';
  }

  public autoListView(option: any): string {
    return option ? `${option.name}` : '';
  }

  setWorkTypeList(search?: string): void {
    const workSubs = this.masterDataService
      .getWorktypesList(
        search !== undefined && search !== null ? '?search=' + search : ''
      )
      .subscribe((data) => {
        if (data && data.results) {
          this.workTypeList = data.results;
        }
      });

    this.subscriptionsArray.push(workSubs);
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

  detectAgreement(): void {
    this.addEmployeExpenseForm
      .get('agreementNo')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (value && value !== null && typeof value === 'string') {
          this.setAgreementList(value);
        }
      });
  }

  detectEmployeName(): void {
    this.addEmployeExpenseForm
      .get('employeeName')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (value && value !== null && typeof value === 'string') {
          this.setEmployeeList(value);
        }
      });
  }

  detectWorkType(): void {
    this.addEmployeExpenseForm
      .get('workType')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (value && value !== null && typeof value === 'string') {
          this.setWorkTypeList(value);
        }
      });
  }

  postFormData(): void {
    this.loaderService.show();
    const requestBody = {
      agreement:
        this.addEmployeExpenseForm.value &&
        this.addEmployeExpenseForm.value.agreementNo &&
        this.addEmployeExpenseForm.value.agreementNo.id
          ? this.addEmployeExpenseForm.value.agreementNo.id
          : null,
      day:
        this.addEmployeExpenseForm.value &&
        this.addEmployeExpenseForm.value.dayType
          ? this.addEmployeExpenseForm.value.dayType
          : null,
      name:
        this.addEmployeExpenseForm.value &&
        this.addEmployeExpenseForm.value.employeeName &&
        this.addEmployeExpenseForm.value.employeeName.id
          ? this.addEmployeExpenseForm.value.employeeName.id
          : null,
      work_type:
        this.addEmployeExpenseForm.value &&
        this.addEmployeExpenseForm.value.workType &&
        this.addEmployeExpenseForm.value.workType.id
          ? this.addEmployeExpenseForm.value.workType.id
          : null,
      work_date:
        this.addEmployeExpenseForm.value &&
        this.addEmployeExpenseForm.value.work_date
          ? moment(this.addEmployeExpenseForm.value.work_date).format(
              'YYYY-MM-DD'
            )
          : null,
      kooli:
        this.addEmployeExpenseForm.value &&
        this.addEmployeExpenseForm.value.kooli
          ? this.addEmployeExpenseForm.value.kooli
          : 0,
      kooli_paid:
        this.addEmployeExpenseForm.value &&
        this.addEmployeExpenseForm.value.kooliPaid
          ? this.addEmployeExpenseForm.value.kooliPaid
          : 0,
      paid_date:
        this.addEmployeExpenseForm.value &&
        this.addEmployeExpenseForm.value.date
          ? moment(this.addEmployeExpenseForm.value.date).format('YYYY-MM-DD')
          : null,
      narration:
        this.addEmployeExpenseForm.value &&
        this.addEmployeExpenseForm.value.narration
          ? this.addEmployeExpenseForm.value.narration
          : '',
    };

    const postDatSubs = this.agreementService
      .postEmployeeExpense(
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
                ? 'Employee Expense updated Successfully !'
                : 'Employee Expense added Successfully ! ',
              'Done'
            );
            this.addEmployeExpenseForm.reset();
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
