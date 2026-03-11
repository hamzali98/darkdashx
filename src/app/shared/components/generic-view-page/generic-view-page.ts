import { Component, inject, Input, model } from '@angular/core';
import { SearchBar } from "../search-bar/search-bar";
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generic-view-page',
  imports: [SearchBar, TranslateModule],
  templateUrl: './generic-view-page.html',
  styleUrl: './generic-view-page.css',
})
export class GenericViewPage {

  genericSearchKey = model('');
  private readonly user_form_intent: string = 'user_form_intent';


  @Input({ required: true }) pageTitle!: string;
  @Input({ required: true }) buttonTitle!: string;
  @Input({ required: true }) route!: string;

  private routerRef = inject(Router);

  onClick() {
    sessionStorage.setItem(this.user_form_intent, 'add');
    this.routerRef.navigate([this.route]);
  }
}
