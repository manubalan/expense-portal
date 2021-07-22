import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  AgreementListResponseModel,
  AgreementListResultModel,
  AgreementRequestModel,
  API_END_POINT,
  EmployeeExpenseListResultModel,
  EmployeeExpenseRequestModel,
  EmployeeExpenseResponseModel,
  ValidateAgreementResponseModel,
  VehicleExpenseListResultModel,
  VehicleExpenseResponseModel,
} from 'src/app/core';

@Injectable({
  providedIn: 'root',
})
export class AgreementService {
  agreementUpdated$ = new Subject<boolean>();
  vehicleExpUpdated$ = new Subject<boolean>();
  employExpUpdated$ = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  // Agreement API functions
  postAgreement(
    request: AgreementRequestModel,
    editMode = false,
    ID?: number
  ): Observable<any> {
    if (editMode && ID && ID > 0) {
      return this.http.put<AgreementRequestModel>(
        `${API_END_POINT.agreement.data_operations}${ID}/`,
        request
      );
    } else {
      return this.http.post<AgreementRequestModel>(
        API_END_POINT.agreement.data_operations,
        request
      );
    }
  }

  validateAgreement(
    agreementNumber: string
  ): Observable<ValidateAgreementResponseModel> {
    return this.http.get<ValidateAgreementResponseModel>(
      API_END_POINT.agreement.validate_item + agreementNumber
    );
  }

  getAgreements(): Observable<AgreementListResponseModel> {
    return this.http.get<AgreementListResponseModel>(
      API_END_POINT.agreement.data_operations
    );
  }

  getAgreementID(ID: number): Observable<AgreementListResultModel> {
    return this.http.get<AgreementListResultModel>(
      `${API_END_POINT.agreement.data_operations}${ID}`
    );
  }

  deleteAgreement(ID: number): Observable<any> {
    return this.http.delete(`${API_END_POINT.agreement.data_operations}${ID}`);
  }

  // Vehicle Expense API functions
  postVehicleExpense(
    request: any,
    editMode = false,
    ID?: number
  ): Observable<any> {
    if (editMode && ID && ID > 0) {
      return this.http.put<any>(
        `${API_END_POINT.agreement.vehicle_expense}${ID}/`,
        request
      );
    } else {
      return this.http.post<any>(
        API_END_POINT.agreement.vehicle_expense,
        request
      );
    }
  }

  getVehicleExpense(): Observable<VehicleExpenseResponseModel> {
    return this.http.get<VehicleExpenseResponseModel>(
      API_END_POINT.agreement.vehicle_expense
    );
  }

  getVehicleExpenseID(ID: number): Observable<VehicleExpenseListResultModel> {
    return this.http.get<VehicleExpenseListResultModel>(
      `${API_END_POINT.agreement.vehicle_expense}${ID}`
    );
  }

  deleteVehicleExp(ID: number): Observable<any> {
    return this.http.delete(`${API_END_POINT.agreement.vehicle_expense}${ID}`);
  }

  // Employee Expense API functions
  postEmployeeExpense(
    request: any,
    editMode = false,
    ID?: number
  ): Observable<any> {
    if (editMode && ID && ID > 0) {
      return this.http.put<any>(
        `${API_END_POINT.agreement.employee_expense}${ID}/`,
        request
      );
    } else {
      return this.http.post<any>(
        API_END_POINT.agreement.employee_expense,
        request
      );
    }
  }

  getEmpExpense(): Observable<EmployeeExpenseResponseModel> {
    return this.http.get<EmployeeExpenseResponseModel>(
      'http://18.118.104.163:8000/api/employees-expenses/'
    );
  }

  getEmpExpenseID(ID: number): Observable<EmployeeExpenseListResultModel> {
    return this.http.get<EmployeeExpenseListResultModel>(
      `${API_END_POINT.agreement.employee_expense}${ID}`
    );
  }

  deleteEmployeeExp(ID: number): Observable<any> {
    return this.http.delete(`${API_END_POINT.agreement.employee_expense}${ID}`);
  }
}
