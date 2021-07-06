import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Subscription } from 'rxjs';
import {
  AgreementRequestModel,
  MasterDataService,
  ResultDataModel,
} from 'src/app/core';
import { MasterDataModule } from 'src/app/pages/master-data/master-data.module';
import { AgreementService } from '../../services';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'ems-add-agreement',
  templateUrl: './add-agreement.component.html',
  styleUrls: ['./add-agreement.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
  ]
})
export class AddAgreementComponent implements OnInit {
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
    private agreementService: AgreementService
  ) {
    this.addAgreementForm = this.fbuilder.group({
      no: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      district: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
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
    console.log('Form Data -->', this.addAgreementForm.value);

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
        ? this.addAgreementForm.value.startDate
        : '',
      end_date: this.addAgreementForm.value.endDate
        ? this.addAgreementForm.value.endDate
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
    this.agreementService.postAgreement(request).subscribe(
      (data) => {
        if (data) {
          console.log('POSTED --', data);
        }
      },
      (err) => [console.log(err)]
    );
  }

  closeDialogBox(): void {
    this.closeDialog.emit();
  }

  //   no: new FormControl('', Validators.required),
  //   name: new FormControl(''),
  //   amount: new FormControl('', Validators.required),
  //   location: new FormControl('', Validators.required),
  //   district: new FormControl('', Validators.required),
  //   state: new FormControl('', Validators.required),
  //   startDate: new FormControl('', Validators.required),
  //   endDate: new FormControl('', Validators.required),
  //   naration: new FormControl(''),
  // });

  // ngOnDestroy(): void {
  //   //Called once, before the instance is destroyed.
  //   //Add 'implements OnDestroy' to the class.
  //   // if(this.subscriptions){
  //   //   this.subscriptions.unsubscibe();
  //   // }
  // }
}
