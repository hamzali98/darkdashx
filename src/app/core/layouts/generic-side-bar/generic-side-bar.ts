import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { sidenavcols } from '@app/core/interface/generic-side-nav-interface';
import { AuthService } from '@app/core/auth/services/auth-service';
import { MainLogo } from "@app/shared/components/main-logo/main-logo";
import { Layout } from '@app/core/services/layout';

@Component({
  selector: 'app-generic-side-bar',
  imports: [RouterLink, NgClass, MainLogo],
  templateUrl: './generic-side-bar.html',
  styleUrl: './generic-side-bar.css',
})
export class GenericSideBar<T> implements OnInit {

  // sideBarOpen = signal(true);
  // open = signal<string | null>(null);

  @Input() navData: sidenavcols<T>[] = [];

  private routerRef = inject(Router);
  // private authService = inject(AuthService);
  private layoutService = inject(Layout);
  // constructor() {}

  ngOnInit() {
    console.log("ng on init");
    const route = this.routerRef.routerState.snapshot.url.toString();
    console.log('active route', route);
    const rout : any = route.split('/').at(1);
    console.log(rout);
    // this.onOpen(rout?.toString());
    this.layoutService.onOpen(rout.toString());
  //   // if (route.startsWith('/users')) {
  //   //   this.onOpen('users');
  //   // } else if (route.startsWith('/settings')) {
  //   //   this.onOpen('settings');
  //   // } else if (route.startsWith('/profile')) {
  //   //   this.onOpen('profile');
  //   // } else {
  //   //   this.onOpen('dashboard');
  //   // }
  }

  get open() {
    return this.layoutService.open();
  }

  get username() {
    return this.layoutService.username;
  }

  // get username(){
  //   return this.authService.getUser()?.username ?? "Guest";
  // }

  openAndNavigate(section: string, route: string) {
    this.layoutService.openAndNavigate(section, route);
  //   this.onOpen(section);
  //   this.routerRef.navigate([route]);
  }

  // onOpen(section: string) {
  //   if (section === '') {
  //     this.open.set('home');
  //   } else {

  //     if (section === this.open()) {
  //       this.open.set(null);
  //     } else {
  //       this.open.set(section);
  //     }
  //   }
  //   // this.open.update(v => !v);
  // }

  onRoute(route: string) {
    this.layoutService.onRoute(route);
  //   this.routerRef.navigate([route]);
  //   this.onOpen(route);
  }

  isActive(route: string): boolean {
    return this.layoutService.isActive(route);
  //   if (route === '' || route === '/') {
  //     return this.routerRef.url === '/' || this.routerRef.url === '';
  //   }
  //   return this.routerRef.url.includes(route);
  }

  // onSidebarclick() {
  //   this.sideBarOpen.update(v => !v)
  // }

  onLogout() {
    this.layoutService.onLogout();
  }
}
