import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '@app/core/auth/services/auth-service';
import { DialogService } from '../services/dialog-service/dialog';
import { TranslateService } from '@ngx-translate/core';

export const roleGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const dialogService = inject(DialogService);
  const translateService = inject(TranslateService);

  const user = authService.getUser();

  if (user?.role === "super") {
    return true;
  }

  dialogService.open({
    actbtn: translateService.instant('Return'),
    title: translateService.instant('⚠️ Access Denied'),
    message: translateService.instant('Access_Denied_msg'),
    type: 'session-expired'
  });

  return false;

};
