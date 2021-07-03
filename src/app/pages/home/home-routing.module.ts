import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'master-data',
        loadChildren: () =>
          import('../master-data/master-data.module').then(
            (m) => m.MasterDataModule
          ),
      },
      {
        path: 'agreement',
        loadChildren: () =>
          import('../agreement/agreement.module').then(
            (m) => m.AgreementModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
