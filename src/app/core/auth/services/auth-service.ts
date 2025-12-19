import { Injectable } from '@angular/core';
import { credentials } from '../interface/credentials';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly USER_KEY = 'user';
  private readonly REMEMBER_ME = 'remember';

  // Save user after login
  login(user: credentials): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  rememberMe(){
    localStorage.setItem(this.REMEMBER_ME, "true");
  }

  // Remove user on logout
  logout(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.REMEMBER_ME);
  }

  // Check if user exists
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.USER_KEY);
  }

  // Get logged-in user data
  getUser(): credentials | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }
}
