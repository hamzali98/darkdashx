import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService, Language } from '@app/core/services/translate.service';
import { TooltipDirective } from "@app/shared/directive/tooltip/tooltip";
import { TranslateModule } from '@ngx-translate/core';
import { TickAnimationService } from '@app/shared/services/tick-animation/tick-animation-service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, TooltipDirective, TranslateModule],
  template: `
    <div class="flex gap-1">
      <button type="button"
      [appTooltip]=" (currentLang$|async) === 'ur' ? ('switch language to english' | translate) : ('current language is english' | translate)" 
      tooltipPosition="bottom"
      (click)="switchLanguage('en')"
        [class.active]="(currentLang$ | async) === 'en'"
        [ngClass]="(currentLang$|async) === 'en' ? 'border border-primary rounded-lg':''"
        class="p-1 rounded bg-card-bg transition-colors duration-200 text-xs text-figma-neutral">
        {{"EN" | translate}}
      </button>
      <button type="button"
      [appTooltip]=" (currentLang$|async) === 'en' ? ('switch language to urdu' |translate) : ('current language is urdu' | translate)" 
      tooltipPosition="bottom"
      (click)="switchLanguage('ur')"
        [class.active]="(currentLang$ | async) === 'ur'"
        [ngClass]="(currentLang$|async) === 'ur' ? 'border border-primary rounded-lg': ''"
        class="p-1 rounded bg-card-bg transition-colors duration-200 text-xs text-figma-neutral">
        {{"UR" | translate}}
      </button>
    </div>
  `
})
export class LanguageSwitcherComponent {

  private translationService = inject(TranslationService);
  private tickANimationService = inject(TickAnimationService);

  currentLang$ = this.translationService.currentLang$;

  //   constructor(private translationService: TranslationService) {}

  switchLanguage(lang: Language): void {
    this.translationService.setLanguage(lang);
    // if (lang === 'en') {
    //   this.tickANimationService.show();
    // }
    this.tickANimationService.show(lang === 'en' ? 'language switched to english' : 'زبان اردو میں بدل گئی۔', 3000);
  }
}