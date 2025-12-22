import { Component, computed, input, Input, model } from '@angular/core';
import { DataError } from "../data-error/data-error";

@Component({
  selector: 'app-totals-cards',
  imports: [DataError],
  templateUrl: './totals-cards.html',
  styleUrl: './totals-cards.css',
})
export class TotalsCards {

  @Input() icon! : string;
  @Input() title : string = "No data";
  @Input() counts : number = 0;


}
