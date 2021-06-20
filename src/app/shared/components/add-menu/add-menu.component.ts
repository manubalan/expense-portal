import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddAgreementComponent } from 'src/app/pages/agreement/components/add-agreement/add-agreement.component';
import { AddEmployeExpenseComponent } from 'src/app/pages/agreement/components/add-employe-expense/add-employe-expense.component';
import { AddVehicleExpensesComponent } from 'src/app/pages/agreement/components/add-vehicle-expenses/add-vehicle-expenses.component';

@Component({
  selector: 'ems-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.scss'],
})
export class AddMenuComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  openDialog(addPage: string): void {
    if (addPage === 'agreement') {
      this.dialog.open(AddAgreementComponent);
    } else if (addPage === 'vehicle-expense') {
      this.dialog.open(AddVehicleExpensesComponent);
    } else if (addPage === 'employee-expense') {
      this.dialog.open(AddEmployeExpenseComponent);
    }
  }
}
