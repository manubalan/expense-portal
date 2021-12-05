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
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoaderComponent, LoaderService, SnackBarService } from './components';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [LoaderComponent],
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
    MatInputModule,
    MatDialogModule,
    MatListModule,
    MatFormFieldModule,
    MatDividerModule,
    MatToolbarModule,
    MatSidenavModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  exports: [
    LoaderComponent,
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
    MatInputModule,
    MatDialogModule,
    MatListModule,
    MatFormFieldModule,
    MatDividerModule,
    MatToolbarModule,
    MatSidenavModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  providers: [LoaderService, SnackBarService],
})
export class MaterialModule {}
