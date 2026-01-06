import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DialogData {
  title: string;
  content: string; // Generic string content for simplicity
  type: 'session-expired' | 'generic'; // Use 'session-expired' for your specific use case
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
    // Optionally clear data after closing
    this.dialogData.next(null);
  }

}
