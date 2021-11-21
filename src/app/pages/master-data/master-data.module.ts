import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterDataRoutingModule } from './master-data-routing.module';
import { MasterDataComponent } from './master-data.component';
import { DataViewComponent } from './components/data-view/data-view.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { MasterDataViewService } from './components/data-view/data-view.service';
import {CdkTableModule} from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    MasterDataComponent,
    DataViewComponent
  ],
  imports: [
    CommonModule,
    MasterDataRoutingModule,
    MaterialModule,
    CdkTableModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatTooltipModule
  ],
  providers: [MasterDataViewService]
})
export class MasterDataModule { }
