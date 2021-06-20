import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterDataRoutingModule } from './master-data-routing.module';
import { MasterDataComponent } from './master-data.component';


@NgModule({
  declarations: [
    MasterDataComponent
  ],
  imports: [
    CommonModule,
    MasterDataRoutingModule
  ]
})
export class MasterDataModule { }
