import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MasterDataService } from 'src/app/core';
import { AgreementService } from 'src/app/pages/agreement/services';
import { LoaderService } from 'src/app/shared';
import { ReportService } from '../../services/report.services';

@Component({
  selector: 'ems-driver-wise-expense',
  templateUrl: './driver-wise-expense.component.html',
})
export class DriverWiseExpenseComponent implements OnInit {
  displayedColumns: string[] = [];
  driverReports: any;
  driverFilterForm: FormGroup;

  agreementList: any[] = [];
  driverList: any[] = [];

  subscriptionArray: Subscription[] = [];

  constructor(
    private resportService: ReportService,
    private loaderService: LoaderService,
    private fbuilder: FormBuilder,
    private agreementService: AgreementService,
    private masterService: MasterDataService
  ) {
    this.driverFilterForm = this.fbuilder.group({
      agreement: new FormControl(''),
      driverName: new FormControl(''),
      search: new FormControl(''),
    });

    this.getAgreementList();
    this.getDriverList();
    this.detectFilterForms();
  }

  ngOnInit(): void {
    this.displayedColumns = [
      'driver_name__name',
      'betha',
      'betha_paid'
    ];

    this.loaderService.show();
    this.resportService.getDriverReport().subscribe((data) => {
      this.loaderService.hide();
      if (data) {
        this.driverReports = data.results;
      }
    });
  }

  detectFilterForms(): void {
    const detectSubs = this.driverFilterForm
      .get('agreement')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (value && value !== null && typeof value === 'string') {
          this.getAgreementList(value);
        }
      });
    if (detectSubs) this.subscriptionArray.push(detectSubs);

    const empSubs = this.driverFilterForm
      .get('driverName')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (value && value !== null && typeof value === 'string') {
          this.getDriverList(value);
        }
      });
    if (empSubs) this.subscriptionArray.push(empSubs);
  }

  getAgreementList(search?: string): void {
    const agreementSubs = this.agreementService
      .getAgreements(
        search !== null && search !== undefined
          ? `?search=${search}`
          : undefined
      )
      .subscribe((data) => {
        if (data && data.results) {
          this.agreementList = data.results;
        }
      });

    this.subscriptionArray.push(agreementSubs);
  }

  getDriverList(search?: string): void {
    const empSubs = this.masterService
      .getEmployeesList(
        search !== null && search !== undefined
          ? `?search=${search}`
          : undefined
      )
      .subscribe((data) => {
        if (data && data.results) {
          this.driverList = data.results;
        }
      });
    this.subscriptionArray.push(empSubs);
  }

  searchNow(): void {
    const paramList = [];
    let paramUrl = '';
    if (this.driverFilterForm.value.agreement) {
      paramList.push(`agreement_id=${this.driverFilterForm.value.agreement}`);
    }
    if (this.driverFilterForm.value.driverName) {
      paramList.push(`employee_id=${this.driverFilterForm.value.driverName}`);
    }
    if (this.driverFilterForm.value.search) {
      paramList.push(`search=${this.driverFilterForm.value.search}`);
    }

    if (paramList.length > 0) {
      paramList.map((par) => {
        paramUrl = paramUrl + par + '&';
      });
    }

    this.loaderService.show();
    this.resportService
      .getDriverReport(`?` + paramUrl.slice(0, -1))
      .subscribe((data) => {
        this.loaderService.hide();
        if (data) {
          this.driverReports = data.results;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subscriptionArray.length > 0) {
      this.subscriptionArray.map((subs) => subs.unsubscribe());
    }
  }

}
