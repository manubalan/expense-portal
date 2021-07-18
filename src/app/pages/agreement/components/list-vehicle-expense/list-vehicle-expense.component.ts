import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MasterDataService } from 'src/app/core';
import { LoaderService } from 'src/app/shared/components';
import { AgreementService } from '../../services';
import { AddVehicleExpensesComponent } from '../add-vehicle-expenses/add-vehicle-expenses.component';

@Component({
  selector: 'ems-list-vehicle-expense',
  templateUrl: './list-vehicle-expense.component.html',
  styleUrls: ['./list-vehicle-expense.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ListVehicleExpenseComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'agreement',
    'vehicle_details',
    'vehicle_type',
    'materials',
    'action',
  ];
  dataSource: any;

  constructor(
    public dialog: MatDialog,
    private agreementService: AgreementService,
    private loaderService: LoaderService
  ) {
    this.getVehicleExpenseList();
  }

  ngOnInit(): void {}

  getVehicleExpenseList(): void {
    this.loaderService.show();
    this.agreementService.getVehicleExpense().subscribe((data) => {
      this.loaderService.hide();
      if (data) {
        this.dataSource = data.results;
      }
    });
  }

  editVehicleExpense(ID: number): void {
    this.dialog.open(AddVehicleExpensesComponent).componentInstance.editMode = {
      isActive: true,
      agreementID: ID,
    };
  }
}
