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

    // 🔥 REQUIRED in zoneless Angular
    this.cdr.detectChanges();
  }



  // Getter to apply the appropriate CSS class for the type
  getTypeClass(): string {
    return this.currentSnackbar ? `snackbar-${this.currentSnackbar.type}` : '';
  }

  // Getter to apply the appropriate CSS class for the position
  getPositionClass(): string {
    // Maps 'top-center' to 'position-top-center' for CSS
    return this.currentSnackbar ? `position-${this.currentSnackbar.position}` : 'position-top-center';
  }

  ngOnDestroy(): void {
    this.snackbarSubscription?.unsubscribe();
    this.timerSubscription?.unsubscribe();
  }

}
