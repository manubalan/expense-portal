import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SidebarService } from './components/sidebar/sidebar.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { AuthService } from '../authentication/services/auth.service';
import { allSharedComponents } from './components/export.all';
import { DialogBoxService } from './components';

@NgModule({
  declarations: [...allSharedComponents],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MaterialModule],
  exports: [...allSharedComponents],
  providers: [SidebarService, AuthService, DialogBoxService],
})
export class SharedModule {}
