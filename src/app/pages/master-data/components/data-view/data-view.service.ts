import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MasterDataResponseModel } from 'src/app/core';
import { endPoints } from 'src/environments/environment';

@Injectable()
export class MasterDataViewService {
    baseUrl = endPoints.master_data_EndPoint
  constructor(private http: HttpClient) {}

    public getGridData(endPoint: string): Observable<MasterDataResponseModel> {
      return this.http.get<MasterDataResponseModel>(`${this.baseUrl}${endPoint}`);
    }
    
    public validateFieldData(endPoint: string, name: string): Observable<any> {
        return this.http.get(`${this.baseUrl}${endPoint}/validate/?name=${name}`);
    }

    public addMasterData(endPoint: string, name: string): Observable<any> {
        return this.http.post(`${this.baseUrl}${endPoint}`, name);
    }

    // public updatedMasterData(endPoint: string, name: string): Observable<any> {
    //     return this.http.put(`${this.baseUrl}${endPoint}`, name);
    // }

    // public deleteMasterData(endPoint: string, name: string): Observable<any> {
    //     return this.http.delete(`${this.baseUrl}${endPoint}`, name);
    // }
}
