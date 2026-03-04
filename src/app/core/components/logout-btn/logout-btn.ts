import { Component, inject, input } from '@angular/core';
import { Layout } from '@app/core/services/layout';
import { DialogService } from '@app/shared/services/dialog-service/dialog';
import { TranslationService } from '@app/core/services/translate.service';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipDirective } from '@app/shared/directive/tooltip/tooltip';
import { NgClass } from '@angular/common';
import { Loaderservice } from '@app/shared/services/loader/loaderservice';


@Component({
  selector: 'app-logout-btn',
  imports: [TranslateModule, TooltipDirective, NgClass],
  templateUrl: './logout-btn.html',
  styleUrl: './logout-btn.css',
})
export class LogoutBtn {

  size = input('size-5');

  private layoutService = inject(Layout);
  private dialogService = inject(DialogService);
  private translateService = inject(TranslationService);
  private loaderService = inject(Loaderservice);

  onLogout() {
    const isRTL = this.translateService.getCurrentLanguage() === 'ur';
    this.dialogService.open({
      actbtn: isRTL ? 'لاگ آؤٹ' : 'Logout',
      title: "⚠️ " + (isRTL ? 'لاگ آؤٹ' : 'Logout'),
      message: isRTL ? 'کیا آپ واقعی لاگ آؤٹ کرنا چاہتے ہیں؟' : 'Are you sure to logout?',
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
