import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface DialogData {
  title: string;
  message: string;
  type: 'session-expired' | 'generic';
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {

  private isDialogVisible = new BehaviorSubject<boolean>(false);
  private dialogData = new BehaviorSubject<DialogData | null>(null);
  private dialogResult = new Subject<boolean>();

  isVisible$: Observable<boolean> = this.isDialogVisible.asObservable();
  data$: Observable<DialogData | null> = this.dialogData.asObservable();

  constructor() { }

  open(data: DialogData) {
    this.dialogData.next(data);
    this.isDialogVisible.next(true);
    return this.dialogResult.asObservable();
  }

  close(result: boolean = false) {
    this.isDialogVisible.next(false);
    this.dialogResult.next(result);
    this.dialogResult.complete();
    this.dialogResult = new Subject<boolean>(); // Reset for next dialog
    this.dialogData.next(null);
  }



}
