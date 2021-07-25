import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.services';

@Component({
  selector: 'ems-driver-expense',
  templateUrl: './driver-expense.component.html',
  styleUrls: ['./driver-expense.component.scss']
})
export class DriverExpenseComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource: any;

  constructor(private resportService: ReportService) {}

  ngOnInit(): void {
    this.displayedColumns = ['driver_name__name', 'betha', 'betha_paid'];

    this.resportService.getDriverReport().subscribe((data) => {
      if (data) {
        this.dataSource = data.results;
      }
    });
  }

}
