import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar-service';
import { SnackbarData, SnackbarType } from '@app/shared/interface/snack-bar.model';
import { NgClass } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-snack-bar',
  imports: [NgClass],
  templateUrl: './snack-bar.html',
  styleUrl: './snack-bar.css',
})
export class SnackBar implements OnInit, OnDestroy {

  currentSnackbar: SnackbarData | null = null;
  isVisible: boolean = false;
  private snackbarSubscription!: Subscription;
  private timerSubscription!: Subscription;

  constructor(
    private snackbarService: SnackBarService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  this.snackbarSubscription =
    this.snackbarService.snackbar$.subscribe(data => {

      this.timerSubscription?.unsubscribe();

      this.currentSnackbar = data;
      this.isVisible = true;
      this.cdr.detectChanges();

      this.timerSubscription = timer(data.duration!).subscribe(() => {
        this.hide();
      });
    });
}



  hide(): void {
    this.isVisible = false;
    this.currentSnackbar = null;

    this.timerSubscription?.unsubscribe();

    this.cdr.detectChanges();
  }



  getTypeClass(): string {
    return this.currentSnackbar ? `snackbar-${this.currentSnackbar.type}` : '';
  }

  getPositionClass(): string {
    return this.currentSnackbar ? `position-${this.currentSnackbar.position}` : 'position-top-center';
  }

  ngOnDestroy(): void {
    this.snackbarSubscription?.unsubscribe();
    this.timerSubscription?.unsubscribe();
  }

}
