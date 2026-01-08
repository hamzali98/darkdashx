// import { Injectable } from '@angular/core';
// import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';
// import { AuthService } from '@app/core/auth/services/auth-service';
// import { DialogService } from '@app/shared/services/dialog-service/dialog';

// @Injectable({
//   providedIn: 'root',
// })
// export class authGuardGuard implements CanActivate {
//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     private dialogService: DialogService
//   ) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

//     if (this.authService.isAuthenticated()) {
//       return true;
//     } else {
//       // 1. Show the Session Expired dialog
//       this.dialogService.open({
//         title: '⚠️ Session Expired',
//         content: 'Your session has expired due to inactivity. Please log in again to continue.',
//         type: 'session-expired' // Custom type for styling/logic in app.component
//       });

//       // 2. Redirect to the login page (or handle navigation after dialog close)
//       return false;
//       // return this.router.createUrlTree(['/login']);
//     }
//   }
// }

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
    content: 'Your session has expired due to inactivity. Please log in again to continue.',
    type: 'session-expired' // Custom type for styling/logic in app.component
  });
  router.navigate(['/login']);
  return false;
};
