import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Loaderservice } from './shared/services/loader/loaderservice';
import { Loader } from "./shared/components/loader/loader";
import { SnackBar } from "./shared/components/snack-bar/snack-bar";
import { GenericDialog } from './shared/components/generic-dialog/generic-dialog';
import { DialogService, DialogData } from './shared/services/dialog-service/dialog';
import { AuthService } from './core/auth/services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Loader, SnackBar, GenericDialog, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('dashboard');

  private loaderService = inject(Loaderservice);
  private authService = inject(AuthService);
  dialogService = inject(DialogService);

  get loaderState() {
    return this.loaderService.getLoader();
  }

  onLogout() {
    this.authService.logout();
  }
}
