import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  imports: [TranslateModule],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {

  private routerRef = inject(Router);

  goToHome() {
    this.routerRef.navigate([''])
  }

  goToReportIssue(){
    this.routerRef.navigate(['/report-issue'])
  }

}
