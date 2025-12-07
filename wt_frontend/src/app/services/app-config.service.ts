import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

export interface AppConfig {
  apiUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private config: AppConfig | null = null;
  private http = inject(HttpClient);

  async loadConfig(): Promise<void> {
    try {
      // Load config.json from the root (public folder)
      this.config = await lastValueFrom(this.http.get<AppConfig>('config.json'));
    } catch (error) {
      console.warn('Could not load config.json, using default configuration.', error);
      this.config = {
        apiUrl: 'http://localhost:5057/api'
      };
    }
  }

  get apiUrl(): string {
    return this.config?.apiUrl ?? 'http://localhost:5057/api';
  }
}
