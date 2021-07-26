import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/shared';
import { ReportService } from '../../services/report.services';

@Component({
  selector: 'ems-driver-expense',
  templateUrl: './driver-expense.component.html',
})
export class DriverExpenseComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource: any;

  constructor(
    private resportService: ReportService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.displayedColumns = ['driver_name__name', 'betha', 'betha_paid'];
    this.loaderService.show();
    this.resportService.getDriverReport().subscribe((data) => {
      this.loaderService.hide();
      if (data) {
        this.dataSource = data.results;
      }
    });
  }
}
