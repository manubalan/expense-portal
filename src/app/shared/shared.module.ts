import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavigationComponent } from './components/navigation/navigation.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { SidebarService } from './components/sidebar/sidebar.service';
import { AddMenuComponent } from './components/add-menu/add-menu.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { AuthService } from '../authentication/services/auth.service';


@NgModule({
  declarations: [NavigationComponent, SidebarComponent, AddMenuComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [NavigationComponent, SidebarComponent, AddMenuComponent],
  providers: [SidebarService, AuthService]
})
export class SharedModule {}
