import { Component, HostListener, inject, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterOutlet } from "@angular/router";
import { GenericSideBar } from "../generic-side-bar/generic-side-bar";
import { Formservice } from '@app/features/users/adduser/services/formservice';
import { Header } from "../header/header";
import { Subject, takeUntil } from 'rxjs';
import { Layout } from '@app/core/services/layout';
import { TranslationService } from '@app/core/services/translate.service';
@Component({
  selector: 'app-home-layout',
  imports: [RouterOutlet, GenericSideBar, Header, NgClass],
  templateUrl: './home-layout.html',
  styleUrl: './home-layout.css',
})
export class HomeLayout implements OnInit {

  isSidebarOpen = false;
  isMobile = false;
  private destroy$ = new Subject<void>();

  userFormService = inject(Formservice);
  private layoutService = inject(Layout);
  translationService = inject(TranslationService);

  sideCols: any[];

  constructor() {
    this.sideCols = [
      {
        routePath: 'home', tileName: "DASHBOARD",
        coloredIcon: "assets/icons/colored/homeicon.svg",
        uncoloredIcon: "assets/icons/uncolored/homeicon.svg",
        iconsAlt: "home", topPadding: "pt-7",
        routeNames: ["HOME", "REPORTS", "TASKS", "PRODUCTS"],
        routeLink: ["/", "/home/reports", "/home/tasks", "/home/products"]
      },
      {
        routePath: 'users', tileName: "USERS",
        coloredIcon: "assets/icons/colored/usericon.svg",
        uncoloredIcon: "assets/icons/uncolored/usericon.svg",
        iconsAlt: "user", topPadding: "pt-0",
        routeNames: ["VIEW_USERS", "ADD_USER"],
        routeLink: ["/users/view", "/users/add",]
      },
      {
        routePath: 'features', tileName: "FEATURES",
        coloredIcon: "assets/icons/colored/star.svg",
        uncoloredIcon: "assets/icons/uncolored/star.svg",
        iconsAlt: "feat", topPadding: "pt-0",
        routeNames: ["VIEW_FEATURES", "ADD_FEATURES"],
        routeLink: ["/users/view", "/users/add",]
      },
      {
        routePath: 'pricing', tileName: "PRICING",
        coloredIcon: "assets/icons/colored/dollar.svg",
        uncoloredIcon: "assets/icons/uncolored/dollar.svg",
        iconsAlt: "pricing", topPadding: "pt-0",
        routeNames: ["VIEW_PRICING", "ADD_PRICING"],
        routeLink: ["/users/view", "/users/add",]
      },
      {
        routePath: 'integrations', tileName: "INTEGRATIONS",
        coloredIcon: "assets/icons/colored/puzzlepiece.svg",
        uncoloredIcon: "assets/icons/uncolored/puzzlepiece.svg",
        iconsAlt: "integrations", topPadding: "pt-0",
        routeNames: ["VIEW_INTEGRATIONS", "ADD_INTEGRATIONS"],
        routeLink: ["/users/view", "/users/add",]
      },
    ]
  }

  ngOnInit(): void {
    this.checkScreenSize();
    
    this.layoutService.isSidebarOpen$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isOpen => {
        this.isSidebarOpen = isOpen;
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  get isRtl(): boolean {
    return this.translationService.getCurrentLanguage() === 'ur';
  }

  checkScreenSize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 1110; 
    
    if (this.isMobile && !wasMobile) {
      this.layoutService.closeSidebar();
    }
    if (!this.isMobile && wasMobile) {
      this.layoutService.closeSidebar();
    }
  }

  closeSidebar() {
    if (this.isMobile) {
      this.layoutService.closeSidebar();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
