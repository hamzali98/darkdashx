import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService, Language } from '@app/core/services/translate.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex gap-1">
      <button 
        (click)="switchLanguage('en')"
        [class.active]="(currentLang$ | async) === 'en'"
        [ngClass]="(currentLang$|async) === 'en' ? 'border border-primary rounded-lg':''"
        class="p-1 rounded bg-card-bg transition-colors duration-200 text-xs text-white">
        EN
      </button>
      <button 
        (click)="switchLanguage('ur')"
        [class.active]="(currentLang$ | async) === 'ur'"
        [ngClass]="(currentLang$|async) === 'ur' ? 'border border-primary rounded-lg': ''"
        class="p-1 rounded bg-card-bg transition-colors duration-200 text-xs text-white">
        UR
      </button>
    </div>
  `
})
export class LanguageSwitcherComponent {

    translationService = inject(TranslationService);

  currentLang$ = this.translationService.currentLang$;

//   constructor(private translationService: TranslationService) {}

  switchLanguage(lang: Language): void {
    this.translationService.setLanguage(lang);
  }
}