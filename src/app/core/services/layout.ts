import { inject, Injectable, Input, OnInit, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { sidenavcols } from '../interface/generic-side-nav-interface';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth-service';

@Injectable({
  providedIn: 'root',
})
export class Layout<T> implements OnInit {
  
  private isSidebarOpenSubject = new BehaviorSubject<boolean>(false);
  isSidebarOpen$ = this.isSidebarOpenSubject.asObservable();

  // sideBarOpen = signal(true);
  open = signal<string | null>(null);

  // @Input() navData: sidenavcols<T>[] = [];

  private routerRef = inject(Router);
  private authService = inject(AuthService);

  constructor() {}

  ngOnInit() {
    // console.log("ng on init");
    const route = this.routerRef.routerState.snapshot.url.toString();
    // console.log('active route', route);
    const rout : any = route.split('/').at(1);
    // console.log(rout);
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

  get username(){
    return this.authService.getUser()?.username ?? "Guest";
  }

  toggleSidebar() {
    this.isSidebarOpenSubject.next(!this.isSidebarOpenSubject.value);
  }

  openSidebar() {
    this.isSidebarOpenSubject.next(true);
  }

  closeSidebar() {
    this.isSidebarOpenSubject.next(false);
  }

  getSidebarState(): boolean {
    return this.isSidebarOpenSubject.value;
  }

  async openAndNavigate(section: string, route: string) {
    const navigateSuccess = await this.routerRef.navigate([route]);
    // this.routerRef.navigate([route]);
    // this.onOpen(section);
    if(navigateSuccess){
      this.onOpen(section);
    }
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

  onLogout(){
    this.authService.logout();
  }
}
