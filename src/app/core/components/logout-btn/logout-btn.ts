import { Component, inject, input } from '@angular/core';
import { Layout } from '@app/core/services/layout';
import { DialogService } from '@app/shared/services/dialog-service/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TooltipDirective } from '@app/shared/directive/tooltip/tooltip';
import { Loaderservice } from '@app/shared/services/loader/loaderservice';
import { SvgColour } from "@app/shared/components/svg-colour/svg-colour";


@Component({
  selector: 'app-logout-btn',
  imports: [TranslateModule, TooltipDirective, SvgColour],
  templateUrl: './logout-btn.html',
  styleUrl: './logout-btn.css',
})
export class LogoutBtn {

  size = input('size-5');

  private layoutService = inject(Layout);
  private dialogService = inject(DialogService);
  private loaderService = inject(Loaderservice);
  private translateService = inject(TranslateService);

  onLogout() {
    this.dialogService.open({
      actbtn: this.translateService.instant('LOGOUT'),
      title: "🔒 " + (this.translateService.instant('LOGOUT')),
      message: this.translateService.instant('Are you sure to logout?'),
      type: "generic"
    }).subscribe(result => {
      if (result) {
        this.loaderService.showLoader();
          this.layoutService.onLogout();
      } else {
        // this.dialogService.close();

      }
    })
  }
}
