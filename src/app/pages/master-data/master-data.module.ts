import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterDataRoutingModule } from './master-data-routing.module';
import { MasterDataComponent } from './master-data.component';
import { DataViewComponent } from './components/data-view/data-view.component';
import { MaterialModule } from 'src/app/shared/material.module';


@NgModule({
  declarations: [
    MasterDataComponent,
    DataViewComponent
  ],
  imports: [
    CommonModule,
    MasterDataRoutingModule,
    MaterialModule
  ]
})
export class MasterDataModule { }
