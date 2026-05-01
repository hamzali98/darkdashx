import { Component, inject, OnInit } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, map } from 'rxjs/operators';
import { NavigationEnd, RouterOutlet } from '@angular/router';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Loaderservice } from './shared/services/loader/loaderservice';
import { Loader } from "./shared/components/loader/loader";
import { SnackBar } from "./shared/components/snack-bar/snack-bar";
import { GenericDialog } from './shared/components/generic-dialog/generic-dialog';
import { DialogService } from './shared/services/dialog-service/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService, THEMES } from './shared/services/theme-service/theme-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Loader, SnackBar, GenericDialog, AsyncPipe, NgTemplateOutlet, TranslateModule],
  // animations: [slideAnimation],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {

  // themes = App.themes

  private routerRef = inject(Router);
  private loaderService = inject(Loaderservice);
  private dialogServiceRef = inject(DialogService);
  private themeService = inject(ThemeService);
  themes = THEMES;
  
  constructor(
    private title: Title,
    private translate: TranslateService,
    private swUpdate: SwUpdate,
  ) {
    if (this.swUpdate.isEnabled) {

      // Listen for new version available
      this.swUpdate.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(() => {
          if (confirm('New version available. Load it?')) {
            window.location.reload();
          }
        });

      // Check for updates every 6 hours
      setInterval(() => this.swUpdate.checkForUpdate(), 6 * 60 * 60 * 1000);
    }
  }
  
  get dialogService() { return this.dialogServiceRef; }
  
  ngOnInit(): void {
    // Set title initially
    this.setTitle();

    // Update title when language changes
    this.translate.onLangChange.subscribe(() => {
      this.setTitle();
    });
  }

  private setTitle() {
    this.translate.stream('Tab_Title')
      .subscribe((res: string) => {
        this.title.setTitle(res);
      });
  }

  get loaderServiceRef() {
    return this.loaderService;
  }

  sessionRejoin() {
    this.dialogService.close();
    this.routerRef.navigate(['/auth/login']);
  }

}
