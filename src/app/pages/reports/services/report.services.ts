import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { API_END_POINT } from 'src/app/core';
import { GetResponseModel } from 'src/app/core/models/report-data.model';

@Injectable()
export class ReportService {
  currentDate = new Date();
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

  getFuelExpenseReport(params?: string): Observable<GetResponseModel> {
    return this.http.get<GetResponseModel>(
      API_END_POINT.reports.fuel_expense + (params ? params : '')
    );
  }

  getJcbExpenseReport(params?: string): Observable<GetResponseModel> {
    return this.http.get<GetResponseModel>(
      API_END_POINT.reports.jcbl_expense + (params ? params : '')
    );
  }

  downloadReports(
    type:
      | 'driver'
      | 'employee'
      | 'employee_wise'
      | 'material'
      | 'vehicle'
      | 'fuel'
      | 'jcb',
    params?: string
  ): void {
    let download = '';
    let endPoint = '';
    switch (type) {
      case 'driver':
        download = 'DriverExpenses';
        endPoint = API_END_POINT.reports.driver_expense;
        break;
      case 'employee':
        download = 'EmployeeExpenses';
        endPoint = API_END_POINT.reports.employee_wise_expense;
        break;
      case 'employee_wise':
        download = 'EmployeeExpensesDateWise';
        endPoint = API_END_POINT.reports.employee_expense;
        break;
      case 'material':
        download = 'MaterialExpense';
        endPoint = API_END_POINT.reports.vehicle_expense;
        break;
      case 'vehicle':
        download = 'VehicleExpense';
        endPoint = API_END_POINT.reports.vehicle_expense;
        break;
      case 'fuel':
        download = 'FuelExpense';
        endPoint = API_END_POINT.reports.fuel_expense;
        break;
      case 'jcb':
        debugger;
        download = 'JcbExpense';
        endPoint = API_END_POINT.reports.jcbl_expense;
        break;
    }

    const URL = `${endPoint}/?${
      params ? `${params}&` : ''
    }download=true&report_name=${download}`;

    this.downloadFile(
      URL,
      `${download}_${moment(this.currentDate).format('DD-MM-YYYY_h-mm-ss')}`
    );
  }

  downloadFile(baseUrl: string, filename: string): void {
    this.http
      .get(baseUrl, { responseType: 'blob' as 'json' })
      .subscribe((response: any) => {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(
          new Blob(binaryData, { type: dataType })
        );
        if (filename) downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
  }
}
