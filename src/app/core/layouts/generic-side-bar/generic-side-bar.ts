import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { sidenavcols } from '@app/core/interface/generic-side-nav-interface';
import { AuthService } from '@app/core/auth/services/auth-service';
import { MainLogo } from "@app/core/components/main-logo/main-logo";
import { Layout } from '@app/core/services/layout';
import { LogoutBtn } from "@app/core/components/logout-btn/logout-btn";

@Component({
  selector: 'app-generic-side-bar',
  imports: [RouterLink, NgClass, MainLogo, LogoutBtn],
  templateUrl: './generic-side-bar.html',
  styleUrl: './generic-side-bar.css',
})
export class GenericSideBar<T> implements OnInit {

  @Input() navData: sidenavcols<T>[] = [];

  private routerRef = inject(Router);
  private layoutService = inject(Layout);
  constructor() { }

  ngOnInit() {
    console.log("ng on init");
    const route = this.routerRef.routerState.snapshot.url.toString();
    console.log('active route', route);
    const rout: any = route.split('/').at(1);
    console.log(rout);
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

  openAndNavigate(section: string, route: string) {
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

  
}
