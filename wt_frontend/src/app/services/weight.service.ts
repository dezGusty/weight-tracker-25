import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeightEntry } from '../models/weight-entry.model';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class WeightService {
  private http = inject(HttpClient);
  private config = inject(AppConfigService);

  private get weightsUrl() {
    return `${this.config.apiUrl}/weights`;
  }

  getAllWeights(): Observable<WeightEntry[]> {
    return this.http.get<WeightEntry[]>(this.weightsUrl);
  }

  getRecentWeights(limit?: number): Observable<WeightEntry[]> {
    const url = limit ? `${this.weightsUrl}/recent?limit=${limit}` : `${this.weightsUrl}/recent`;
    return this.http.get<WeightEntry[]>(url);
  }

  getWeight(id: number): Observable<WeightEntry> {
    return this.http.get<WeightEntry>(`${this.weightsUrl}/${id}`);
  }

  getWeightByDate(date: string): Observable<WeightEntry> {
    return this.http.get<WeightEntry>(`${this.weightsUrl}/date/${date}`);
  }

  createWeight(weight: WeightEntry): Observable<WeightEntry> {
    return this.http.post<WeightEntry>(this.weightsUrl, weight);
  }

  updateWeight(id: number, weight: WeightEntry): Observable<WeightEntry> {
    return this.http.put<WeightEntry>(`${this.weightsUrl}/${id}`, weight);
  }

  deleteWeight(id: number): Observable<void> {
    return this.http.delete<void>(`${this.weightsUrl}/${id}`);
  }
}
