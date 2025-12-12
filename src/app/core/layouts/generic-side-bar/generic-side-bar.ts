import { Component, inject, Input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

export interface sidenavcols<T> {
  routePath: string; 
  tileName: string;
  coloredIcon: string;
  uncoloredIcon: string;
  iconsAlt: string;
  topPadding?: string;
  routeNames: string[];
  routeLink: string[];
}

@Component({
  selector: 'app-generic-side-bar',
  imports: [RouterLink, NgClass],
  templateUrl: './generic-side-bar.html',
  styleUrl: './generic-side-bar.css',
})
export class GenericSideBar<T> {

  sideBarOpen = signal(true);
  open = signal<string | null>(null);

  @Input() navData: sidenavcols<T>[] = [];

  private routerRef = inject(Router);

  constructor() {
  }

  ngOnInit() {
    console.log("ng on init");
    const route = this.routerRef.routerState.snapshot.url.toString();
    console.log('active route', route);
    const rout : any = route.split('/').at(1);
    console.log(rout);
    this.onOpen(rout?.toString());
    // if (route.startsWith('/users')) {
    //   this.onOpen('users');
    // } else if (route.startsWith('/settings')) {
    //   this.onOpen('settings');
    // } else if (route.startsWith('/profile')) {
    //   this.onOpen('profile');
    // } else {
    //   this.onOpen('dashboard');
    // }
  }

  openAndNavigate(section: string, route: string) {
    this.onOpen(section);
    this.routerRef.navigate([route]);
  }

  onOpen(section: string) {
    if (section === '') {
      this.open.set('home');
    } else {

      if (section === this.open()) {
        this.open.set(null);
      } else {
        this.open.set(section);
      }
    }
    // this.open.update(v => !v);
  }

  onRoute(route: string) {
    this.routerRef.navigate([route]);
    this.onOpen(route);
  }

  isActive(route: string): boolean {
    if (route === '' || route === '/') {
      return this.routerRef.url === '/' || this.routerRef.url === '';
    }
    return this.routerRef.url.includes(route);
  }

  onSidebarclick() {
    this.sideBarOpen.update(v => !v)
  }
}
