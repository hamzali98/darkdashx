import { Router } from '@angular/router';
import { SearchBar } from "../search-bar/search-bar";
import { TranslateModule } from '@ngx-translate/core';
import { Component, inject, Input, model } from '@angular/core';

@Component({
  selector: 'app-generic-view-page',
  imports: [SearchBar, TranslateModule],
  templateUrl: './generic-view-page.html',
  styleUrl: './generic-view-page.css',
})
export class GenericViewPage {

  genericSearchKey = model('');


  @Input({ required: true }) pageTitle!: string;
  @Input({ required: true }) buttonTitle!: string;
  @Input({ required: true }) route!: string;

  private routerRef = inject(Router);

  onClick() {
    this.routerRef.navigate([this.route]);
  }
}
