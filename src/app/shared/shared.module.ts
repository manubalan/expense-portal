import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavigationComponent } from './components/navigation/navigation.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { SidebarService } from './components/sidebar/sidebar.service';
import { AddMenuComponent } from './components/add-menu/add-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [NavigationComponent, SidebarComponent, AddMenuComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatDividerModule,
    MatListModule,
    MatExpansionModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatSidenavModule,
    MatListModule
  ],
  exports: [NavigationComponent, SidebarComponent, AddMenuComponent],
  providers: [SidebarService]
})
export class SharedModule {}
