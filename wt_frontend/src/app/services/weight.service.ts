import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeightEntry } from '../models/weight-entry.model';

@Injectable({
  providedIn: 'root'
})
export class WeightService {
  private apiUrl = 'http://localhost:5057/api/weights';

  constructor(private http: HttpClient) { }

  getAllWeights(): Observable<WeightEntry[]> {
    return this.http.get<WeightEntry[]>(this.apiUrl);
  }

  getRecentWeights(limit?: number): Observable<WeightEntry[]> {
    const url = limit ? `${this.apiUrl}/recent?limit=${limit}` : `${this.apiUrl}/recent`;
    return this.http.get<WeightEntry[]>(url);
  }

  getWeight(id: number): Observable<WeightEntry> {
    return this.http.get<WeightEntry>(`${this.apiUrl}/${id}`);
  }

  getWeightByDate(date: string): Observable<WeightEntry> {
    return this.http.get<WeightEntry>(`${this.apiUrl}/date/${date}`);
  }

  createWeight(weight: WeightEntry): Observable<WeightEntry> {
    return this.http.post<WeightEntry>(this.apiUrl, weight);
  }

  updateWeight(id: number, weight: WeightEntry): Observable<WeightEntry> {
    return this.http.put<WeightEntry>(`${this.apiUrl}/${id}`, weight);
  }

  deleteWeight(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
