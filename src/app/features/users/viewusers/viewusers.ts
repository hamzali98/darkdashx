import { Component } from '@angular/core';
import { GenericTable } from '@app/shared/components/generic-table/generic-table';
import { TotalsCards } from "@app/shared/components/totals-cards/totals-cards";

@Component({
  selector: 'app-viewusers',
  imports: [GenericTable, TotalsCards],
  templateUrl: './viewusers.html',
  styleUrl: './viewusers.css',
})
export class Viewusers {

}
