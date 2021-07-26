import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/shared';
import { ReportService } from '../../services/report.services';

@Component({
  selector: 'ems-vehicle-expense',
  templateUrl: './vehicle-expense.component.html',
})
export class VehicleExpenseComponent implements OnInit {
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
      'materials_details',
      'qty_type',
      'quantity',
      'amount',
      'amount_paid',
      'driver_name',
      'betha',
      'betha_paid',
      'vehicle_type_details',
      'vehicle_details',
      'vechicle_charge',
      'total_amount',
    ];
    this.loaderService.show();
    this.resportService.getVehicleReport().subscribe((data) => {
      this.loaderService.hide();
      if (data) {
        this.dataSource = data.results;
      }
    });
  }
}
