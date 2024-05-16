import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IApiResponse } from '../models/apiResponse.model';

@Injectable()

export class ApiService {

  constructor(private http: HttpClient) { }

  get() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    };
    
    //return this.http.get<IApiResponse>('https://my.qnips.io/dbapi/ha', httpOptions);
    return this.http.get<IApiResponse>('https://myprelive.qnips.com/dbapi/ha', httpOptions);
  }
}