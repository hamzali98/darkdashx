import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-submit-button',
  imports: [TranslateModule],
  template: `
            <button [type]="btnType" [disabled]="btnDisable"
            (click)="handleClick()"
            class="h-11 w-45.5 rounded-sm text-primary-text bg-primary 
            cursor-pointer disabled:bg-primary/50 disabled:text-primary-text/50 font-worksans text-[15px] disabled:cursor-not-allowed">
            {{ btntext |translate}}
          </button>`,
  // templateUrl: './submit-button.html',
  // styleUrl: './submit-button.css',
})
export class SubmitButton {

  @Input({ required: true }) btnType!: string;
  @Input({ required: true }) btnDisable!: boolean;
  @Input({ required: true }) btntext!: string;

  @Output() btnClick = new EventEmitter<void>();

  handleClick(): void {
    if (this.btnType !== 'submit') {
      this.btnClick.emit();
    }
  }

}
