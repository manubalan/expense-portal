import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgreementRoutingModule } from './agreement-routing.module';
import { AgreementComponent } from './agreement.component';
import { AddAgreementComponent } from './components/add-agreement/add-agreement.component';
import { ListAgreementComponent } from './components/list-agreement/list-agreement.component';

import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material.module';
import { AddEmployeExpenseComponent, AddVehicleExpensesComponent } from './components';
;

@NgModule({
  declarations: [
    AgreementComponent,
    AddAgreementComponent,
    ListAgreementComponent,
    AddEmployeExpenseComponent,
    AddVehicleExpensesComponent,
  ],
  imports: [
    CommonModule,
    AgreementRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
})
export class AgreementModule {}
