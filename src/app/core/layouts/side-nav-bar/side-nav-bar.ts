import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { Observable } from 'rxjs';
import { SearchBar } from "@app/shared/components/search-bar/search-bar";

@Component({
  selector: 'app-side-nav-bar',
  imports: [RouterLink, NgClass],
  templateUrl: './side-nav-bar.html',
  styleUrl: './side-nav-bar.css',
})
export class SideNavBar implements OnInit {

  sideBarOpen = signal(true);
  open = signal<string | null>(null);

  private routerRef = inject(Router);

  constructor() {
  }

  ngOnInit() {
    console.log("ng on init");
    const route = this.routerRef.routerState.snapshot.url.toString();
    console.log('active route', route);
    // this.onOpen('dashboard');
    if(route.startsWith('/users')){
      this.onOpen('users');
    } else if(route.startsWith('/settings')){
      this.onOpen('settings');
    } else if(route.startsWith('/profile')){
      this.onOpen('profile');
    } else {
      this.onOpen('dashboard');
    }
  }

  openAndNavigate(section: string, route: string) {
  this.onOpen(section);
  this.routerRef.navigate([route]);
}

  onOpen(section: string) {
    if (section === 'home') {
      this.open.set('dashboard');
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
    if (route === '') {
      return this.routerRef.url === '/' || this.routerRef.url === '';
    }
    return this.routerRef.url.includes(route);
  }

  onSidebarclick() {
    this.sideBarOpen.update(v => !v)
  }

}
