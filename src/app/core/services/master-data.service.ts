import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_END_POINT } from '../constants/endpoint.constants';
import { MasterDataModel } from '../models/master-data.model';

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

  getLocationsList(params?: number, search?: string): Observable<MasterDataModel> {
    return this.http.get<MasterDataModel>(
      params
        ? `${API_END_POINT.masterData.location_params}${params !== 0 ? params : ''}`
        : `${API_END_POINT.masterData.location}${search !== null && search !== undefined ? search : ''}`
    );
  }

  getVehicletypesList(params?: string): Observable<MasterDataModel> {
    return this.http.get<MasterDataModel>(
      params
        ? `${API_END_POINT.masterData.vehicle_type}${params}`
        : API_END_POINT.masterData.vehicle_type
    );
  }

  getMaterialsList(params?: string): Observable<MasterDataModel> {
    return this.http.get<MasterDataModel>(
      params
        ? `${API_END_POINT.masterData.materials}${params}`
        : API_END_POINT.masterData.materials
    );
  }

  getEmployeesList(params?: string): Observable<MasterDataModel> {
    return this.http.get<MasterDataModel>(
      params
        ? `${API_END_POINT.masterData.employees}${params}`
        : API_END_POINT.masterData.employees
    );
  }

  getWorktypesList(params?: string): Observable<MasterDataModel> {
    return this.http.get<MasterDataModel>(
      params
        ? `${API_END_POINT.masterData.worktypes}${params}`
        : API_END_POINT.masterData.worktypes
    );
  }
}
