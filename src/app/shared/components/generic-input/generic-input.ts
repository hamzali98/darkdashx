import {
  Component, Input, forwardRef, ElementRef,
  HostListener, signal, ContentChild, TemplateRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'date' | 'select' | 'textarea';

export interface InputIconAction {
  iconPath: string;       // path to svg asset
  activeIconPath?: string; // optional alternate icon when active
  action: () => void;     // what to do on click
  isActive?: () => boolean; // controls which icon shows
}

export interface SelectOption {
  key: string;
  value: any;
}

export interface CustomInputConfig {
  ngclass: string;
  type: InputType;
  required?: boolean;
  startIcon?: string;
  autoSize?: boolean;
  label?: string;
  labelFor?: string;
  labelIcon?: string;       // asset path e.g. 'assets/icons/white/password.svg'
  placeholder?: string;
  inputId: string;
  inputName: string;
  errorMessage: string;
  errorMessage2?: string;
  showStrength?: boolean;
  autocomplete?: string;
  min?: number; // for type='number'
  max?: number; // for type='number'
  step?: number; // for type='number
  minDate?: string; // for type='date'
  maxDate?: string; // for type='date'
  selectOptions?: SelectOption[];  // for type='select'
  iconActions?: InputIconAction[]; // clickable icons inside input (e.g. eye toggle)
}

@Component({
  selector: 'app-generic-input',
  imports: [CommonModule, TranslateModule, NgClass],
  templateUrl: './generic-input.html',
  styleUrl: './generic-input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GenericInput),
      multi: true
    }
  ]
})
export class GenericInput implements ControlValueAccessor {
  @Input({ required: true }) config!: CustomInputConfig;
  @Input() hasError: boolean | undefined = false;
  @Input() passwordStrengthColor!: string;
  @Input() passwordStrengthProgress!: string;
  @Input() passwordStrength!: string;
  @Input() isInvalid: boolean | undefined = false;
  @Input() isValid = false;

  // Internal state
  value = signal<any>('');
  isDisabled = signal(false);
  showPassword = signal(false);

  // Date picker state
  isOpen = signal(false);
  viewYear = signal(new Date().getFullYear());
  viewMonth = signal(new Date().getMonth());
  selectedDate = signal<Date | null>(null);
  viewMode = signal<'days' | 'months' | 'years'>('days');
  // drop down position
  dropdownPosition = signal<'bottom' | 'top'>('bottom');
  private triggerEl: HTMLElement | null = null;

  // Select state
  selectedOption = signal<SelectOption | null>(null);

  private onChange: (val: any) => void = () => { };
  onTouched: () => void = () => { };

  readonly MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  readonly DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  constructor(private elRef: ElementRef) { }

  @HostListener('document:click', ['$event'])
  onOutsideClick(e: Event) {
    if (!this.elRef.nativeElement.contains(e.target)) this.isOpen.set(false);
  }

  // ─── Shared ───────────────────────────────────────────
  get inputType(): string {
    if (this.config.type === 'tel') return 'number';
    if (this.config.type === 'password') return this.showPassword() ? 'text' : 'password';
    if (this.config.type === 'date' || this.config.type === 'select') return 'text';
    return this.config.type;
  }

  private calculatePosition() {
    if (!this.triggerEl) return;
    const rect = this.triggerEl.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownHeight = 208; // max-h-52 = 208px
    this.dropdownPosition.set(spaceBelow < dropdownHeight && spaceAbove > spaceBelow ? 'top' : 'bottom');
  }

  // onInputChange(event: Event) {
  //   const val = (event.target as HTMLInputElement).value;
  //   this.value.set(val);
  //   this.onChange(val);
  //   this.onTouched();
  // }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (this.config.type === 'number') {
      // Strip non-numeric characters (allow minus and dot for decimals)
      let sanitized = input.value.replace(/[^0-9.\-]/g, '');

