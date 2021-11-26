import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {
  MasterDataService,
  PageAttrEventModel,
  PageAttrModel,
  PAGE_ATTR_DATA,
} from 'src/app/core';
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
})
export class ListVehicleExpenseComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [];
  dataSource: any;
  pageAttributes: PageAttrModel = {...PAGE_ATTR_DATA};

  subscriptionArray: Subscription[] = [];

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

    this.displayedColumns = [
      'agreement',
      'vehicle_type',
      'vehicle_details',
      'driver_name',
      'materials_from_details',
      'materials',
      'qty_type',
      'quantity',
      'delivery_date',
      'amount',
      'amount_paid',
      'betha',
      'betha_paid',
      'vechicle_charge',
      'total_amount',
      'action',
    ];
  }

  getVehicleExpenseList(): void {
    const paramList = [];
    let paramUrl = '';
    if (this.pageAttributes.pageSize > 0) {
      paramList.push(`limit=${this.pageAttributes.pageSize}`);
    }
    if (this.pageAttributes.currentPage > 0) {
      paramList.push(
        `offset=${
          this.pageAttributes.currentPage * this.pageAttributes.pageSize
        }`
      );
    } else if (this.pageAttributes.currentPage === 0) {
      paramList.push(`offset=${this.pageAttributes.currentPage}`);
    }

    if (paramList.length > 0) {
      paramList.map((par) => {
        paramUrl = paramUrl + par + '&';
      });
    }

    this.loaderService.show();
    this.agreementService.getVehicleExpense().subscribe((data) => {
      this.loaderService.hide();
      if (data) {
        this.dataSource = data.results;
        if (data.count) this.pageAttributes.totalRecord = data.count;
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

  handlePage(event: PageAttrEventModel): void {
    this.pageAttributes.pageSize = event.pageSize
      ? event.pageSize
      : this.pageAttributes.pageSize;
      if (event.pageIndex !== undefined)
      this.pageAttributes.currentPage =
        event.pageIndex >= 0
          ? event.pageIndex
          : this.pageAttributes.currentPage;
    this.pageAttributes.prevPage = event.previousPageIndex
      ? event.previousPageIndex
      : this.pageAttributes.prevPage;
    this.getVehicleExpenseList();
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
