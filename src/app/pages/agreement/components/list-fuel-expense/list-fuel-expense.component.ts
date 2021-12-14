import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PageAttrEventModel, PageAttrModel, PAGE_ATTR_DATA } from 'src/app/core';
import { LoaderService } from 'src/app/shared';
import { AgreementService } from '../../services';

@Component({
  selector: 'ems-list-fuel-expense',
  templateUrl: './list-fuel-expense.component.html',
  styleUrls: ['./list-fuel-expense.component.scss'],
})
export class ListFuelExpenseComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource: any;
  pageAttributes: PageAttrModel = { ...PAGE_ATTR_DATA };

  subscriptionArray: Subscription[] = [];

  hasResult = false;

  constructor(
    public dialog: MatDialog,
    private agreementService: AgreementService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    const subjectSubs = this.agreementService.vehicleExpUpdated$.subscribe(
      (update) => {
        if (update) {
          this.searchNow();
        }
      }
    );

    this.subscriptionArray.push(subjectSubs);

    this.displayedColumns = [
      'driver_name_details',
      'vehicle_number_details',
      'location_details',
      'date',
      'fuel_details',
      'unit_price',
      'quantity',
      'total_amount',
      'narration',
      'action',
    ];

    this.searchNow();
  }

  // OPERATIONS
  editFuelExpense(ID: number): void {
    console.log(ID);
  }

  deleteFuelExpense(ID: number): void {
    console.log(ID);
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
    this.searchNow();
  }

  searchNow(): void {
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

    // if (
    //   this.employeeFilterForm.value.agreement &&
    //   this.employeeFilterForm.value.agreement.id
    // ) {
    //   paramList.push(`agreement=${this.employeeFilterForm.value.agreement.id}`);
    // }

    // if (
    //   this.employeeFilterForm.value.employee &&
    //   this.employeeFilterForm.value.employee.id
    // ) {
    //   paramList.push(`name=${this.employeeFilterForm.value.employee.id}`);
    // }

    // if (
    //   this.employeeFilterForm.value.workType &&
    //   this.employeeFilterForm.value.workType.id
    // ) {
    //   paramList.push(`work_type=${this.employeeFilterForm.value.workType.id}`);
    // }

    // if (this.employeeFilterForm.value.startDate) {
    //   paramList.push(
    //     `from_date=${moment(this.employeeFilterForm.value.startDate).format(
    //       'YYYY-MM-DD'
    //     )}`
    //   );
    // }

    // if (this.employeeFilterForm.value.endDate) {
    //   paramList.push(
    //     `to_date=${moment(this.employeeFilterForm.value.endDate).format(
    //       'YYYY-MM-DD'
    //     )}`
    //   );
    // }

    if (paramList.length > 0) {
      paramList.map((par) => {
        paramUrl = paramUrl + par + '&';
      });
    }

    this.loaderService.show();
    this.agreementService
      .getFuelExpenses(`?` + paramUrl.slice(0, -1))
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.dataSource = data.results;
          console.log('=============>>', this.dataSource);

          this.hasResult = data.results.length > 0 ? true : false;
          if (data.count) this.pageAttributes.totalRecord = data.count;
        }
      });
  }
}
