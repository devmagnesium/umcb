import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { tap, of } from 'rxjs';
import { ConfigService } from '../services/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private get tokenUrl(): string {
    return 'http://127.0.0.1:8000' + this.config.tokenUrl;
  }

  constructor(
    private http: HttpClient,
    private config: ConfigService,
  @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  refreshToken() {
    if (isPlatformBrowser(this.platformId)) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        const body = new URLSearchParams();
        body.set('grant_type', 'refresh_token');
        body.set('refresh_token', refreshToken);
        body.set('client_id', this.config.clientId);
        // body.set('client_secret', this.config.clientSecret); // Se necessário, adicione o client secret aqui

        return this.http.post<any>(this.tokenUrl, body.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).pipe(
          tap(res => {
            localStorage.setItem('access_token', res.access_token);
            localStorage.setItem('refresh_token', res.refresh_token);
          })
        );
      }
    }
    return of(null);
  }

  login(username: string, password: string) {
    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('username', username);
    body.set('password', password);
    body.set('client_id', this.config.clientId);
    // body.set('client_secret', this.config.clientSecret); // Se necessário, adicione o client secret aqui

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    console.log('client_id:', this.config.clientId);
    // console.log('client_secret:', this.config.clientSecret);

    return this.http.post<any>(this.tokenUrl, body.toString(), { headers }).pipe(
      tap(res => {
        this.saveToken(res.access_token);
        if (res.refresh_token) {
          localStorage.setItem('refresh_token', res.refresh_token);
        }
      })
    );
  }

  isAdmin(): boolean {
  const token = this.getToken();
  // Lógica para decodificar o token e verificar o papel (role) do usuário
  // Isso pode ser feito com uma biblioteca JWT ou um serviço específico
  // Exemplo simples:
  // return token && /* condição que verifica se o usuário é admin */;
  return token !== null; // Placeholder, substitua pela lógica real de verificação de papel
}

  saveToken(token: string) {
    console.log('Salvando token:', token);
    console.log(typeof window);
    console.log(typeof localStorage);
    localStorage.setItem('access_token', token);
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  logout() {
    localStorage.removeItem('access_token');
  }
}
