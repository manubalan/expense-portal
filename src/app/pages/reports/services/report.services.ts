import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_END_POINT } from 'src/app/core';
import { GetResponseModel } from 'src/app/core/models/report-data.model';

@Injectable()
export class ReportService {
  constructor(private http: HttpClient) {}

  getEmployeeReport(): Observable<GetResponseModel> {
    return this.http.get<GetResponseModel>(
      API_END_POINT.reports.employee_expense
    );
  }

  getVehicleReport(): Observable<GetResponseModel> {
    return this.http.get<GetResponseModel>(
      API_END_POINT.reports.vehicle_expense
    );
  }

  getDriverReport(): Observable<GetResponseModel> {
    return this.http.get<GetResponseModel>(
      API_END_POINT.reports.driver_expense
    );
  }
}