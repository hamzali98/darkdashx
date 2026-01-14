import { Component, HostListener, inject, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterOutlet } from "@angular/router";
import { GenericSideBar } from "../generic-side-bar/generic-side-bar";
import { Formservice } from '@app/features/users/adduser/services/formservice';
import { Header } from "../header/header";
import { Subject, takeUntil } from 'rxjs';
import { Layout } from '@app/core/services/layout';
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

  sideCols: any[];

  constructor() {
    this.sideCols = [
      {
        routePath: 'home', tileName: "Dashboard",
        coloredIcon: "assets/icons/colored/homeicon.svg",
        uncoloredIcon: "assets/icons/uncolored/homeicon.svg",
        iconsAlt: "home", topPadding: "pt-7",
        routeNames: ["Home", "Reports", "Tasks", "Products"],
        routeLink: ["/", "/home/reports", "/home/tasks", "/home/products"]
      },
      {
        routePath: 'users', tileName: "Users",
        coloredIcon: "assets/icons/colored/usericon.svg",
        uncoloredIcon: "assets/icons/uncolored/usericon.svg",
        iconsAlt: "user", topPadding: "pt-0",
        routeNames: ["View Users", "Add Users"],
        routeLink: ["/users/view", "/users/add",]
      },
      {
        routePath: 'features', tileName: "Features",
        coloredIcon: "assets/icons/colored/star.svg",
        uncoloredIcon: "assets/icons/uncolored/star.svg",
        iconsAlt: "feat", topPadding: "pt-0",
        routeNames: ["View Features", "Add Features"],
        routeLink: ["/users/view", "/users/add",]
      },
      {
        routePath: 'pricing', tileName: "Pricing",
        coloredIcon: "assets/icons/colored/dollar.svg",
        uncoloredIcon: "assets/icons/uncolored/dollar.svg",
        iconsAlt: "pricing", topPadding: "pt-0",
        routeNames: ["View Pricing", "Add Pricing"],
        routeLink: ["/users/view", "/users/add",]
      },
      {
        routePath: 'integrations', tileName: "Integrations",
        coloredIcon: "assets/icons/colored/puzzlepiece.svg",
        uncoloredIcon: "assets/icons/uncolored/puzzlepiece.svg",
        iconsAlt: "integrations", topPadding: "pt-0",
        routeNames: ["View Integrations", "Add Integrations"],
        routeLink: ["/users/view", "/users/add",]
      },
    ]
  }

  ngOnInit(): void {
    this.checkScreenSize();
    
    // Subscribe to sidebar state changes
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

  checkScreenSize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 1110; // 768px is Tailwind's 'md' breakpoint
    
    // Close sidebar when switching to mobile if it was open
    if (this.isMobile && !wasMobile) {
      this.layoutService.closeSidebar();
    }
    // Open sidebar when switching to desktop
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
