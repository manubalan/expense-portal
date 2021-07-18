import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgreementRoutingModule } from './agreement-routing.module';
import { AgreementComponent } from './agreement.component';

import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material.module';
import {
  AddAgreementComponent,
  AddEmployeExpenseComponent,
  AddVehicleExpensesComponent,
  ListAgreementComponent,
  ListEmployeeExpenseComponent,
  ListVehicleExpenseComponent,
} from './components';

@NgModule({
  declarations: [
    AgreementComponent,
    AddAgreementComponent,
    AddEmployeExpenseComponent,
    AddVehicleExpensesComponent,
    ListAgreementComponent,
    ListEmployeeExpenseComponent,
    ListVehicleExpenseComponent
  ],
  imports: [
    CommonModule,
    AgreementRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
})
export class AgreementModule {}
