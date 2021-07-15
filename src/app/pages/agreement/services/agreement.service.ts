import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AgreementListModel,
  AgreementRequestModel,
  API_END_POINT,
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

  getAgreements(): Observable<AgreementListModel> {
    return this.http.get<AgreementListModel>(
      API_END_POINT.agreement.data_operations
    );
  }
}
