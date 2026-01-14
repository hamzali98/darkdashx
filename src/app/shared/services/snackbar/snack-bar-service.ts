import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { SnackbarData, SnackbarType } from '@app/shared/interface/snack-bar.model';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  // Subject acts as an Observable that components can subscribe to
  private snackbarSubject = new Subject<SnackbarData>();

  // Expose the Observable stream for the Snackbar component to listen on
  snackbar$: Observable<SnackbarData> = this.snackbarSubject.asObservable();

  constructor() { }

  /**
   * Main method to show the snackbar
   * @param data - The message, type, and optional settings
   */
  show(data: SnackbarData): void {
    // Apply default duration if not specified
    data.duration = data.duration ?? 3000;
    // Apply default position
    data.position = data.position ?? 'top-center';
    
    // Push the new snackbar data to all subscribers (the SnackbarComponent)
    this.snackbarSubject.next(data);
  }

  // Convenience methods for different types
  success(message: string, duration?: number, position?: SnackbarData['position']): void {
    this.show({ message, type: 'success', duration, position });
  }

  error(message: string, duration?: number, position?: SnackbarData['position']): void {
    this.show({ message, type: 'error', duration, position });
  }

  warning(message: string, duration?: number, position?: SnackbarData['position']): void {
    this.show({ message, type: 'warning', duration, position });
  }
  
  general(message: string, duration?: number, position?: SnackbarData['position']): void {
    this.show({ message, type: 'general', duration, position });
  }
}
