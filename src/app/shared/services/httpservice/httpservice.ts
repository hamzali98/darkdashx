import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Httpservice {

  httpClient = inject(HttpClient);
  
  addApi(url : string, payload: Object){
    return this.httpClient.post<any>(`${url}`,payload);
  }

  getApi(url: string) {
    return this.httpClient.get<any>(`${url}`, {observe: 'response' as const});
  }

  delApi(url: string, valId: string) {
    return this.httpClient.delete<any>(`${url}/${valId}`);
  }

  editApi(url: string, id: string, payload: Object) {
    return this.httpClient.put<any>(`${url}/${id}`, payload);
  }
}
