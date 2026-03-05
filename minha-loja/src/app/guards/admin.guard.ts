import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();

  if (currentUser?.role === 'admin') {
    return true;
  }

  if (!currentUser) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  } else {
    router.navigate(['/']);
    setTimeout(() => {
      alert('Acesso negado. Apenas administradores podem acessar esta página.');
    }, 100);
  }

  return false;
};
