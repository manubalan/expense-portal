import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

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
  template: '',
  styleUrls: ['./add-agreement.component.scss'],
})
export class AddAgreementComponent implements OnInit {
  stateList = [
    {
      value: 1,
      label: 'State 1',
    },
    {
      value: 2,
      label: 'State 2',
    },
    {
      value: 3,
      label: 'State 3',
    },
    {
      value: 4,
      label: 'State 4',
    },
    {
      value: 5,
      label: 'State 5',
    },
  ];

  districtList = [
    {
      value: 1,
      label: 'District 1',
    },
    {
      value: 2,
      label: 'District 2',
    },
    {
      value: 3,
      label: 'District 3',
    },
    {
      value: 4,
      label: 'District 4',
    },
    {
      value: 5,
      label: 'District 5',
    },
  ];

  locationList = [
    {
      value: 1,
      label: 'Location 1',
    },
    {
      value: 2,
      label: 'Location 2',
    },
    {
      value: 3,
      label: 'Location 3',
    },
    {
      value: 4,
      label: 'Location 4',
    },
    {
      value: 5,
      label: 'Location 5',
    },
  ];

  @Output()
  closeDialog = new EventEmitter<any>();

  constructor(private fbuilder: FormBuilder) {}

  addAgreement: FormGroup = this.fbuilder.group({
    no: new FormControl('', Validators.required),
    name: new FormControl(''),
    amount: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    district: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
    naration: new FormControl(''),
  });

  ngOnInit(): void {
    this.addAgreement.valueChanges.subscribe((data) => {
      console.log('======> ', data);
    });
  }

  getMasterData(): void {}

  accessFormData(): void {
    console.log('Form Data -->', this.addAgreement.value);
  }

  closeDialogBox(): void {
    this.closeDialog.emit();
  }
}
