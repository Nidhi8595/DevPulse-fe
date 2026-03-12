import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  private apiUrl = 'http://localhost:3000/feed';

  constructor(private http: HttpClient) {}

  getFeed(tech: string) {
    return this.http.get(`${this.apiUrl}?tech=${tech}`);
  }

}
