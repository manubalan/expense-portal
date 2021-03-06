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
  FuelExpenseResponseModel,
  JCBExpenseResponseModel,
  JCBExpenseResultModel,
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
  fuelExpUpdated$ = new Subject<boolean>();
jcbExpUpdated$ = new Subject<boolean>();

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

  getAgreements(param?: string): Observable<AgreementListResponseModel> {
    return this.http.get<AgreementListResponseModel>(
      `${API_END_POINT.agreement.data_operations}${
        param !== undefined ? param : ''
      }`
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

  getVehicleExpense(param?: string): Observable<VehicleExpenseResponseModel> {
    return this.http.get<VehicleExpenseResponseModel>(
      `${API_END_POINT.agreement.vehicle_expense}${
        param !== undefined ? param : ''
      }`
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

  getEmpExpense(param?: string): Observable<EmployeeExpenseResponseModel> {
    return this.http.get<EmployeeExpenseResponseModel>(
      `${API_END_POINT.agreement.employee_expense}${
        param !== undefined ? param : ''
      }`
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

  // FUEL Expenses
  postFuelExpense(
    request: any,
    editMode = false,
    ID?: number
  ): Observable<any> {
    if (editMode && ID && ID > 0) {
      return this.http.put<any>(
        `${API_END_POINT.agreement.fuel_expense}${ID}/`,
        request
      );
    } else {
      return this.http.post<any>(
        API_END_POINT.agreement.fuel_expense,
        request
      );
    }
  }

  getFuelExpenses(param?: string): Observable<EmployeeExpenseResponseModel> {
    return this.http.get<EmployeeExpenseResponseModel>(
      `${API_END_POINT.agreement.fuel_expense}${
        param !== undefined ? param : ''
      }`
    );
  }

  getFuelExpenseID(ID: number): Observable<FuelExpenseResponseModel> {
    return this.http.get<FuelExpenseResponseModel>(
      `${API_END_POINT.agreement.fuel_expense}${ID}`
    );
  }

  deleteFuelExpense(ID: number): Observable<any> {
    return this.http.delete(`${API_END_POINT.agreement.fuel_expense}${ID}`);
  }

    // JCB Expenses
    postJcblExpense(
      request: any,
      editMode = false,
      ID?: number
    ): Observable<any> {
      if (editMode && ID && ID > 0) {
        return this.http.put<any>(
          `${API_END_POINT.agreement.jcb_expense}${ID}/`,
          request
        );
      } else {
        return this.http.post<any>(
          API_END_POINT.agreement.jcb_expense,
          request
        );
      }
    }

    getJcbExpenses(param?: string): Observable<JCBExpenseResponseModel> {
      return this.http.get<JCBExpenseResponseModel>(
        `${API_END_POINT.agreement.jcb_expense}${
          param !== undefined ? param : ''
        }`
      );
    }

    getJcbExpenseID(ID: number): Observable<JCBExpenseResultModel> {
      return this.http.get<JCBExpenseResultModel>(
        `${API_END_POINT.agreement.jcb_expense}${ID}`
      );
    }

    deleteJcbExpense(ID: number): Observable<any> {
      return this.http.delete(`${API_END_POINT.agreement.jcb_expense}${ID}`);
    }
}
