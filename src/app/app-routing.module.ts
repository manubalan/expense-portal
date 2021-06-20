import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'agreement',
    loadChildren: () =>
      import('./pages/agreement/agreement.module').then(
        (m) => m.AgreementModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
    pathMatch: 'full',
  },
  {
    path: 'master-data',
    loadChildren: () =>
      import('./pages/master-data/master-data.module').then(
        (m) => m.MasterDataModule
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
