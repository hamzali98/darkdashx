import {
  Component, Input, forwardRef, ElementRef,
  HostListener, signal, ContentChild, TemplateRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SelectOption } from '../custom-select/custom-select';

export type InputType = 'text' | 'password' | 'email' | 'number' | 'date' | 'select' | 'textarea';

export interface InputIconAction {
  iconPath: string;       // path to svg asset
  activeIconPath?: string; // optional alternate icon when active
  action: () => void;     // what to do on click
  isActive?: () => boolean; // controls which icon shows
}

export interface CustomInputConfig {
  ngclass: string;
  type: InputType;
  required?: boolean;
  startIcon?: string;
  label: string;
  labelFor: string;
  labelIcon?: string;       // asset path e.g. 'assets/icons/white/password.svg'
  placeholder?: string;
  inputId: string;
  inputName: string;
  errorMessage: string;
  hintMessage: string;
  autocomplete?: string;
  minDate?: string;
  maxDate?: string;
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
  @Input() isValid = false;

  // Internal state
  value = signal<any>('');
  isDisabled = signal(false);
  showPassword = signal(false);

  // Date picker state
  isOpen = signal(false);
  viewYear  = signal(new Date().getFullYear());
  viewMonth = signal(new Date().getMonth());
  selectedDate = signal<Date | null>(null);
  viewMode = signal<'days' | 'months' | 'years'>('days');
  // drop down position
  dropdownPosition = signal<'bottom' | 'top'>('bottom');
private triggerEl: HTMLElement | null = null;

  // Select state
  selectedOption = signal<SelectOption | null>(null);

  private onChange: (val: any) => void = () => {};
  onTouched: () => void = () => {};

  readonly MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  readonly DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  constructor(private elRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onOutsideClick(e: Event) {
    if (!this.elRef.nativeElement.contains(e.target)) this.isOpen.set(false);
  }

  // ─── Shared ───────────────────────────────────────────
  get inputType(): string {
    if (this.config.type === 'password') return this.showPassword() ? 'text' : 'password';
    if (this.config.type === 'date' || this.config.type === 'select') return 'text';
    return this.config.type;
  }

  onInputChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
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

private calculatePosition() {
  if (!this.triggerEl) return;
  const rect = this.triggerEl.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  const dropdownHeight = 208; // max-h-52 = 208px

  this.dropdownPosition.set(spaceBelow < dropdownHeight && spaceAbove > spaceBelow ? 'top' : 'bottom');
}

  // ─── Date ─────────────────────────────────────────────
  get displayDate(): string {
    const d = this.selectedDate();
    if (!d) return '';
    return `${String(d.getDate()).padStart(2,'0')} ${this.MONTHS[d.getMonth()]} ${d.getFullYear()}`;
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

  toggleCalendar() {
    if (!this.isDisabled()) {
      this.isOpen.set(!this.isOpen());
      if (this.isOpen()) this.viewMode.set('days');
    }
  }

  prevMonth() {
    this.viewMonth() === 0 ? (this.viewMonth.set(11), this.viewYear.update(y => y-1)) : this.viewMonth.update(m => m-1);
  }
  nextMonth() {
    this.viewMonth() === 11 ? (this.viewMonth.set(0), this.viewYear.update(y => y+1))
                            : this.viewMonth.update(m => m+1);
  }
  prevYear()  { this.viewYear.update(y => y-1); }
  nextYear()  { this.viewYear.update(y => y+1); }
  prevYears() { this.viewYear.update(y => y-12); }
  nextYears() { this.viewYear.update(y => y+12); }

  selectDay(date: Date | null) {
    if (!date || this.isDayDisabled(date)) return;
    this.selectedDate.set(date);
    this.isOpen.set(false);
    const val = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
    this.onChange(val);
    this.onTouched();
  }

  selectToday()            { this.selectDay(new Date()); }
  selectMonth(month: number) { this.viewMonth.set(month); this.viewMode.set('days'); }
  selectYear(year: number)   { this.viewYear.set(year);   this.viewMode.set('months'); }

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
    const iso = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
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

  registerOnChange(fn: any)    { this.onChange = fn; }
  registerOnTouched(fn: any)   { this.onTouched = fn; }
  setDisabledState(d: boolean) { this.isDisabled.set(d); }
}
