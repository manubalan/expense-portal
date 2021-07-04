import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MaterialModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    PagesComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MaterialModule,
    MatSidenavModule,
    SharedModule,
  ]
})
export class PagesModule { }
