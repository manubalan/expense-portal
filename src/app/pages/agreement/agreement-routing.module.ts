import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgreementComponent } from './agreement.component';
import {
  ListAgreementComponent,
  ListEmployeeExpenseComponent,
  ListVehicleExpenseComponent,
} from './components';

const routes: Routes = [
  {
    path: '',
    component: AgreementComponent,
    children: [
      { path: 'agreements-list', component: ListAgreementComponent },
      {
        path: 'vehicle-expenses',
        component: ListVehicleExpenseComponent,
      },
      { path: 'exployee-expense', component: ListEmployeeExpenseComponent },
      { path: '', redirectTo: 'agreements-list' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgreementRoutingModule {}
