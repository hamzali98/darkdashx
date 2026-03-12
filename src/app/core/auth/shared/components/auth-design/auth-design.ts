import { Component, Input } from '@angular/core';
import { Footer } from "@app/core/layouts/footer/footer";
import { LanguageSwitcherComponent } from "@app/core/components/language-switcher/language-switcher.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'auth-page-design',
  imports: [Footer, LanguageSwitcherComponent, TranslateModule],
  templateUrl: './auth-design.html',
  styleUrl: './auth-design.css',
})
export class PageDesign {

  @Input({required:true}) authFormTitle!: string;
  @Input({required:true}) authFormSubtitle!: string;


}
