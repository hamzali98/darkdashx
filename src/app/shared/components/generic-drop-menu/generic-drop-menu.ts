import { NgClass } from '@angular/common';
import { Component, Input, signal } from '@angular/core';

export interface SelectOption {
  key: string;
  value: any;
}

@Component({
  selector: 'app-generic-drop-menu',
  imports: [NgClass],
  templateUrl: './generic-drop-menu.html',
  styleUrl: './generic-drop-menu.css',
})
export class GenericDropMenu {

  isOpen= signal(false);

    selectedOption = signal<SelectOption | null>(null);
  
  dropdownPosition = signal<'bottom' | 'top'>('bottom');


  @Input({required : true}) selectOptions! : any;

   // ─── Select ───────────────────────────────────────────
    selectOption(
      option: SelectOption
    ) {
      // this.selectedOption.set(option);
      // this.isOpen.set(false);
      // this.onChange(option.value);
      // this.onTouched();
    }
}
