import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/shared';
import { ReportService } from '../../services/report.services';

@Component({
  selector: 'ems-employee-expense',
  templateUrl: './employee-expense.component.html',
})
export class EmployeeExpenseComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource: any;
  constructor(
    private resportService: ReportService,
    private loaderService: LoaderService
  ) {}
  ngOnInit(): void {
    this.displayedColumns = [
      'id',
      'agreement',
      'name',
      'work_type_details',
      'day',
      'work_date',
      'kooli',
      'kooli_paid',
      'paid_date',
    ];
    this.loaderService.show();
    this.resportService.getEmployeeReport().subscribe((data) => {
      this.loaderService.hide();
      if (data) {
        this.dataSource = data.results;
      }
    });
  }
}
