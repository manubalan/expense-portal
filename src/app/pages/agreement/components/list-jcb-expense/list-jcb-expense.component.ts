import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  PageAttrModel,
  PAGE_ATTR_DATA,
  MasterDataService,
  PageAttrEventModel,
  JCBExpenseResultModel,
} from 'src/app/core';
import {
  LoaderService,
  DialogBoxService,
  SnackBarService,
} from 'src/app/shared';
import { AddJcbExpenseComponent } from '..';
import { AgreementService } from '../../services';

@Component({
  selector: 'ems-list-jcb-expense',
  templateUrl: './list-jcb-expense.component.html',
})
export class ListJcbExpenseComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource: JCBExpenseResultModel[] = [];
  pageAttributes: PageAttrModel = { ...PAGE_ATTR_DATA };

  subscriptionArray: Subscription[] = [];
  jcbFilterForm: FormGroup;
  hasResult = false;

  operatorList: any[] = [];
  locationList: any[] = [];
  agreementList: any[] = [];

  constructor(
    public dialog: MatDialog,
    private agreementService: AgreementService,
    private loaderService: LoaderService,
    private dialogeService: DialogBoxService,
    private snackBarService: SnackBarService,
    private fBuilder: FormBuilder,
    private masterDataService: MasterDataService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.jcbFilterForm = this.fBuilder.group({
      agreement: new FormControl(null),
      search: new FormControl(null),
      location: new FormControl(null),
      operator: new FormControl(null),
      from_date: new FormControl(null),
      to_date: new FormControl(null),
    });

    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    const subjectSubs = this.agreementService.jcbExpUpdated$.subscribe(
      (update) => {
        if (update) {
          this.searchNow();
        }
      }
    );

    this.subscriptionArray.push(subjectSubs);

    this.displayedColumns = [
      'date',
      'name',
      'location',
      'starting_reading',
      'closing_reading',
      'hours',
      'amount',
      'bata',
      'total_amount',
      'grant_total',
      'action',
    ];
    this.setMasterData();
    this.searchNow();
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

  // FILTER Area
  public employeeOptionView(option: any): string {
    return option ? option.name : '';
  }

  setMasterData(): void {
    this.setLocationList();
    this.setAgreementList();
    this.setOperatorList();
    this.detectFilterForms();
  }

  setLocationList(search?: string): void {
    this.loaderService.show();
    const vehicleSubs = this.masterDataService
      .getLocationsList(
        0,
        search !== undefined && search !== null ? 'search=' + search : ''
      )
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.locationList = data.results;
        }
      });

    this.subscriptionArray.push(vehicleSubs);
  }

  setAgreementList(search?: string): void {
    this.loaderService.show();
    this.agreementList = [];
    const agreementSubs = this.agreementService
      .getAgreements(
        search !== undefined && search !== null ? '?search=' + search : ''
      )
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.agreementList = data.results;
        }
      });

    this.subscriptionArray.push(agreementSubs);
  }

  setOperatorList(search?: string): void {
    this.loaderService.show();
    const employSubs = this.masterDataService
      .getEmployeesList(
        search !== undefined && search !== null ? '?search=' + search : ''
      )
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.operatorList = data.results;
        }
      });

    this.subscriptionArray.push(employSubs);
  }

  detectFilterForms(): void {
    const detectSubs = this.jcbFilterForm
      .get('operator')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.setOperatorList(value);
      });
    if (detectSubs) this.subscriptionArray.push(detectSubs);

    const empSubs = this.jcbFilterForm
      .get('location')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.setLocationList(value);
      });
    if (empSubs) this.subscriptionArray.push(empSubs);

    const workSubs = this.jcbFilterForm
      .get('agreement')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.setAgreementList(value);
      });
    if (workSubs) this.subscriptionArray.push(workSubs);
  }

  searchNow(): void {
    const paramList = [];
    let paramUrl = '';
    if (
      this.jcbFilterForm.value.agreement &&
      this.jcbFilterForm.value.agreement.id
    ) {
      paramList.push(`agreement=${this.jcbFilterForm.value.agreement.id}`);
    }

    if (this.jcbFilterForm.value.search && this.jcbFilterForm.value.search) {
      paramList.push(`search=${this.jcbFilterForm.value.search}`);
    }

    if (
      this.jcbFilterForm.value.operator &&
      this.jcbFilterForm.value.operator.id
    ) {
      paramList.push(`operator=${this.jcbFilterForm.value.operator.id}`);
    }

    if (
      this.jcbFilterForm.value.location &&
      this.jcbFilterForm.value.location.id
    ) {
      paramList.push(`location=${this.jcbFilterForm.value.location.id}`);
    }

    if (this.jcbFilterForm.value.from_date) {
      paramList.push(
        `from_date=${moment(this.jcbFilterForm.value.from_date).format(
          'YYYY-MM-DD'
        )}`
      );
    }

    if (this.jcbFilterForm.value.to_date) {
      paramList.push(
        `to_date=${moment(this.jcbFilterForm.value.to_date).format(
          'YYYY-MM-DD'
        )}`
      );
    }

    // PAGINATION
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
    this.agreementService
      .getJcbExpenses(`?` + paramUrl.slice(0, -1))
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.dataSource = data.results;
          this.hasResult = data.results.length > 0 ? true : false;
          if (data.count) this.pageAttributes.totalRecord = data.count;
        }
      });
  }

  resetSearch(): void {
    this.jcbFilterForm.reset();
    this.pageAttributes.pageSize = this.pageAttributes.pageSizeOpt[0];
    this.pageAttributes.currentPage = 0;
    this.searchNow();
  }

  // OPERATIONS
  editJcbExpense(ID: number): void {
    const instance = this.dialog.open(AddJcbExpenseComponent).componentInstance;
    instance.editMode = {
      isActive: true,
      fuelExpenseID: ID,
    };
  }

  deleteFuelExpense(ID: number): void {
    const ref = this.dialogeService.openDialog('Are sure want to delete ?');
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loaderService.show();
        const deletSubs = this.agreementService
          .deleteJcbExpense(ID)
          .subscribe(() => {
            this.agreementService.jcbExpUpdated$.next(true);
            this.snackBarService.success(
              'Agreement removed Successfully ! ',
              'Done'
            );
            this.loaderService.hide();
          });

        this.subscriptionArray.push(deletSubs);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptionArray.length > 0) {
      this.subscriptionArray.map((sub) => sub.unsubscribe());
    }
  }
}
