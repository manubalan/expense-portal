import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/authentication';
import { DataViewComponent } from './components/data-view/data-view.component';
import { MasterDataComponent } from './master-data.component';

const routes: Routes = [
  {
    path: '',
    component: MasterDataComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: 'view', component: DataViewComponent },
      { path: '', redirectTo: 'view' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterDataRoutingModule {}
