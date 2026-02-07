import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const http = inject(HttpClient);
  const token = localStorage.getItem('access_token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // Se estiver na raiz, decide para onde enviar
  if (router.url === '/') {
    return http.get('http://127.0.0.1:8000/api/me/').pipe(
      map((user: any) => {
        if (user.is_staff) {
          router.navigate(['/users']);
        } else {
          router.navigate(['/profile']);
        }
        return false; // impede o carregamento do componente raiz
      }),
      catchError(err => {
        console.error('Erro ao buscar usuário', err);
        localStorage.removeItem('access_token');
        router.navigate(['/login']);
        return of(false);
      })
    );
  }

  // Para outras rotas protegidas, só verifica token
  return true;
};
