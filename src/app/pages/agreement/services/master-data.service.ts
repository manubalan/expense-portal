import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_END_POINT } from 'src/app/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class MasterDataService {
  constructor(private http: HttpClient) {}

  getMasterData(): Observable<any> {
    return this.http.get(API_END_POINT.masterData.states);
  }
}
