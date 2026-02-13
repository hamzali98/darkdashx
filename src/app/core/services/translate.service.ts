// import { Injectable } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
// import { BehaviorSubject } from 'rxjs';

// export type Language = 'en' | 'ur';

// @Injectable({
//   providedIn: 'root'
// })
// export class TranslationService {
//   private currentLangSubject = new BehaviorSubject<Language>('en');
//   public currentLang$ = this.currentLangSubject.asObservable();

//   constructor(private translate: TranslateService) {
//     this.initializeLanguage();
//     this.translate.onLangChange.subscribe(event => {
//       this.currentLangSubject.next(event.lang as Language);
//       this.applyDirection(event.lang as Language);
//     });

//   }

//   private async initializeLanguage(): Promise<void> {
//     const savedLang = localStorage.getItem('app-language') as Language || 'en';

//     await this.translate.use(savedLang).toPromise(); // Wait until file loads

//     this.currentLangSubject.next(savedLang);
//     this.applyDirection(savedLang);
//   }

//   setLanguage(lang: Language): void {
//     this.translate.use(lang);
//     this.currentLangSubject.next(lang);
//     localStorage.setItem('app-language', lang);

//     // Set RTL for Urdu
//     if (lang === 'ur') {
//       document.documentElement.setAttribute('dir', 'rtl');
//       document.documentElement.setAttribute('lang', 'ur');
//     } else {
//       document.documentElement.setAttribute('dir', 'ltr');
//       document.documentElement.setAttribute('lang', 'en');
//     }
//   }

//   private applyDirection(lang: Language): void {
//     if (lang === 'ur') {
//       document.documentElement.setAttribute('dir', 'rtl');
//       document.documentElement.setAttribute('lang', 'ur');
//     } else {
//       document.documentElement.setAttribute('dir', 'ltr');
//       document.documentElement.setAttribute('lang', 'en');
//     }
//   }


//   getCurrentLanguage(): Language {
//     return this.currentLangSubject.value;
//   }

//   toggleLanguage(): void {
//     const newLang: Language = this.getCurrentLanguage() === 'en' ? 'ur' : 'en';
//     this.setLanguage(newLang);
//   }

//   // Helper method to get instant translation
//   instant(key: string, params?: any): string {
//     return this.translate.instant(key, params);
//   }

//   // Helper method to get translation observable
//   get(key: string, params?: any) {
//     return this.translate.get(key, params);
//   }
// }


import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

export type Language = 'en' | 'ur';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private availableLangs: Language[] = ['en', 'ur'];
  private storageKey = 'app-language';

  private currentLangSubject = new BehaviorSubject<Language>('en');
  public currentLang$ = this.currentLangSubject.asObservable();

  constructor(private translate: TranslateService) {}

  // 🔥 Used by APP_INITIALIZER
  async initLanguage(): Promise<void> {

    this.translate.addLangs(this.availableLangs);
    this.translate.setDefaultLang('en');

    const savedLang = localStorage.getItem(this.storageKey) as Language;
    const browserLang = this.translate.getBrowserLang() as Language;

    const langToUse =
      savedLang ||
      (browserLang && this.availableLangs.includes(browserLang)
        ? browserLang
        : 'en');

    await firstValueFrom(this.translate.use(langToUse));

    this.currentLangSubject.next(langToUse);
    this.applyDirection(langToUse);
  }

  async setLanguage(lang: Language): Promise<void> {
    await firstValueFrom(this.translate.use(lang));

    localStorage.setItem(this.storageKey, lang);
    this.currentLangSubject.next(lang);
    this.applyDirection(lang);
  }

  toggleLanguage(): void {
    const newLang: Language =
      this.getCurrentLanguage() === 'en' ? 'ur' : 'en';

    this.setLanguage(newLang);
  }

  getCurrentLanguage(): Language {
    return this.translate.currentLang as Language;
  }

  private applyDirection(lang: Language): void {
    document.documentElement.setAttribute(
      'dir',
      lang === 'ur' ? 'rtl' : 'ltr'
    );
    document.documentElement.setAttribute('lang', lang);
  }

  // Optional helpers
  instant(key: string, params?: any): string {
    return this.translate.instant(key, params);
  }

  get(key: string, params?: any) {
    return this.translate.get(key, params);
  }
}
