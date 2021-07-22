import {
  AfterViewChecked,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  AgreementRequestModel,
  MasterDataService,
  ResultDataModel,
  ValidateAgreementResponseModel,
} from 'src/app/core';
import { MasterDataModule } from 'src/app/pages/master-data/master-data.module';
import { AgreementService } from '../../services';

import * as moment from 'moment';
import { LoaderService, SnackBarService } from 'src/app/shared/components';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'ems-add-agreement',
  templateUrl: './add-agreement.component.html',
})
export class AddAgreementComponent implements OnInit, OnDestroy {
  addAgreementForm: FormGroup;
  stateData: MasterDataModule = {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };
  stateList: ResultDataModel[] = [];
  districtData: MasterDataModule = {};
  districtList: ResultDataModel[] = [];
  locationData: MasterDataModule = {};
  locationList: ResultDataModel[] = [];
  validateAgreement: ValidateAgreementResponseModel = { showNow: false };

  editMode = {
    isActive: false,
    agreementID: 0,
  };

  private subscriptions: Subscription[] = [];

  @Output()
  closeDialog = new EventEmitter<any>();

  constructor(
    private fbuilder: FormBuilder,
    private masterDataService: MasterDataService,
    private agreementService: AgreementService,
    private loaderService: LoaderService,
    private snackBarService: SnackBarService
  ) {
    this.addAgreementForm = this.fbuilder.group({
      no: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      district: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl(''),
      naration: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.patchFormData();
    this.setStateData();
    this.detectStateData();
    this.detectDistrictData();
    this.detectAgreementNumber();
  }

  patchFormData(): void {
    if (this.editMode.isActive) {
      const agreementIDSub = this.agreementService
        .getAgreementID(this.editMode.agreementID)
        .subscribe((data) => {
          if (data) {
            this.addAgreementForm.patchValue({
              no: data.agreement_number,
              name: data.name,
              amount: data.amount,
              location: data.location,
              district: data.district,
              state: data.state,
              startDate: data.start_date,
              endDate: data.end_date,
              naration: data.narration,
            });
          }
        });

      this.subscriptions.push(agreementIDSub);
    }
  }

  setStateData(): void {
    this.loaderService.show();
    const stateDataSub = this.masterDataService
      .getStateList()
      .subscribe((data) => {
        this.loaderService.hide();
        if (data !== null && data.results) {
          this.stateData = data;
          this.stateList = data.results;
        }
      });

    this.subscriptions.push(stateDataSub);
  }

  setDistrictData(params?: number): void {
    this.loaderService.show();
    const stateDataSub = this.masterDataService
      .getDistrictsList(params)
      .subscribe((data) => {
        this.loaderService.hide();
        if (data !== null && data.results) {
          this.districtData = data;
          this.districtList = data.results;
        }
      });

    this.subscriptions.push(stateDataSub);
  }

  setLocationData(params?: number): void {
    this.loaderService.show();
    const stateDataSub = this.masterDataService
      .getLocationsList(params)
      .subscribe((data) => {
        this.loaderService.hide();
        if (data !== null && data.results) {
          this.locationData = data;
          this.locationList = data.results;
        }
      });

    this.subscriptions.push(stateDataSub);
  }

  detectAgreementNumber(): void {
    const validateSubscription = this.addAgreementForm
      .get('no')
      ?.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        if (value !== null && value !== '') {
          this.loaderService.show();
          this.agreementService.validateAgreement(value).subscribe((data) => {
            this.loaderService.hide();
            if (data) {
              this.validateAgreement = data;
              this.validateAgreement.showNow = true;
            }
          });
        }
      });

    // this.subscriptions.push(validateSubscription);
  }

  detectStateData(): void {
    this.addAgreementForm.get('state')?.valueChanges.subscribe((value: any) => {
      if (value) {
        this.setDistrictData(value);
      }
    });
  }

  detectDistrictData(): void {
    this.addAgreementForm
      .get('district')
      ?.valueChanges.subscribe((value: any) => {
        if (value) {
          this.setLocationData(value);
        }
      });
  }

  postFormData(): void {
    this.loaderService.show();

    const request: AgreementRequestModel = {
      agreement_number: this.addAgreementForm.value.no
        ? this.addAgreementForm.value.no
        : '',
      name: this.addAgreementForm.value.name
        ? this.addAgreementForm.value.name
        : '',
      amount: this.addAgreementForm.value.amount
        ? this.addAgreementForm.value.amount
        : '',
      start_date: this.addAgreementForm.value.startDate
        ? moment(this.addAgreementForm.value.startDate).format('YYYY-MM-DD')
        : '',
      end_date: this.addAgreementForm.value.endDate
        ? moment(this.addAgreementForm.value.endDate).format('YYYY-MM-DD')
        : null,
      narration: this.addAgreementForm.value.naration
        ? this.addAgreementForm.value.naration
        : '',
      location: this.addAgreementForm.value.location
        ? this.addAgreementForm.value.location
        : '',
      district: this.addAgreementForm.value.district
        ? this.addAgreementForm.value.district
        : '',
      state: this.addAgreementForm.value.state
        ? this.addAgreementForm.value.state
        : '',
    };

    this.agreementService
      .postAgreement(
        request,
        this.editMode.isActive ? true : false,
        this.editMode.agreementID ? this.editMode.agreementID : 0
      )
      .subscribe((data) => {
        if (data) {
          this.agreementService.agreementUpdated$.next(true);
          this.snackBarService.success(
            this.editMode.isActive
              ? 'Agreement updated Successfully ! '
              : 'Agreement added Successfully !',
            'Done'
          );

          this.addAgreementForm.reset();
          this.validateAgreement.showNow = false;
          this.loaderService.hide();
        }
        this.loaderService.hide();
      });
  }

  closeDialogBox(): void {
    this.closeDialog.emit();
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((subs) => [subs.unsubscribe()]);
    }
  }
}
