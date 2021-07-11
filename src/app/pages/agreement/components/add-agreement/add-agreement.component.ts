import {
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
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  AgreementRequestModel,
  MasterDataService,
  ResultDataModel,
} from 'src/app/core';
import { MasterDataModule } from 'src/app/pages/master-data/master-data.module';
import { AgreementService } from '../../services';

import * as moment from 'moment';
import { LoaderService, SnackBarService } from 'src/app/shared/components';

@Component({
  selector: 'ems-add-agreement',
  templateUrl: './add-agreement.component.html',
  styleUrls: ['./add-agreement.component.scss'],
})
export class AddAgreementComponent implements OnInit, OnDestroy {
  addAgreementForm: FormGroup;
  stateData: MasterDataModule = {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };
  staleList: ResultDataModel[] = [];
  districtData: MasterDataModule = {};
  districtList: ResultDataModel[] = [];
  locationData: MasterDataModule = {};
  locationList: ResultDataModel[] = [];

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
    this.setStateData();
    this.detectStateData();
    this.detectDistrictData();

    this.addAgreementForm.valueChanges.subscribe((data) => [
      console.log('AGREEMENT FORM -- ', data),
    ]);
  }

  setStateData(): void {
    const stateDataSub = this.masterDataService
      .getStateList()
      .subscribe((data) => {
        if (data !== null && data.results) {
          this.stateData = data;
          this.staleList = data.results;
        }
      });

    this.subscriptions.push(stateDataSub);
  }

  setDistrictData(params?: number): void {
    const stateDataSub = this.masterDataService
      .getDistrictsList(params)
      .subscribe((data) => {
        if (data !== null && data.results) {
          this.districtData = data;
          this.districtList = data.results;
        }
      });

    this.subscriptions.push(stateDataSub);
  }

  setLocationData(params?: number): void {
    const stateDataSub = this.masterDataService
      .getLocationsList(params)
      .subscribe((data) => {
        if (data !== null && data.results) {
          this.locationData = data;
          this.locationList = data.results;
        }
      });

    this.subscriptions.push(stateDataSub);
  }

  detectStateData(): void {
    this.addAgreementForm.get('state')?.valueChanges.subscribe((value: any) => {
      if (value) {
        console.log('STATE --> ', value);
        this.setDistrictData(value);
      }
    });
  }

  detectDistrictData(): void {
    this.addAgreementForm
      .get('district')
      ?.valueChanges.subscribe((value: any) => {
        if (value) {
          console.log('DISTRICT --> ', value);
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
        : '',
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
    this.agreementService.postAgreement(request).subscribe((data) => {
      if (data) {
        this.snackBarService.success('Agreement added Successfully ! ', 'Done');

        this.addAgreementForm.reset();
        this.loaderService.hide();
      }
      this.loaderService.hide();
    });
    // (error: any) => {
    //   if (error) {
    //     this.snackBarService.error('Agreement added Successfully ! ', 'Done');

    //   }
    // };
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
