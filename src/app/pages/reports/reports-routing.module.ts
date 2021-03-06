import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/authentication';
import { DriverExpenseComponent } from './components/driver-expense/driver-expense.component';
import { EmployeeExpenseComponent } from './components/employee-expense/employee-expense.component';
import { EmployeeWiseExpenseComponent } from './components/employee-wise-expense/employee-wise-expense.component';
import { FuelExpenseComponent } from './components/fuel-expense/fuel-expense.component';
import { JcbExpenseComponent } from './components/jcb-expense/jcb-expense.component';
import { VehicleDriverExpenseComponent } from './components/vehicle-driver-expense/vehicle-driver-expense.component';
import { VehicleExpenseComponent } from './components/vehicle-expense/vehicle-expense.component';
import { ReportsComponent } from './reports.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: 'exployee-expense', component: EmployeeExpenseComponent },
      {
        path: 'exployee-wise-expense',
        component: EmployeeWiseExpenseComponent,
      },
      { path: 'driver-expense', component: DriverExpenseComponent },
      { path: 'driver-wise-expense', component: VehicleDriverExpenseComponent },
      { path: 'vehicle-expense', component: VehicleExpenseComponent },
      {path:'fuel-expense', component: FuelExpenseComponent},
      {path:'jcb-expense', component: JcbExpenseComponent},
      { path: '', redirectTo: 'exployee-expense' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
