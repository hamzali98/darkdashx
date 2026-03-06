import {
  Component, Input, forwardRef, ElementRef,
  HostListener, signal, computed
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-custom-date',
  imports: [CommonModule, TranslateModule],
  templateUrl: './custom-date.html',
  styleUrl: './custom-date.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDate),
      multi: true
    }
  ]
})
export class CustomDate implements ControlValueAccessor {

  @Input() placeholder = 'Select Date';
  @Input() hasError: boolean|undefined = false;
  @Input() isValid = false;
  @Input() errorMessage = '';
  @Input() validMessage = 'LOOKS_GOOD';
  @Input() hintMessage = '';
  @Input() minDate: string = '';
  @Input() maxDate: string = '';

  isOpen = signal(false);
  isDisabled = signal(false);

  // Calendar state
  viewYear = signal(new Date().getFullYear());
  viewMonth = signal(new Date().getMonth());  // 0-11
  selectedDate = signal<Date | null>(null);
  viewMode = signal<'days' | 'months' | 'years'>('days');

  private onChange: (val: any) => void = () => { };
  private onTouched: () => void = () => { };

  readonly MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  readonly DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  constructor(private elRef: ElementRef) { }

  @HostListener('document:click', ['$event'])
  onOutsideClick(e: Event) {
    if (!this.elRef.nativeElement.contains(e.target)) {
      this.isOpen.set(false);
    }
  }

  get displayValue(): string {
    const d = this.selectedDate();
    if (!d) return '';
    return `${String(d.getDate()).padStart(2, '0')} ${this.MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }

  // Computed calendar grid
  get calendarDays(): (Date | null)[] {
    const year = this.viewYear();
    const month = this.viewMonth();
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

  selectToday() {
  this.selectDay(new Date());
}

  toggle() {
    if (this.isDisabled()) return;
    this.isOpen.set(!this.isOpen());
    if (this.isOpen()) this.viewMode.set('days');
  }

  prevMonth() {
    if (this.viewMonth() === 0) { this.viewMonth.set(11); this.viewYear.update(y => y - 1); }
    else this.viewMonth.update(m => m - 1);
  }

  nextMonth() {
    if (this.viewMonth() === 11) { this.viewMonth.set(0); this.viewYear.update(y => y + 1); }
    else this.viewMonth.update(m => m + 1);
  }

  prevYear() { this.viewYear.update(y => y - 1); }
  nextYear() { this.viewYear.update(y => y + 1); }
  prevYears() { this.viewYear.update(y => y - 12); }
  nextYears() { this.viewYear.update(y => y + 12); }

  selectDay(date: Date | null) {
    if (!date || this.isDayDisabled(date)) return;
    this.selectedDate.set(date);
    this.isOpen.set(false);
    // Emit as YYYY-MM-DD string (matches formControlName expectations)
    const val = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    this.onChange(val);
    this.onTouched();
  }

  selectMonth(month: number) {
    this.viewMonth.set(month);
    this.viewMode.set('days');
  }

  selectYear(year: number) {
    this.viewYear.set(year);
    this.viewMode.set('months');
  }

  isSelected(date: Date | null): boolean {
    if (!date || !this.selectedDate()) return false;
    const s = this.selectedDate()!;
    return date.getDate() === s.getDate() &&
      date.getMonth() === s.getMonth() &&
      date.getFullYear() === s.getFullYear();
  }

  isToday(date: Date | null): boolean {
    if (!date) return false;
    const t = new Date();
    return date.getDate() === t.getDate() &&
      date.getMonth() === t.getMonth() &&
      date.getFullYear() === t.getFullYear();
  }

  isDayDisabled(date: Date | null): boolean {
    if (!date) return false;
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    if (this.minDate && iso < this.minDate) return true;
    if (this.maxDate && iso > this.maxDate) return true;
    return false;
  }

  // ControlValueAccessor
  writeValue(value: string): void {
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
  }

  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }
  setDisabledState(d: boolean) { this.isDisabled.set(d); }
}
