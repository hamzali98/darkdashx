import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgClass, SlicePipe, UpperCasePipe } from '@angular/common';
import { sidenavcols } from '@app/core/interface/generic-side-nav-interface';
import { MainLogo } from "@app/core/components/main-logo/main-logo";
import { Layout } from '@app/core/services/layout';
import { LogoutBtn } from "@app/core/components/logout-btn/logout-btn";
import { LanguageSwitcherComponent } from "@app/core/components/language-switcher/language-switcher.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TooltipDirective } from "@app/shared/directive/tooltip/tooltip";
import { Footer } from "../footer/footer";
import { FormsModule } from '@angular/forms';
import { CustomInputConfig, GenericInput } from '@app/shared/components/generic-input/generic-input';
import { SvgColour } from "@app/shared/components/svg-colour/svg-colour";

@Component({
  selector: 'app-generic-side-bar',
  imports: [
    SlicePipe,
    UpperCasePipe,
    RouterLink,
    NgClass,
    MainLogo,
    LogoutBtn,
    LanguageSwitcherComponent,
    TranslateModule,
    TooltipDirective,
    Footer,
    FormsModule,
    GenericInput,
    SvgColour
],
  templateUrl: './generic-side-bar.html',
  styleUrl: './generic-side-bar.css',
})
export class GenericSideBar<T> implements OnInit {

  searchKey = signal("");

  searchbarConfig: CustomInputConfig;

  @Input() navData: sidenavcols<T>[] = [];

  private routerRef = inject(Router);
  private layoutService = inject(Layout);
  private translateService = inject(TranslateService);

  constructor() {
    this.searchbarConfig = {
      ngclass: '',
      autoSize: true,
      startIcon: 'assets/icons/neutral/search.svg',
      type: 'text',
      inputId: 'search',
      inputName: 'search',
      errorMessage: '',
      placeholder: 'SEARCH',
      iconActions: [
        {
          iconPath: 'assets/icons/input_icons/cross.svg',
          action: () => this.clearText(),
          isActive: () => !!this.searchKey(),
        }
      ]
    }
  }

  ngOnInit() {
    // console.log("ng on init");
    const route = this.routerRef.routerState.snapshot.url.toString();
    // console.log('active route', route);
    const rout: any = route.split('/').at(1);
    // console.log(rout);
    this.layoutService.onOpen(rout.toString());
  }

  get open() {
    return this.layoutService.open();
  }

  get username() {
    return this.layoutService.username;
  }

  get sidebar() {
    return this.layoutService.getSidebarState();
  }

  clearText() {
    this.searchKey.set("");
  }

  openAndNavigate(section: string | undefined, route: string | undefined) {
    this.layoutService.openAndNavigate(section, route);
  }

  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }

  onRoute(route: string) {
    this.layoutService.onRoute(route);
  }

  isActive(route: string): boolean {
    return this.layoutService.isActive(route);
  }

  // Filtered computed signal
  filteredNavItems = computed(() => {
    const key = this.searchKey().toLowerCase().trim();
    if (!key) return this.navData;

    console.log("Nav Data", this.navData);

    return this.navData
      .map(item => {
        // Check if parent label matches
        // const parentMatches = item.tileName.toLowerCase().includes(key);
        const parentMatches = this.translateService.instant(item.tileName).toLowerCase().includes(key);

        // Filter children that match
        const matchedChildren = item.routeNames.filter(child =>
          // child.toLowerCase().includes(key)
          this.translateService.instant(child).toLowerCase().includes(key)
        );

        // Include item if parent matches (show all children)
        // OR if any children match (show only matched children)
        if (parentMatches) return item;
        if (matchedChildren.length) return { ...item, children: matchedChildren };
        return null;
      })
      .filter(Boolean);
  });

  updateSearchKey(val: string) {
    this.searchKey.set(val ?? '');
  }

  // Add this helper in sidebar TS
  highlight(text: string): string {
    const key = this.searchKey().trim();
    if (!key) return text;
    const regex = new RegExp(`(${key})`, 'gi');
    return text.replace(regex, `<mark class="bg-primary/30 text-primary rounded-sm">$1</mark>`);
  }

}
