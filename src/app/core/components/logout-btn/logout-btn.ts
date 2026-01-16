import { Component, inject } from '@angular/core';
import { Layout } from '@app/core/services/layout';
import { DialogService } from '@app/shared/services/dialog-service/dialog';

@Component({
  selector: 'app-logout-btn',
  imports: [],
  templateUrl: './logout-btn.html',
  styleUrl: './logout-btn.css',
})
export class LogoutBtn {

  private layoutService = inject(Layout);
  private dialogService = inject(DialogService);

  onLogout() {
    this.dialogService.open({
      title: "⚠️ Logout",
      message: "Are you sure to logout?",
      type: "generic"
    }).subscribe(result => {
      if (result) {
        this.layoutService.onLogout();
      } else {
        this.dialogService.close();
      }
    })
  }
}
