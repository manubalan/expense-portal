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
} from 'src/app/core';
import { AgreementService } from 'src/app/pages/agreement/services';
import {
  LoaderService,
  DialogBoxService,
} from 'src/app/shared';
import { ReportService } from '../../services/report.services';

@Component({
  selector: 'ems-jcb-expense',
  templateUrl: './jcb-expense.component.html',
})
export class JcbExpenseComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource: any[] = [];
  pageAttributes: PageAttrModel = { ...PAGE_ATTR_DATA };

  subscriptionArray: Subscription[] = [];
  jcbFilterForm: FormGroup;
  hasResult = false;

  operatorList: any[] = [];
  locationList: any[] = [];
  agreementList: any[] = [];

  filterCriteria = '';

  constructor(
    public dialog: MatDialog,
    private agreementService: AgreementService,
    private resportService: ReportService,
    private loaderService: LoaderService,
    private fBuilder: FormBuilder,
    private masterDataService: MasterDataService,
    private dateAdapter: DateAdapter<Date>,
    private dialogeService: DialogBoxService,
  ) {
    this.jcbFilterForm = this.fBuilder.group({
      date: new FormControl(null),
      operator: new FormControl(null),
      location: new FormControl(null),
      agreement: new FormControl(null),
    });

    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
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
    if (this.jcbFilterForm.value.date) {
      paramList.push(
        `date=${moment(this.jcbFilterForm.value.date).format('YYYY-MM-DD')}`
      );
    }

    if (
      this.jcbFilterForm.value.operator &&
      this.jcbFilterForm.value.operator.id
    ) {
      paramList.push(`operator_name=${this.jcbFilterForm.value.operator.id}`);
    }

    if (
      this.jcbFilterForm.value.location &&
      this.jcbFilterForm.value.location.id
    ) {
      paramList.push(`location=${this.jcbFilterForm.value.location.id}`);
    }

    if (
      this.jcbFilterForm.value.agreement &&
      this.jcbFilterForm.value.agreement.id
    ) {
      paramList.push(`agreement=${this.jcbFilterForm.value.agreement.id}`);
    }

    if (paramList.length > 0) {
      paramList.map((par) => {
        this.filterCriteria = this.filterCriteria + par + '&';
      });
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
    this.resportService
      .getJcbExpenseReport(`?` + paramUrl.slice(0, -1))
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

  downloadNow(): void {
    const ref = this.dialogeService.openDialog('Are sure want to Download ?');
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.resportService.downloadReports(
          'jcb',
          this.filterCriteria.slice(0, -1)
        );

        this.filterCriteria = '';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptionArray.length > 0) {
      this.subscriptionArray.map((sub) => sub.unsubscribe());
    }
  }
}
