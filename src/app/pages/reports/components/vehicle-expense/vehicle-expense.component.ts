import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.services';

@Component({
  selector: 'ems-vehicle-expense',
  templateUrl: './vehicle-expense.component.html',
  styleUrls: ['./vehicle-expense.component.scss']
})
export class VehicleExpenseComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource: any;

  constructor(private resportService: ReportService) {}

  ngOnInit(): void {
    this.displayedColumns = ['id', 'agreement'];

    this.resportService.getVehicleReport().subscribe((data) => {
      if (data) {
        this.dataSource = data.results;
      }
    });
  }

}
