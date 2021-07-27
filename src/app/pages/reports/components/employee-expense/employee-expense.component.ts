import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AgreementService } from 'src/app/pages/agreement/services';
import { LoaderService } from 'src/app/shared';
import { ReportService } from '../../services/report.services';

@Component({
  selector: 'ems-employee-expense',
  templateUrl: './employee-expense.component.html',
  host: {
    class: 'full-width-card full-card',
  },
})
export class EmployeeExpenseComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [];
  displayedColumnsWise: string[] = [];
  employeeData: any;
  employeeWiseData: any;
  agreementWiseFilter: FormGroup;
  agreementList: any[];
  agreementDispaly: any[];

  subscriptionArray: Subscription[] = [];

  constructor(
    private resportService: ReportService,
    private loaderService: LoaderService,
    private fbuilder: FormBuilder,
    private agreementService: AgreementService
  ) {
    this.agreementList = [];
    this.agreementDispaly = [];
    this.getAgreementList();
    this.agreementWiseFilter = this.fbuilder.group({
      agreement: new FormControl(''),
      search: new FormControl(''),
    });

    const detectSubs = this.agreementWiseFilter
      .get('agreement')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (
          value &&
          value !== null &&
          typeof value === 'string' &&
          this.agreementList.length > 0
        ) {
          this.agreementDispaly = this.agreementList.filter((el) =>
            el.agreement_number.toLowerCase().includes(value.toLowerCase())
          );
        }
      });

    if (detectSubs) this.subscriptionArray.push(detectSubs);
  }
  ngOnInit(): void {
    this.displayedColumnsWise = ['name__name', 'kooli', 'kooli_paid'];

    this.displayedColumns = [
      'id',
      'created_on',
      'updated_on',
      'agreement',
      'name',
      'day',
      'work_type_details',
    ];
    this.loaderService.show();
    this.resportService.getEmployeeReport().subscribe((data) => {
      this.loaderService.hide();
      if (data) {
        this.employeeData = data.results;
      }
    });

    this.loaderService.show();
    this.resportService.getEmployeeWiseReport().subscribe((data) => {
      this.loaderService.hide();
      if (data) {
        this.employeeWiseData = data.results;
      }
    });
  }

  getAgreementList(): void {
    this.agreementService.getAgreements().subscribe((data) => {
      if (data && data.results) {
        this.agreementList = data.results;
        if (this.agreementList.length > 0)
          this.agreementDispaly = this.agreementList;
      }
    });
  }

  searchNow(): void {

  }

  ngOnDestroy(): void {
    if (this.subscriptionArray.length > 0) {
      this.subscriptionArray.map((subs) => subs.unsubscribe());
    }
  }
}
