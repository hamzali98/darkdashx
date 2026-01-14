import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/core/auth/services/auth-service';
import { DialogService } from '../services/dialog-service/dialog';

export const roleGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const dialogService = inject(DialogService);

  const user = authService.getUser();

  if (user?.role === "super") {
    return true;
  }

  dialogService.open({
    title: '⚠️ Access Denied',
    content: 'This user does not have access to this application feature.',
    type: 'session-expired' 
  });

  // router.navigate(['/profile'])
  return false;

  // return true;
};
