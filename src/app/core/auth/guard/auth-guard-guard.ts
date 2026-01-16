import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { DialogService } from '@app/shared/services/dialog-service/dialog';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const dialogService = inject(DialogService);

  if (authService.isAuthenticated()) {
    return true;
  }

  dialogService.open({
    title: '⚠️ Session Expired',
    message: 'Your session has expired due to inactivity. Please log in again to continue.',
    type: 'session-expired'
  });
  router.navigate(['/login']);
  return false;
};
