import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config!: any;

  constructor(private http: HttpClient) {}

  load(): Promise<void> {
  return fetch('http://127.0.0.1:8000/api/oauth-config')
    .then(res => res.json())
    .then(config => {
      this.config = config;
      console.log('OAuth config carregada:', config);
    });
}

  get clientId(): string {
    return this.config?.client_id;
  }

  get clientSecret(): string {
    return this.config?.client_secret;
  }

  get tokenUrl(): string {
    return this.config?.token_url;
  }
}
