import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { httprequestsInterceptor } from './core/interceptor/httprequests-interceptor';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { APP_INITIALIZER } from '@angular/core';
// import { LanguageService } from './core/services/language.service';
import { TranslationService } from './core/services/translate.service';

// Factory function for translation loader
// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }

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
    // importProvidersFrom(
    //   TranslateModule.forRoot({
    //     defaultLanguage: 'en',
    //     loader: {
    //       provide: TranslateLoader,
    //       useFactory: HttpLoaderFactory,
    //       deps: [HttpClient]
    //     }
    //   }),
    // ),
    provideRouter(routes)
  ]
};
