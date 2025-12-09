import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Loaderservice {
  
  loader = signal(false);

  showLoader(){
    this.loader.set(true);
  }

  hideLoader(){
    setInterval(() => {
      this.loader.set(false);
    }, 2000);

  }

  getLoader(){
    return this.loader();
  }
}
