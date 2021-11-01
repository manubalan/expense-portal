import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_END_POINT } from '../constants/endpoint.constants';
import { MasterDataModel, ResultDataModel } from '../models/master-data.model';

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

  getLocationsList(
    params?: number,
    search?: string
  ): Observable<MasterDataModel> {
    return this.http.get<MasterDataModel>(
      `${API_END_POINT.masterData.location_params}${
        params !== undefined || (search !== undefined && search !== null)
          ? '?'
          : ''
      }${params !== undefined && params > 0 ? 'district=' + params : ''}${
        search !== null && search !== undefined ? search : ''
      }`
    );
  }

  getLocations(id: number): Observable<ResultDataModel> {
    return this.http.get<ResultDataModel>(
      `${API_END_POINT.masterData.location}${id}`
    );
  }

  getVehicletypesList(params?: string): Observable<MasterDataModel> {
    return this.http.get<MasterDataModel>(
      `${API_END_POINT.masterData.vehicle_type}${
        params !== undefined && params !== null ? params : ''
      }`
    );
  }

  getMaterialsList(params?: string): Observable<MasterDataModel> {
    return this.http.get<MasterDataModel>(
      `${API_END_POINT.masterData.materials}${
        params !== undefined && params !== null ? params : ''
      }`
    );
  }

  getEmployeesList(params?: string): Observable<MasterDataModel> {
    return this.http.get<MasterDataModel>(
      `${API_END_POINT.masterData.employees}${
        params !== undefined && params !== null ? params : ''
      }`
    );
  }

  getWorktypesList(params?: string): Observable<MasterDataModel> {
    return this.http.get<MasterDataModel>(
      `${API_END_POINT.masterData.worktypes}${
        params !== undefined && params !== null ? params : ''
      }`
    );
  }

  getQuantityType(): Observable<MasterDataModel> {
    return this.http.get<MasterDataModel>(
      `${API_END_POINT.masterData.quantityType}`
    );
  }

  getWorkDayType(): Observable<MasterDataModel> {
    return this.http.get<MasterDataModel>(
      `${API_END_POINT.masterData.workDayType}`
    );
  }
}
