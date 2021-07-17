import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AgreementListModel,
  AgreementRequestModel,
  API_END_POINT,
  EmployeeExpenseRequestModel,
  ValidateAgreementResponseModel,
} from 'src/app/core';

@Injectable({
  providedIn: 'root',
})
export class AgreementService {
  constructor(private http: HttpClient) {}

  postAgreement(request: AgreementRequestModel): Observable<any> {
    return this.http.post<AgreementRequestModel>(
      API_END_POINT.agreement.data_operations,
      request
    );
  }

  postVehicleExpense(request: any): Observable<any> {
    return this.http.post<any>(
      API_END_POINT.agreement.vehicle_expense,
      request
    );
  }

  postEmployeeExpense(request: any): Observable<any> {
    return this.http.post<any>(
      API_END_POINT.agreement.employee_expense,
      request
    );
  }

  validateAgreement(agreementNumber: string): Observable<ValidateAgreementResponseModel> {
    return this.http.get<ValidateAgreementResponseModel>(
      API_END_POINT.agreement.validate_item + agreementNumber
    );
  }

  getAgreements(): Observable<AgreementListModel> {
    return this.http.get<AgreementListModel>(
      API_END_POINT.agreement.data_operations
    );
  }

  getEmpExpense(): Observable<any> {
    return this.http.get<any>(
      'http://18.118.104.163:8000/api/employees-expenses/'
    );
  }

  getVehicleExpense(): Observable<any> {
    return this.http.get<any>(
      'http://18.118.104.163:8000/api/vehicle-expenses/'
    );
  }
}
