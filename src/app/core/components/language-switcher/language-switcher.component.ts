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
        [ngClass]="(currentLang$|async) === 'en' ? 'bg-primary hover:bg-primary/80':''"
        class="py-0 px-1 rounded-full transition-colors duration-200 text-xs
               bg-blue-500 hover:bg-blue-600 text-white
               disabled:opacity-50">
        EN
      </button>
      <button 
        (click)="switchLanguage('ur')"
        [class.active]="(currentLang$ | async) === 'ur'"
        [ngClass]="(currentLang$|async) === 'ur' ? 'bg-primary hover:bg-primary/80': ''"
        class="py-0 px-1 rounded-full transition-colors duration-200 text-xs
               bg-green-500 hover:bg-green-600 text-white
               disabled:opacity-50">
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