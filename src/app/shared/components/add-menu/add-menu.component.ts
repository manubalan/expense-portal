import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/authentication';
import { MenuModel } from 'src/app/core';
import {
  AddAgreementComponent,
  AddEmployeExpenseComponent,
  AddFuelExpenseComponent,
  AddJcbExpenseComponent,
  AddVehicleExpensesComponent,
} from 'src/app/pages/agreement/components';
@Component({
  selector: 'ems-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.scss'],
})
export class AddMenuComponent {
  menu: MenuModel[] = [];
  addMenu: MenuModel[];

  constructor(public dialog: MatDialog, private authService: AuthService) {
    this.menu = this.authService.activeUser.menu
      ? this.authService.activeUser.menu.filter((el) => el.link === 'agreement')
      : [];

    if (this.menu.length > 0)
      this.addMenu = this.menu[0].children ? this.menu[0].children : [];
    else this.addMenu = [];
  }

  openDialog(addPage: string): void {
    if (addPage) {
      const menuItem = addPage.split('/');
      switch (menuItem[menuItem.length - 1]) {
        case 'agreements-list':
          this.dialog.open(AddAgreementComponent);
          break;
        case 'vehicle-expenses':
          this.dialog.open(AddVehicleExpensesComponent);
          break;
        case 'exployee-expense':
          this.dialog.open(AddEmployeExpenseComponent);
          break;
        case 'jcb-expense':
          this.dialog.open(AddJcbExpenseComponent);
          break;
        case 'fuel-expense':
          this.dialog.open(AddFuelExpenseComponent);
          break;
      }
    }
  }
}
