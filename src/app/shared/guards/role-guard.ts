import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '@app/core/auth/services/auth-service';
import { DialogService } from '../services/dialog-service/dialog';
import { TranslationService } from '@app/core/services/translate.service';

export const roleGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const dialogService = inject(DialogService);
  const translateService = inject(TranslationService);

  const isRTL = translateService.getCurrentLanguage() === 'ur';

  const user = authService.getUser();

  if (user?.role === "super") {
    return true;
  }

  dialogService.open({
    actbtn: isRTL ? 'واپس جائیں' : 'Return',
    title: isRTL ? '⚠️ رسائی ممنوع' : '⚠️ Access Denied',
    message: isRTL ? 'اس صارف کو ایپلیکیشن کی اس خصوصیت تک رسائی نہیں ہے۔' : 'This user does not have access to this feature of application.',
    type: 'session-expired'
  });

  return false;

};
