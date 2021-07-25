import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MasterDataService } from 'src/app/core';
import {
  DialogBoxService,
  LoaderService,
  SnackBarService,
} from 'src/app/shared/components';
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
export class ListVehicleExpenseComponent implements OnInit, OnDestroy, OnChanges {
  displayedColumns: string[] = [];
  dataSource: any;
  subscriptionArray: Subscription[] = [];

  @Input()
  fullView = false;

  constructor(
    public dialog: MatDialog,
    private agreementService: AgreementService,
    private loaderService: LoaderService,
    private dialogeService: DialogBoxService,
    private snackBarService: SnackBarService
  ) {
    this.getVehicleExpenseList();
  }

  ngOnInit(): void {
    const subjectSubs = this.agreementService.vehicleExpUpdated$.subscribe(
      (update) => {
        if (update) {
          this.getVehicleExpenseList();
        }
      }
    );
    this.subscriptionArray.push(subjectSubs);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (changes.fullView && changes.fullView.currentValue) {
        this.displayedColumns = [
          'id',
          'agreement',
          'vehicle_details',
          'vehicle_type',
          'vechicle_charge',
          'materials',
          'qty_type',
          'quantity',
          'driver_name',
          'delivery_date',
          'betha',
          'betha_paid',
          'amount',
          'amount_paid',
          'amount_date',
          'total_amount',
          'action',
        ];
      } else {
        this.displayedColumns = [
          'id',
          'agreement',
          'vehicle_details',
          'materials',
          'action',
        ];
      }
    }
  }


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

  deleteVehicleExpense(ID: number): void {
    const ref = this.dialogeService.openDialog('Are sure want to delete ?');
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loaderService.show();
        const delSubs = this.agreementService
          .deleteVehicleExp(ID)
          .subscribe((response) => {
            this.agreementService.vehicleExpUpdated$.next(true);
            this.snackBarService.success(
              'Vehicle Expense removed Successfully ! ',
              'Done'
            );
            this.loaderService.hide();
          });

        this.subscriptionArray.push(delSubs);
      }
    });
  }

  ngOnDestroy(): void {
    this.agreementService.vehicleExpUpdated$.complete();
    if (this.subscriptionArray.length > 0) {
      this.subscriptionArray.forEach((sub) => {
        sub.unsubscribe();
      });
    }
  }
}
