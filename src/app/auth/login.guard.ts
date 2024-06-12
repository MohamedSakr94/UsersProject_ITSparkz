import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService._isLoggedIn$.value) {
    return true;
  }
  router.navigateByUrl('/notAdmin');
  return false;
};
