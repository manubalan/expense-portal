import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgreementComponent } from './agreement.component';
import { AddAgreementComponent } from './components/add-agreement/add-agreement.component';
import { ListAgreementComponent } from './components/list-agreement/list-agreement.component';

const routes: Routes = [
  {
    path: '',
    component: AgreementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgreementRoutingModule {}
