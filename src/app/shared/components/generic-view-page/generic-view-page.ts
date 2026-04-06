import { Router } from '@angular/router';
import { SearchBar } from "../search-bar/search-bar";
import { TranslateModule } from '@ngx-translate/core';
import { Component, inject, Input, model } from '@angular/core';
import { GenericDropMenu } from "../generic-drop-menu/generic-drop-menu";

@Component({
  selector: 'app-generic-view-page',
  imports: [SearchBar, TranslateModule, GenericDropMenu],
  templateUrl: './generic-view-page.html',
  styleUrl: './generic-view-page.css',
})
export class GenericViewPage {

  genericSearchKey = model('');

  @Input({ required: true }) type!: string;
  @Input({ required: true }) isActive!: boolean;
  @Input({ required: true }) pageTitle!: string;
  @Input() buttonTitle!: string;
  @Input() route!: string;

  private routerRef = inject(Router);

  onClick() {
    this.routerRef.navigate([this.route]);
  }
}
