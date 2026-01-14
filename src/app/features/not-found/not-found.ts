import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [],
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
