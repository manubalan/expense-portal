import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/authentication';
import { AgreementComponent } from './agreement.component';
import {
  ListAgreementComponent,
  ListEmployeeExpenseComponent,
  ListVehicleExpenseComponent,
  ListFuelExpenseComponent,
} from './components';
import { ListJcbExpenseComponent } from './components/list-jcb-expense/list-jcb-expense.component';

const routes: Routes = [
  {
    path: '',
    component: AgreementComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: 'agreements-list', component: ListAgreementComponent },
      {
        path: 'vehicle-expenses',
        component: ListVehicleExpenseComponent,
      },
      { path: 'exployee-expense', component: ListEmployeeExpenseComponent },
      { path: 'fuel-expense', component: ListFuelExpenseComponent },
      { path: 'jcb-expense', component: ListJcbExpenseComponent },
      { path: '', redirectTo: 'agreements-list' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgreementRoutingModule {}
