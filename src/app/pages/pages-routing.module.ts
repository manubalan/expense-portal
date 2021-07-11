import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'agreement',
        loadChildren: () =>
          import('./agreement/agreement.module').then((m) => m.AgreementModule),
      },
      {
        path: 'master',
        loadChildren: () =>
          import('./master-data/master-data.module').then(
            (m) => m.MasterDataModule
          ),
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}