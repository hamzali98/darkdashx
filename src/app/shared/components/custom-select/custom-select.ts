import { Component, Input, forwardRef, ElementRef, HostListener, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export interface SelectOption {
  key: string;
  value: any;
}

@Component({
  selector: 'app-custom-select',
  imports: [CommonModule, TranslateModule],
  templateUrl: './custom-select.html',
  styleUrl: './custom-select.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelect),
      multi: true
    }
  ]
})
export class CustomSelect implements ControlValueAccessor {

  @Input() options: SelectOption[] = [];
  @Input() placeholder = 'Select';
  @Input() hasError: boolean | undefined = false;
  @Input() isValid = false;
  @Input() errorMessage = '';
  @Input() validMessage = 'LOOKS_GOOD';
  @Input() hintMessage = '';

  isOpen = signal(false);
  selectedOption = signal<SelectOption | null>(null);
  isDisabled = signal(false);

  // ControlValueAccessor callbacks
  private onChange: (val: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elRef: ElementRef) {}

  // Close dropdown on outside click
  @HostListener('document:click', ['$event'])
  onOutsideClick(event: Event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  toggle() {
    if (!this.isDisabled()) {
      this.isOpen.set(!this.isOpen());
    }
  }

  select(option: SelectOption) {
    this.selectedOption.set(option);
    this.isOpen.set(false);
    this.onChange(option.value);   // 👈 notifies the form
    this.onTouched();              // 👈 marks as touched
  }

  // Called by Angular to write value into component
  writeValue(value: any): void {
    const match = this.options.find(o => o.value === value) ?? null;
    this.selectedOption.set(match);
  }

  registerOnChange(fn: any)    { this.onChange = fn; }
  registerOnTouched(fn: any)   { this.onTouched = fn; }
  setDisabledState(disabled: boolean) { this.isDisabled.set(disabled); }
}
