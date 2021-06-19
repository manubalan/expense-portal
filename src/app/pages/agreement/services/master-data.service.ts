import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class MasterDataService {
  constructor(private http: HttpClient) {}

  getMasterData(): any {
    // this.http.get(environment.master_data).subscribe((data) => {
    //   console.log('JSON ==>', data);
    // });
  }
}
