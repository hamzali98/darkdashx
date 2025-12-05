import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-totals-cards',
  imports: [],
  templateUrl: './totals-cards.html',
  styleUrl: './totals-cards.css',
})
export class TotalsCards {

  @Input() icon! : string;
  @Input() title : string = "No data";
  @Input() counts : number = 0;


}
