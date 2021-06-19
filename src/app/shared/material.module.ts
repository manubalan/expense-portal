import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatTabsModule,
    MatPaginatorModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatSelectModule,
  ],
  exports: [
    MatExpansionModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatTabsModule,
    MatPaginatorModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatSelectModule,
  ],
})
export class MaterialModule {}
