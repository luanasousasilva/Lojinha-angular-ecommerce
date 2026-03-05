import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {AuthService} from "../app/services/auth.service";


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const currentUser = authService.getCurrentUser();

  if (currentUser) {
    const authReq = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${currentUser.id}`,
        'User-Role': currentUser.role
      }
    });
    return next(authReq);
  }

  return next(req);
};
