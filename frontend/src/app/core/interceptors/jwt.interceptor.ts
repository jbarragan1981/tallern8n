import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';
import { catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Exclude n8n webhook calls from getting the internal JWT Authorization header
  const isN8nWebhook = req.url.includes(environment.n8nBotWebhook);

  let clonedRequest = req;
  if (token && !isN8nWebhook) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(clonedRequest).pipe(
    catchError((error) => {
      // On 401 Unauthorized, automatically log out
      if (error.status === 401 && !isN8nWebhook) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
