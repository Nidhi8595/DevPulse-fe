import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

    private apiUrl = `${environment.apiUrl}/feed`;

  constructor(private http: HttpClient) {}

  getFeed(tech: string) {
    return this.http.get(`${this.apiUrl}?tech=${tech}`);
  }

}
