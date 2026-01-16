import { inject, Injectable } from '@angular/core';
import { credentials } from '../interface/credentials';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly USER_KEY = 'user';

  private readonly EXPIRY_KEY = 'session_expiry';
  private readonly SESSION_DURATION = 60 * 1000;

  private routerRef = inject(Router);

  login(user: credentials, remember: boolean): void {

    const expiryTime = remember 
    ? Date.now() + 7 * 24 * 60 * 60 * 1000 
    : Date.now() + this.SESSION_DURATION;

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.EXPIRY_KEY, expiryTime.toString());
  }

  logout(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.EXPIRY_KEY);
    this.routerRef.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const user = localStorage.getItem(this.USER_KEY);
    const expiry = localStorage.getItem(this.EXPIRY_KEY);

    if (!user || !expiry) return false;

    if (Date.now() > Number(expiry)) {
      this.logout(); 
      return false;
    }
    return true;
  }

  getUser(): credentials | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }
}
