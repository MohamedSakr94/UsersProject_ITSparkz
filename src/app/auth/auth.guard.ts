import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService._isLoggedIn$.value) {
    if (authService._isAdmin) {
      return true;
    } else if (!authService._isAdmin) {
      router.navigateByUrl('/notAdmin');
      return false;
    }
  }
  router.navigateByUrl('/login');
  return false;
};
