import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { SnackbarData, SnackbarType } from '@app/shared/interface/snack-bar.model';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {

  private snackbarSubject = new Subject<SnackbarData>();

  snackbar$: Observable<SnackbarData> = this.snackbarSubject.asObservable();

  constructor() { }

  show(data: SnackbarData): void {
    data.duration = data.duration ?? 3000;
    data.position = data.position ?? 'top-center';
    
    this.snackbarSubject.next(data);
  }

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
