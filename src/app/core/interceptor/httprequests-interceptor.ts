import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Loaderservice } from '@app/shared/services/loader/loaderservice';
import { AuthService } from '../auth/services/auth-service';

export const httprequestsInterceptor: HttpInterceptorFn = (req, next) => {

  // const loaderService = inject(Loaderservice);
  // const authService = inject(AuthService);

  // loaderService.showLoader();
  // const authCheck = authService.isAuthenticated();
  // if(!authCheck){
  //   authService.logout();
  // }
  // console.log("interceptor calling", req);
  // loaderService.hideLoader();
  return next(req);
};
