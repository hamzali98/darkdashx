import { Component, inject } from '@angular/core';
import { Layout } from '@app/core/services/layout';

@Component({
  selector: 'app-logout-btn',
  imports: [],
  templateUrl: './logout-btn.html',
  styleUrl: './logout-btn.css',
})
export class LogoutBtn {

  private layoutService = inject(Layout);

  onLogout() {
    this.layoutService.onLogout();
  }
}
