import { Injectable, ApplicationRef, createComponent, EnvironmentInjector } from '@angular/core';
import { TickAnimation } from '@app/shared/components/tick-animation/tick-animation';

@Injectable({ providedIn: 'root' })
export class TickAnimationService {

  private componentRef: any = null;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) { }

  show(message = 'Success', duration = 2500): void {
    this.destroy(); // clean up any existing instance

    // Dynamically create the component
    const ref = createComponent(TickAnimation, {
      environmentInjector: this.injector
    });

    ref.instance.message = message;
    ref.instance.visible = false;

    this.appRef.attachView(ref.hostView);
    document.body.appendChild(ref.location.nativeElement);
    this.componentRef = ref;

    // Trigger visibility on next tick (allows CSS transition)
    setTimeout(() => {
      ref.instance.visible = true;
      ref.changeDetectorRef.detectChanges();
    }, 10);

    // Auto-dismiss after duration
    setTimeout(() => this.hide(), duration);
  }

  hide(): void {
    if (this.componentRef) {
      this.componentRef.instance.visible = false;
      this.componentRef.changeDetectorRef.detectChanges();
      setTimeout(() => this.destroy(), 300); // wait for fade-out
    }
  }

  private destroy(): void {
    if (this.componentRef) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}