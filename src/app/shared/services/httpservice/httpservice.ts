import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Httpservice {

  BASE_URL : string = "http://localhost:3000";

  httpClient = inject(HttpClient);
  
  addApi(url : string, payload: Object){
    return this.httpClient.post<any>(`${this.BASE_URL}/${url}`,payload);
  }

}
