// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../services/auth-service';
// import { DialogService } from '@app/shared/services/dialog-service/dialog';
// import { TranslationService } from '@app/core/services/translate.service';

// export const authGuardGuard: CanActivateFn = (route, state) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);
//   const dialogService = inject(DialogService);
//   const translateService = inject(TranslationService);

//   const isRTL = translateService.getCurrentLanguage() === 'ur';


//   if (authService.isAuthenticated()) {
//     return true;
//   }

//   // if (authService.wasSessionActive()) {
//     dialogService.open({
//       actbtn: isRTL ? 'دوبارہ لاگ ان کریں' : 'Login Again',
//       title: isRTL ? '⚠️ سیشن ختم ہو گیا' : '⚠️ Session Expired',
//       message: isRTL ? 'آپ کا سیشن غیر فعال ہونے کی وجہ سے ختم ہو گیا ہے۔ جاری رکھنے کے لیے براہ کرم دوبارہ لاگ ان کریں۔' : 'Your session has expired due to inactivity. Please log in again to continue.',
//       type: 'session-expired'
//     });
//   // } else {
//   //   router.navigate(['/login']);
//   // }
//   router.navigate(['/login']);
//   return false;
// };

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

  // Check if the logout was due to session expiration
  // const logoutReason = authService.getLastLogoutReason();
  
  // if (logoutReason === 'expired') {
  //   dialogService.open({
  //     actbtn: isRTL ? 'دوبارہ لاگ ان کریں' : 'Login Again',
  //     title: isRTL ? '⚠️ سیشن ختم ہو گیا' : '⚠️ Session Expired',
  //     message: isRTL ? 'آپ کا سیشن غیر فعال ہونے کی وجہ سے ختم ہو گیا ہے۔ جاری رکھنے کے لیے براہ کرم دوبارہ لاگ ان کریں۔' : 'Your session has expired due to inactivity. Please log in again to continue.',
  //     type: 'session-expired'
  //   });
    
  //   // Clear the reason after showing the dialog so it doesn't show again
  //   authService.clearLogoutReason();
  // }
  
  router.navigate(['/auth/login']);
  return false;
};