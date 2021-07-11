import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_END_POINT, MasterDataModel } from 'src/app/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MasterDataService {
  constructor(private http: HttpClient) {}

  getStateList(): Observable<MasterDataModel> {
    return this.http.get<MasterDataModel>(API_END_POINT.masterData.states);
  }

  getDistrictsList(params?: number): Observable<MasterDataModel> {
    return this.http.get<MasterDataModel>(
      params
        ? `${API_END_POINT.masterData.district_params}${params}`
        : API_END_POINT.masterData.district
    );
  }

  getLocationsList(params?: number): Observable<MasterDataModel> {
    return this.http.get<MasterDataModel>(
      params
        ? `${API_END_POINT.masterData.location_params}${params}`
        : API_END_POINT.masterData.location
    );
  }


  getVehicletypesList(params?: number): Observable<MasterDataModel> {
    return this.http.get<MasterDataModel>(
      params
        ? `${API_END_POINT.masterData.vehicle_type_params}${params}`
        : API_END_POINT.masterData.vehicle_type
    );
  }

  getMaterialsList(params?: number): Observable<MasterDataModel> {
    return this.http.get<MasterDataModel>(
      params
        ? `${API_END_POINT.masterData.materials_params}${params}`
        : API_END_POINT.masterData.materials
    );
  }

  getEmployeesList(params?: number): Observable<MasterDataModel> {
    return this.http.get<MasterDataModel>(
      params
        ? `${API_END_POINT.masterData.employees_params}${params}`
        : API_END_POINT.masterData.employees
    );
  }

  getWorktypesList(params?: number): Observable<MasterDataModel> {
    return this.http.get<MasterDataModel>(
      params
        ? `${API_END_POINT.masterData.worktypes_params}${params}`
        : API_END_POINT.masterData.worktypes
    );
  }
}