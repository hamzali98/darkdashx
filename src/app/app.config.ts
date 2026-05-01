import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { isActive, IsActiveMatchOptions, provideRouter, Router, withViewTransitions } from '@angular/router';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httprequestsInterceptor } from './core/interceptor/httprequests-interceptor';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { APP_INITIALIZER, isDevMode } from '@angular/core';
import { TranslationService } from './core/services/translate.service';
import { provideServiceWorker } from '@angular/service-worker';


export function initializeApp(langService: TranslationService) {
  return () => langService.initLanguage();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(
      withInterceptors([httprequestsInterceptor])
    ),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json'
      })
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [TranslationService],
      multi: true
    },
    provideRouter(routes,
      withViewTransitions({
        onViewTransitionCreated: ({ transition }) => {
          const router = inject(Router);
          const targetUrl = router.currentNavigation()!.finalUrl!;
          // Skip transition if only fragment or query params change
          const config : Partial<IsActiveMatchOptions> = {
            paths: 'exact',
            matrixParams: 'exact',
            fragment: 'ignored',
            queryParams: 'ignored',
          };
          const isTargetRouteCurrent = isActive(targetUrl, router, config);
          if (isTargetRouteCurrent()) {
            transition.skipTransition();
          }
        },
      })
    ),
    // provideAnimationsAsync(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};
