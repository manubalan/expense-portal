import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverExpenseComponent } from './components/driver-expense/driver-expense.component';
import { EmployeeExpenseComponent } from './components/employee-expense/employee-expense.component';
import { VehicleExpenseComponent } from './components/vehicle-expense/vehicle-expense.component';
import { ReportsComponent } from './reports.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      { path: 'exployee-expense', component: EmployeeExpenseComponent },
      { path: 'driver-expense', component: DriverExpenseComponent },
      { path: 'vehicle-expense', component: VehicleExpenseComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
