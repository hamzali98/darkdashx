import { Component, Input, input, model } from '@angular/core';
import { NgClass } from '@angular/common';
import { PercentPipe, DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SvgColour } from "../svg-colour/svg-colour";

@Component({
  selector: 'app-analytics-card',
  imports: [NgClass, DecimalPipe, TranslateModule, SvgColour],
  templateUrl: './analytics-card.html',
  styleUrl: './analytics-card.css',
})
export class AnalyticsCard {

  @Input() value!: number | string;
  @Input() trend!: number;

  @Input() cTitle: string = '';
  @Input() icon: string = '';

  get trendColor() {
    return this.trend >= 0
      ? 'text-up-green-arrow bg-up-green-arrow/20'
      : 'text-down-red-arrow bg-down-red-arrow/20';
  }

  get trendIcon() {
    return this.trend >= 0
      ? 'assets/icons/uparrowgreen.svg'
      : 'assets/icons/downarrowred.svg';
  }
}
