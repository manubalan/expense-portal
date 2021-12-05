import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MasterDataResponseModel, UpdateDataModel, ValidateModel } from 'src/app/core';
import { endPoints } from 'src/environments/environment';

@Injectable()
export class MasterDataViewService {
  baseUrl = endPoints.master_data_EndPoint;
  constructor(private http: HttpClient) {}

  public getGridData(endPoint: string): Observable<MasterDataResponseModel> {
    return this.http.get<MasterDataResponseModel>(`${this.baseUrl}${endPoint}`);
  }

  public getFieldData(endPoint: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${endPoint}`);
  }

  public validateFieldData(
    endPoint: string,
    name: string
  ): Observable<ValidateModel> {
    return this.http.get<ValidateModel>(
      `${this.baseUrl}${endPoint}/validate/?name=${name}`
    );
  }

  public addMasterData(
    endPoint: string,
    request: Object,
    update: UpdateDataModel
  ): Observable<any> {
    if (update.active) return this.http.put(`${this.baseUrl}${endPoint}/${update.selected}/`, request);
    else return this.http.post(`${this.baseUrl}${endPoint}/`, request);
  }

  public deleteMasterData(endPoint: string, element: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}${endPoint}/${element}/`);
  }
}
