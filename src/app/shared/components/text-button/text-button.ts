import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-text-button',
    imports: [TranslateModule],
    template: `
            <button type="button" [disabled]="btnDisable"
            (click)="handleClick()"
            class="h-11 w-45.5 rounded-sm text-primary cursor-pointer border border-primary
                font-worksans text-[15px]" >
            {{ btntext |translate}}
            </button>`,
    // templateUrl: './text-button.html',
    // styleUrl: './text-button.css',
})
export class TextButton {

    @Input({ required: true }) btnDisable!: boolean;
    @Input({ required: true }) btntext!: string;

    @Output() btnClick = new EventEmitter<void>();

    handleClick(): void {
        this.btnClick.emit();
    }

}
