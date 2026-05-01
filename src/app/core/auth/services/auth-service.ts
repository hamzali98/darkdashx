import { inject, Injectable } from '@angular/core';
import { credentials } from '../interface/credentials';
import { Router } from '@angular/router';
import { fromEvent, merge, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { DialogService } from '@app/shared/services/dialog-service/dialog';
import { Loaderservice } from '@app/shared/services/loader/loaderservice';
import { TranslateService } from '@ngx-translate/core';

export type LogoutReason = 'manual' | 'expired' | 'none';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly USER_KEY = 'user';
  private readonly EXPIRY_KEY = 'session_expiry';
  private readonly LOGOUT_REASON_KEY = 'logout_reason';
  // private readonly SESSION_DURATION = 30 * 1000; // 30 seconds for testing
  private readonly SESSION_DURATION = 15 * 60 * 1000; // 15 minutes
  // private readonly REMEMBER_DURATION = 15 * 60 * 1000; // 15 minutes
  private readonly REMEMBER_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

  private routerRef = inject(Router);
  private loaderService = inject(Loaderservice);
  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService);

  private destroy$ = new Subject<void>();
  private isRemembered: boolean = false;
  private isTrackingActivity: boolean = false;

  constructor() {
    // Check if user has "remember me" enabled
    const user = localStorage.getItem(this.USER_KEY);
    if (user) {
      this.isRemembered = this.checkIfRemembered();
      if (!this.isRemembered) {
        this.startActivityTracking();
      }
    }
  }

  login(user: credentials, remember: boolean): void {
    this.isRemembered = remember;

    const expiryTime = remember
      ? Date.now() + this.REMEMBER_DURATION
      : Date.now() + this.SESSION_DURATION;

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.EXPIRY_KEY, expiryTime.toString());
    localStorage.setItem('remember_me', remember.toString());
    localStorage.removeItem(this.LOGOUT_REASON_KEY); // Clear any previous logout reason

    // Only track activity if not "remember me"
    if (!remember) {
      this.startActivityTracking();
    }
  }

  logout(reason: LogoutReason = 'manual'): void {
    // Store the logout reason
    localStorage.setItem(this.LOGOUT_REASON_KEY, reason);

    // Don't complete destroy$ - just emit to stop current subscriptions
    this.destroy$.next();
    this.isTrackingActivity = false;

    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.EXPIRY_KEY);
    localStorage.removeItem('remember_me');

    this.loaderService.hideLoader();
    this.routerRef.navigate(['/auth/login']);

  }

  isAuthenticated(): boolean {
    const user = localStorage.getItem(this.USER_KEY);
    const expiry = localStorage.getItem(this.EXPIRY_KEY);


    if (!user || !expiry) return false;

    if (Date.now() > Number(expiry)) {
      this.dialogService.open({
        actbtn: this.translateService.instant('Login Again'),
        title: `⚠️ ${this.translateService.instant('Session Expired')}`,
        message: this.translateService.instant('Session_expired_msg'),
        type: 'session-expired'
      });
      this.logout('expired'); // Mark as expired logout
      return false;
    }
    return true;
  }

  getUser(): credentials | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  getLastLogoutReason(): LogoutReason {
    return (localStorage.getItem(this.LOGOUT_REASON_KEY) as LogoutReason) || 'none';
  }

  clearLogoutReason(): void {
    localStorage.removeItem(this.LOGOUT_REASON_KEY);
  }

  // Check if user has "remember me" enabled
  private checkIfRemembered(): boolean {
    const rememberMe = localStorage.getItem('remember_me');
    return rememberMe === 'true';
  }

  // Start tracking user activity
  private startActivityTracking(): void {
    // Prevent duplicate tracking
    if (this.isTrackingActivity) return;

    this.isTrackingActivity = true;

    // Track various user activities
    const activity$ = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'mousedown'),
      fromEvent(document, 'keydown'),
      fromEvent(document, 'scroll'),
      fromEvent(document, 'touchstart'),
      fromEvent(document, 'click')
    );

    // Debounce to avoid updating too frequently
    activity$
      .pipe(
        debounceTime(1000), // Wait 1 second after last activity
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.resetSessionTimer();
      });
  }

  // Reset the session expiry time on activity
  private resetSessionTimer(): void {
    if (!this.isAuthenticated() || this.isRemembered) return;

    const newExpiryTime = Date.now() + this.SESSION_DURATION;
    localStorage.setItem(this.EXPIRY_KEY, newExpiryTime.toString());

    // Debug log to verify it's being called
  }

  // Manual method to reset session (useful for API calls)
  refreshSession(): void {
    if (!this.isRemembered && this.isAuthenticated()) {
      this.resetSessionTimer();
    }
  }
}