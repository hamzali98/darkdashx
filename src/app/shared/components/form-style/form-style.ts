import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-form-style',
  imports: [TranslateModule],
  templateUrl: './form-style.html',
  styleUrl: './form-style.css',
})
export class FormStyle {

  @Input({ required: true }) formTitle: string;
  @Input({ required: true }) formSubtitle: string;

  constructor(){
    this.formTitle = '.....';
    this.formSubtitle = '......';
  }
}
