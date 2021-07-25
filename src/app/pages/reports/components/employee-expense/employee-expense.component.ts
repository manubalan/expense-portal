import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.services';

@Component({
  selector: 'ems-employee-expense',
  templateUrl: './employee-expense.component.html',
  styleUrls: ['./employee-expense.component.scss'],
})
export class EmployeeExpenseComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource: any;

  constructor(private resportService: ReportService) {}

  ngOnInit(): void {
    this.displayedColumns = ['id', 'agreement', 'name', 'kooli_paid'];

    this.resportService.getEmployeeReport().subscribe((data) => {
      if (data) {
        this.dataSource = data.results;
      }
    });
  }
}
