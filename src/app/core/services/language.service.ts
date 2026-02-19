// import { Injectable } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
// import { firstValueFrom } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class LanguageService {

//   constructor(private translate: TranslateService) {}

//   initLanguage(): Promise<any> {

//     this.translate.addLangs(['en', 'ur']);
//     this.translate.setDefaultLang('en');

//     const savedLang = localStorage.getItem('app-lang');
//     const browserLang = this.translate.getBrowserLang();

//     const langToUse =
//       savedLang ||
//       (browserLang && ['en', 'ur'].includes(browserLang)
//         ? browserLang
//         : 'en');

//     // 🔥 IMPORTANT: Wait until file loads
//     return firstValueFrom(this.translate.use(langToUse));
//   }
// }
