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
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { AddFuelExpenseComponent } from './components/add-fuel-expense/add-fuel-expense.component';
import { AddJcbExpenseComponent } from './components/add-jcb-expense/add-jcb-expense.component';
import { ListFuelExpenseComponent } from './components/list-fuel-expense/list-fuel-expense.component';
import { ListJcbExpenseComponent } from './components/list-jcb-expense/list-jcb-expense.component';

@NgModule({
  declarations: [
    AgreementComponent,
    AddAgreementComponent,
    AddEmployeExpenseComponent,
    AddVehicleExpensesComponent,
    ListAgreementComponent,
    ListEmployeeExpenseComponent,
    ListVehicleExpenseComponent,
    AddFuelExpenseComponent,
    AddJcbExpenseComponent,
    ListFuelExpenseComponent,
    ListJcbExpenseComponent
  ],
  imports: [
    CommonModule,
    AgreementRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
  ]
})
export class AgreementModule {}
