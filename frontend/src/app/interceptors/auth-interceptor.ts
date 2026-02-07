import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Interceptando:', req.url);

  if (req.url.includes('/api/oauth-config') || req.url.includes('/o/token')) {
    console.log('Ignorando interceptor');
    return next(req);
  }

  const token = localStorage.getItem('access_token');
  console.log('Token no interceptor:', token);

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
