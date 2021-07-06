import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AgreementRequestModel, API_END_POINT } from 'src/app/core';

@Injectable({
  providedIn: 'root',
})
export class AgreementService {
  constructor(private http: HttpClient) {}

  postAgreement(request: AgreementRequestModel): Observable<any> {
    console.log('=====',  API_END_POINT.agreement.data_operations);
    return this.http.post<AgreementRequestModel>(API_END_POINT.agreement.data_operations, request);
  }
}
