import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_END_POINT } from 'src/app/core';
import { GetResponseModel } from 'src/app/core/models/report-data.model';

@Injectable()
export class ReportService {
  constructor(private http: HttpClient) {}

  getEmployeeReport(params?: string): Observable<GetResponseModel> {
    return this.http.get<GetResponseModel>(
      API_END_POINT.reports.employee_expense + (params ? params : '')
    );
  }

  getEmployeeWiseReport(params?: string): Observable<GetResponseModel> {
    return this.http.get<GetResponseModel>(
      API_END_POINT.reports.employee_wise_expense + (params ? params : '')
    );
  }

  getVehicleReport(params?: string): Observable<GetResponseModel> {
    return this.http.get<GetResponseModel>(
      API_END_POINT.reports.vehicle_expense + (params ? params : '')
    );
  }

  getDriverReport(params?: string): Observable<GetResponseModel> {
    return this.http.get<GetResponseModel>(
      API_END_POINT.reports.driver_expense + (params ? params : '')
    );
  }

  downloadReports(
    type: 'driver' | 'employee' | 'employee_wise' | 'material' | 'vehicle'
  ): Observable<any> {
    let download = '';
    let endPoint = '';
    switch (type) {
      case 'driver':
        download = 'DriverExpenses';
        endPoint = API_END_POINT.reports.driver_expense;
        break;
      case 'employee':
        download = 'EmployeeExpenses';
        endPoint = API_END_POINT.reports.employee_expense;
        break;
      case 'employee_wise':
        download = 'EmployeeExpensesDateWise';
        endPoint = API_END_POINT.reports.employee_wise_expense;
        break;
      case 'material':
        download = 'MaterialExpense';
        endPoint = API_END_POINT.reports.vehicle_expense;
        break;
      case 'vehicle':
        download = 'VehicleExpense';
        endPoint = API_END_POINT.reports.vehicle_expense;
        break;
    }

    return this.http
      .get<any>(`${endPoint}?download=true&report_name=${download}`)
      .pipe(catchError(async (err) => console.log(err)));
  }
}
