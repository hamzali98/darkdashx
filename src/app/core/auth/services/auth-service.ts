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
  // private readonly REMEMBER_ME = 'remember';

  private routerRef = inject(Router);

  // Save user after login
  login(user: credentials, remember: boolean): void {

    const expiryTime = remember 
    ? Date.now() + 7 * 24 * 60 * 60 * 1000 
    : Date.now() + this.SESSION_DURATION;

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    // localStorage.setItem(this.REMEMBER_ME, remember.toString());
    localStorage.setItem(this.EXPIRY_KEY, expiryTime.toString());
  }

  // rememberMe() {
  //   localStorage.setItem(this.REMEMBER_ME, remember);
  // }

  // Remove user on logout
  logout(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.EXPIRY_KEY);
    // localStorage.removeItem(this.REMEMBER_ME);
    this.routerRef.navigate(['/login']);
  }

  // Check if user exists
  isAuthenticated(): boolean {
    const user = localStorage.getItem(this.USER_KEY);
    const expiry = localStorage.getItem(this.EXPIRY_KEY);

    if (!user || !expiry) return false;

    if (Date.now() > Number(expiry)) {
      this.logout(); // auto logout
      return false;
    }

    return true;
  }

  // Get logged-in user data
  getUser(): credentials | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }
}
