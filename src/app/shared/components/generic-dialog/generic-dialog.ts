import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-generic-dialog',
  imports: [],
  templateUrl: './generic-dialog.html',
  styleUrl: './generic-dialog.css',
})
export class GenericDialog {

  @Input() title: string = 'Dialog Title';
  @Input() isVisible: boolean = true;
  @Input() showCloseButton: boolean = true;
  @Input() closeOnBackdrop: boolean = true;

  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.isVisible = false;
    this.closed.emit();
  }
}