      // Prevent multiple dots
      const parts = sanitized.split('.');
      if (parts.length > 2) sanitized = parts[0] + '.' + parts.slice(1).join('');

      // Enforce min/max only when user finishes typing a valid number
      const num = parseFloat(sanitized);

      if (!isNaN(num)) {
        if (this.config.max !== undefined && num > this.config.max) {
          sanitized = String(this.config.max);
        }
        if (this.config.min !== undefined && num < this.config.min) {
          sanitized = String(this.config.min);
        }
      }

      // Update the input visually if sanitized value differs
      if (input.value !== sanitized) {
        input.value = sanitized;
      }

      this.value.set(sanitized);
      this.onChange(sanitized === '' ? null : isNaN(parseFloat(sanitized)) ? null : parseFloat(sanitized));
    } else {
      const val = input.value;
      this.value.set(val);
      this.onChange(val);
    }

    this.onTouched();
  }

  togglePassword() { this.showPassword.update(v => !v); }

  // ─── Select ───────────────────────────────────────────
  selectOption(option: SelectOption) {
    this.selectedOption.set(option);
    this.isOpen.set(false);
    this.onChange(option.value);
    this.onTouched();
  }

  toggleDropdown(event: MouseEvent) {
    if (!this.isDisabled()) {
      this.triggerEl = event.currentTarget as HTMLElement;
      this.calculatePosition();
      this.isOpen.set(!this.isOpen());
    }
  }



  // ─── Number ─────────────────────────────────────────────

  get maxLength() {
    return this.config.max ? this.config.max.toString().length : undefined;
  }

  get minLength() {
    return this.config.min ? this.config.min.toString().length : undefined;
  }

  get steps() {
    return this.config.step ? (this.config.step % 1 === 0 ? 1 : this.config.step.toString().split('.')[1].length) : 0;
  }

  increment() {
    const current = parseFloat(this.value()) || 0;
    const step = this.config.step ?? 1;
    const max = this.config.max;
    const newVal = parseFloat((current + step).toFixed(10));
    if (max === undefined || newVal <= max) {
      this.value.set(newVal);
      this.onChange(newVal);
      this.onTouched();
    }
  }

  decrement() {
    const current = parseFloat(this.value()) || 0;
    const step = this.config.step ?? 1;
    const min = this.config.min;
    const newVal = parseFloat((current - step).toFixed(10));
    if (min === undefined || newVal >= min) {
      this.value.set(newVal);
      this.onChange(newVal);
      this.onTouched();
    }
  }

  onNumberKeyDown(event: KeyboardEvent) {
    const allowed = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End'
    ];

    // Allow: ctrl/cmd + a, c, v, x
    if (allowed.includes(event.key)) return;
    if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) return;

    // Allow minus only at position 0 and only if min allows negatives
    if (event.key === '-') {
      const input = event.target as HTMLInputElement;
      if (input.selectionStart === 0 && (this.config.min === undefined || this.config.min < 0)) return;
      event.preventDefault();
      return;
    }

    // Allow dot only if step has decimals and no dot exists yet
    if (event.key === '.') {
      const input = event.target as HTMLInputElement;
      const allowDecimals = this.config.step !== undefined && !Number.isInteger(this.config.step);
      if (allowDecimals && !input.value.includes('.')) return;
      event.preventDefault();
      return;
    }

    // Block anything that's not a digit
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  onNumberBlur(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    let num = parseFloat(input.value);

    if (isNaN(num)) {
      // Reset to min or 0 if empty and invalid
      const fallback = this.config.min ?? 0;
      input.value = String(fallback);
      this.value.set(String(fallback));
      this.onChange(fallback);
      return;
    }

    // Clamp on blur
    if (this.config.max !== undefined && num > this.config.max) num = this.config.max;
    if (this.config.min !== undefined && num < this.config.min) num = this.config.min;

    input.value = String(num);
    this.value.set(String(num));
    this.onChange(num);
    this.onTouched();
  }

  // ─── Date ─────────────────────────────────────────────
  get displayDate(): string {
    const d = this.selectedDate();
    if (!d) return '';
    return `${String(d.getDate()).padStart(2, '0')} ${this.MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }

  get calendarDays(): (Date | null)[] {
    const year = this.viewYear(), month = this.viewMonth();
    const first = new Date(year, month, 1).getDay();
    const total = new Date(year, month + 1, 0).getDate();
    const days: (Date | null)[] = [];
    for (let i = 0; i < first; i++) days.push(null);
    for (let d = 1; d <= total; d++) days.push(new Date(year, month, d));
    return days;
  }

  get yearRange(): number[] {
    const base = Math.floor(this.viewYear() / 12) * 12;
    return Array.from({ length: 12 }, (_, i) => base + i);
  }

  toggleCalendar(event: MouseEvent) {
    // if (!this.isDisabled()) {
    //   this.isOpen.set(!this.isOpen());
    //   if (this.isOpen()) this.viewMode.set('days');
    // }

    if (!this.isDisabled()) {
      this.triggerEl = event.currentTarget as HTMLElement;
      this.calculatePosition();
      this.isOpen.set(!this.isOpen());
      if (this.isOpen()) this.viewMode.set('days');
    }
  }


  prevMonth() {
    this.viewMonth() === 0 ? (this.viewMonth.set(11), this.viewYear.update(y => y - 1)) : this.viewMonth.update(m => m - 1);
  }
  nextMonth() {
    this.viewMonth() === 11 ? (this.viewMonth.set(0), this.viewYear.update(y => y + 1))
      : this.viewMonth.update(m => m + 1);
  }
  prevYear() { this.viewYear.update(y => y - 1); }
  nextYear() { this.viewYear.update(y => y + 1); }
  prevYears() { this.viewYear.update(y => y - 12); }
  nextYears() { this.viewYear.update(y => y + 12); }

  selectDay(date: Date | null) {
    if (!date || this.isDayDisabled(date)) return;
    this.selectedDate.set(date);
    this.isOpen.set(false);
    const val = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    this.onChange(val);
    this.onTouched();
  }

  selectToday() { this.selectDay(new Date()); }
  selectMonth(month: number) { this.viewMonth.set(month); this.viewMode.set('days'); }
  selectYear(year: number) { this.viewYear.set(year); this.viewMode.set('months'); }

  isSelected(date: Date | null): boolean {
    if (!date || !this.selectedDate()) return false;
    const s = this.selectedDate()!;
    return date.getDate() === s.getDate() && date.getMonth() === s.getMonth() && date.getFullYear() === s.getFullYear();
  }

  isToday(date: Date | null): boolean {
    if (!date) return false;
    const t = new Date();
    return date.getDate() === t.getDate() && date.getMonth() === t.getMonth() && date.getFullYear() === t.getFullYear();
  }

  isDayDisabled(date: Date | null): boolean {
    if (!date) return false;
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    if (this.config.minDate && iso < this.config.minDate) return true;
    if (this.config.maxDate && iso > this.config.maxDate) return true;
    return false;
  }

  // ─── ControlValueAccessor ─────────────────────────────
  writeValue(value: any): void {
    if (this.config.type === 'select') {
      const match = this.config.selectOptions?.find(o => o.value === value) ?? null;
      this.selectedOption.set(match);
    } else if (this.config.type === 'date') {
      if (value) {
        const d = new Date(value);
        if (!isNaN(d.getTime())) {
          this.selectedDate.set(d);
          this.viewYear.set(d.getFullYear());
          this.viewMonth.set(d.getMonth());
        }
      } else {
        this.selectedDate.set(null);
      }
    } else {
      this.value.set(value ?? '');
    }
  }

  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }
  setDisabledState(d: boolean) { this.isDisabled.set(d); }
}
