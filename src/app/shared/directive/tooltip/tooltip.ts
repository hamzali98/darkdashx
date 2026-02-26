// import { Directive, Input, ElementRef, HostListener, OnDestroy } from '@angular/core';

// @Directive({
//   selector: '[appTooltip]',
//   standalone: true
// })
// export class TooltipDirective implements OnDestroy {
//   @Input('appTooltip') tooltipText: string = '';
//   @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
//   @Input() tooltipDelay: number = 200;

//   private tooltipEl: HTMLElement | null = null;
//   private showTimeout: any;

//   constructor(private el: ElementRef) {}

//   @HostListener('mouseenter')
//   onMouseEnter() {
//     this.showTimeout = setTimeout(() => this.show(), this.tooltipDelay);
//   }

//   @HostListener('mouseleave')
//   onMouseLeave() {
//     clearTimeout(this.showTimeout);
//     this.hide();
//   }

//   private show() {
//     this.tooltipEl = document.createElement('div');
//     this.tooltipEl.className = `custom-tooltip tooltip-${this.tooltipPosition}`;
//     this.tooltipEl.innerText = this.tooltipText;
//     document.body.appendChild(this.tooltipEl);
//     this.setPosition();
//   }

//   private setPosition() {
//     if (!this.tooltipEl) return;

//     const hostRect = this.el.nativeElement.getBoundingClientRect();
//     const tipRect = this.tooltipEl.getBoundingClientRect();
//     const offset = 10;
//     let top = 0, left = 0;

//     switch (this.tooltipPosition) {
//       case 'top':
//         top  = hostRect.top - tipRect.height - offset + window.scrollY;
//         left = hostRect.left + (hostRect.width - tipRect.width) / 2 + window.scrollX;
//         break;
//       case 'bottom':
//         top  = hostRect.bottom + offset + window.scrollY;
//         left = hostRect.left + (hostRect.width - tipRect.width) / 2 + window.scrollX;
//         break;
//       case 'left':
//         top  = hostRect.top + (hostRect.height - tipRect.height) / 2 + window.scrollY;
//         left = hostRect.left - tipRect.width - offset + window.scrollX;
//         break;
//       case 'right':
//         top  = hostRect.top + (hostRect.height - tipRect.height) / 2 + window.scrollY;
//         left = hostRect.right + offset + window.scrollX;
//         break;
//     }

//     this.tooltipEl.style.top  = `${top}px`;
//     this.tooltipEl.style.left = `${left}px`;
//   }

//   private hide() {
//     if (this.tooltipEl) {
//       this.tooltipEl.remove();
//       this.tooltipEl = null;
//     }
//   }

//   ngOnDestroy() {
//     clearTimeout(this.showTimeout);
//     this.hide();
//   }
// }

import { Directive, Input, ElementRef, HostListener, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') tooltipText: string = '';
  @Input() tooltipDelay: number = 200;

  private tooltipEl: HTMLElement | null = null;
  private showTimeout: any;

  constructor(private el: ElementRef) { }

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event: MouseEvent) {
    this.showTimeout = setTimeout(() => this.show(event), this.tooltipDelay);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.tooltipEl) {
      this.setPosition(event);
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    clearTimeout(this.showTimeout);
    this.hide();
  }

  private show(event: MouseEvent) {
    this.tooltipEl = document.createElement('div');
    this.tooltipEl.className = 'custom-tooltip';
    this.tooltipEl.innerText = this.tooltipText;

    this.tooltipEl.style.position = 'absolute';
    this.tooltipEl.style.pointerEvents = 'none'; // VERY IMPORTANT
    // document.body.appendChild(this.tooltipEl);
    document.body.appendChild(this.tooltipEl);
    requestAnimationFrame(() => {
      this.tooltipEl?.classList.add('show');
    });

    this.setPosition(event);

  }

  // private setPosition(event: MouseEvent) {
  //   if (!this.tooltipEl) return;

  //   const offset = 12;

  //   this.tooltipEl.style.top = `${event.pageY + offset}px`;
  //   this.tooltipEl.style.left = `${event.pageX + offset}px`;
  // }

  private setPosition(event: MouseEvent) {
    if (!this.tooltipEl) return;

    const offset = 12;

    const tooltipRect = this.tooltipEl.getBoundingClientRect();
    const tooltipWidth = tooltipRect.width;
    const tooltipHeight = tooltipRect.height;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = event.clientX + offset;
    let top = event.clientY + offset;

    // 👉 Prevent right overflow
    if (left + tooltipWidth > viewportWidth) {
      left = event.clientX - tooltipWidth - offset;
    }

    // 👉 Prevent bottom overflow
    if (top + tooltipHeight > viewportHeight) {
      top = event.clientY - tooltipHeight - offset;
    }

    // 👉 Prevent left overflow
    if (left < 0) {
      left = offset;
    }

    // 👉 Prevent top overflow
    if (top < 0) {
      top = offset;
    }

    this.tooltipEl.style.left = `${left + window.scrollX}px`;
    this.tooltipEl.style.top = `${top + window.scrollY}px`;
  }

  private hide() {
    if (this.tooltipEl) {
      this.tooltipEl.remove();
      this.tooltipEl = null;
    }
  }

  ngOnDestroy() {
    clearTimeout(this.showTimeout);
    this.hide();
  }
}