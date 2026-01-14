import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DialogData {
  title: string;
  content: string; 
  type: 'session-expired' | 'generic'; 
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {

  private isDialogVisible = new BehaviorSubject<boolean>(false);
  private dialogData = new BehaviorSubject<DialogData | null>(null);

  isVisible$: Observable<boolean> = this.isDialogVisible.asObservable();
  data$: Observable<DialogData | null> = this.dialogData.asObservable();

  constructor() { }

  open(data: DialogData) {
    this.dialogData.next(data);
    this.isDialogVisible.next(true);
  }

  close() {
    this.isDialogVisible.next(false);
    this.dialogData.next(null);
  }

}
