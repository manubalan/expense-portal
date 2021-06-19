import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgreementComponent } from './agreement.component';
import { AddAgreementComponent } from './components/add-agreement/add-agreement.component';
import { ListAgreementComponent } from './components/list-agreement/list-agreement.component';

const routes: Routes = [
  {
    path: '',
    component: AgreementComponent,
    children: [
      { path: '', component: ListAgreementComponent },
      { path: 'add', component: AddAgreementComponent },
      { path: 'expenses', component: ListAgreementComponent },
      { path: '', redirectTo: 'view' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgreementRoutingModule {}
