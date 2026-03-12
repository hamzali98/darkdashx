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
    // this.translate.setDefaultLang('en');
    this.translate.setFallbackLang('en');

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
    // return this.translate.currentLang as Language;
    return this.translate.getCurrentLang() as Language;
    // const lang = localStorage.getItem(this.storageKey) as Language || 'en';
    // return lang;
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
