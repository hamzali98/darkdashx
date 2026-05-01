import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Layout } from '@app/core/services/layout';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-main-logo',
  imports: [TranslateModule],
  templateUrl: './main-logo.html',
  styleUrl: './main-logo.css',
})
export class MainLogo {

  private layoutService = inject(Layout);

  onOpen(section: string){
    this.layoutService.onOpen(section);
  }

  onRoute(route: string) {
    this.layoutService.onRoute(route);
  }
}
