import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private backendData: any;

  constructor(private http: HttpClient) {}

  fetchDataIfNeeded() {
    if (!this.backendData) {
      return this.http.get('http://localhost:3000/budget').toPromise().then((data) => {
        this.backendData = data;
      });
    } else {
      return Promise.resolve();
    }
  }

  getData() {
    return this.backendData;
  }
}
