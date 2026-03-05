import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Loaderservice {

isVisible$ : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  showLoader() {
    this.isVisible$.next(true);
  }

  hideLoader() {
    setTimeout(() => {
      this.isVisible$.next(false);
    }, 1500);
  }

  getLoader() {
    return this.isVisible$.asObservable();
  }
}
