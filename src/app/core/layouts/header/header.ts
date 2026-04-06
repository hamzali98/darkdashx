import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Layout } from '@app/core/services/layout';
import { MainLogo } from "@app/core/components/main-logo/main-logo";
import { LogoutBtn } from "@app/core/components/logout-btn/logout-btn";
import { LanguageSwitcherComponent } from "@app/core/components/language-switcher/language-switcher.component";
import { SvgColour } from "@app/shared/components/svg-colour/svg-colour";

@Component({
  selector: 'app-header',
  imports: [MainLogo, LogoutBtn, LanguageSwitcherComponent, SvgColour],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  private layoutService = inject(Layout);
  // username = "Guest";

  // open = signal("");

  // onRoute(val : string){}

  get username() {
    return this.layoutService.username;
  }

  get open() {
    return this.layoutService.open();
  }
  
  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }

  onRoute(route: string) {
    this.layoutService.onRoute(route);
    // this.routerRef.navigate([route]);
    // this.onOpen(route);
  }

  onLogout() {
    this.layoutService.onLogout();
  }
}
