import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Loaderservice } from './shared/services/loader/loaderservice';
import { Loader } from "./shared/components/loader/loader";
import { SnackBar } from "./shared/components/snack-bar/snack-bar";
import { GenericDialog } from './shared/components/generic-dialog/generic-dialog';
import { DialogService, DialogData } from './shared/services/dialog-service/dialog';
import { AuthService } from './core/auth/services/auth-service';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Loader, SnackBar, GenericDialog, AsyncPipe, NgTemplateOutlet, TranslateModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  // protected readonly title = signal('dashboard');

  private routerRef = inject(Router);
  private loaderService = inject(Loaderservice);
  private authService = inject(AuthService);
  dialogService = inject(DialogService);

 constructor(
    private title: Title,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    // Set title initially
    this.setTitle();

    // Update title when language changes
    this.translate.onLangChange.subscribe(() => {
      this.setTitle();
    });
  }

  private setTitle() {
    // this.translate.get('APP_TITLE').subscribe((res: string) => {
    //   this.title.setTitle(res);
    // });
    this.translate.stream('APP_TITLE')
    .subscribe((res: string) => {
      this.title.setTitle(res);
    });
  }

  get loaderServiceRef() {
    return this.loaderService;
  }

  sessionRejoin() {
    this.dialogService.close();
    // this.authService.logout();
    this.routerRef.navigate(['/login']);
  }
}
