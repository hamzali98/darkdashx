import { Directive, Input, ElementRef, HostListener, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') tooltipText: string = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() tooltipDelay: number = 200;

  private tooltipEl: HTMLElement | null = null;
  private showTimeout: any;

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.showTimeout = setTimeout(() => this.show(), this.tooltipDelay);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    clearTimeout(this.showTimeout);
    this.hide();
  }

  private show() {
    this.tooltipEl = document.createElement('div');
    this.tooltipEl.className = `custom-tooltip tooltip-${this.tooltipPosition}`;
    this.tooltipEl.innerText = this.tooltipText;
    document.body.appendChild(this.tooltipEl);
    this.setPosition();
  }

  private setPosition() {
    if (!this.tooltipEl) return;

    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const tipRect = this.tooltipEl.getBoundingClientRect();
    const offset = 10;
    let top = 0, left = 0;

    switch (this.tooltipPosition) {
      case 'top':
        top  = hostRect.top - tipRect.height - offset + window.scrollY;
        left = hostRect.left + (hostRect.width - tipRect.width) / 2 + window.scrollX;
        break;
      case 'bottom':
        top  = hostRect.bottom + offset + window.scrollY;
        left = hostRect.left + (hostRect.width - tipRect.width) / 2 + window.scrollX;
        break;
      case 'left':
        top  = hostRect.top + (hostRect.height - tipRect.height) / 2 + window.scrollY;
        left = hostRect.left - tipRect.width - offset + window.scrollX;
        break;
      case 'right':
        top  = hostRect.top + (hostRect.height - tipRect.height) / 2 + window.scrollY;
        left = hostRect.right + offset + window.scrollX;
        break;
    }

    this.tooltipEl.style.top  = `${top}px`;
    this.tooltipEl.style.left = `${left}px`;
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