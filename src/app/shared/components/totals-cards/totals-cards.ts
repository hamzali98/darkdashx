import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-totals-cards',
  imports: [TranslateModule],
  templateUrl: './totals-cards.html',
  styleUrl: './totals-cards.css',
})
export class TotalsCards {

  @Input() icon!: string;
  @Input() title: string = "No data";
  @Input() counts: number = 0;


}
