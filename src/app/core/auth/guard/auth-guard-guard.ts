import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { DialogService } from '@app/shared/services/dialog-service/dialog';
import { TranslationService } from '@app/core/services/translate.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const dialogService = inject(DialogService);
  const translateService = inject(TranslationService);

  const isRTL = translateService.getCurrentLanguage() === 'ur';


  if (authService.isAuthenticated()) {
    return true;
  }

  dialogService.open({
    actbtn: isRTL ? 'دوبارہ لاگ ان کریں' : 'Login Again',
    title: isRTL ? '⚠️ سیشن ختم ہو گیا' : '⚠️ Session Expired',
    message: isRTL ? 'آپ کا سیشن نااہل ہو گیا ہے۔ براہ کرم دوبارہ لاگ ان کریں تاکہ جاری رہے۔' : 'Your session has expired due to inactivity. Please log in again to continue.',
    type: 'session-expired'
  });
  router.navigate(['/login']);
  return false;
};
