import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { MaterialModule } from 'src/app/shared/material.module';

import { EmployeeExpenseComponent } from './components/employee-expense/employee-expense.component';
import { VehicleExpenseComponent } from './components/vehicle-expense/vehicle-expense.component';
import { DriverExpenseComponent } from './components/driver-expense/driver-expense.component';

import { ReportService } from './services/report.services';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeWiseExpenseComponent } from './components/employee-wise-expense/employee-wise-expense.component';
import { DriverWiseExpenseComponent } from './components/driver-wise-expense/driver-wise-expense.component';

@NgModule({
  declarations: [
    ReportsComponent,
    EmployeeExpenseComponent,
    VehicleExpenseComponent,
    DriverExpenseComponent,
    EmployeeWiseExpenseComponent,
    DriverWiseExpenseComponent,
  ],
  imports: [CommonModule, ReportsRoutingModule, MaterialModule, ReactiveFormsModule],
  providers: [ReportService],
})
export class ReportsModule {}
