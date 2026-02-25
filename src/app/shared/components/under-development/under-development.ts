import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-under-development',
  imports: [TranslateModule],
  templateUrl: './under-development.html',
  styleUrl: './under-development.css',
})
export class UnderDevelopment implements OnInit {

  flag = signal<boolean>(false);

  private routerRef = inject(Router);

ngOnInit(): void {
  this.flag.set(this.routerRef.url.includes("report-issue"));
}


  goHome(){
    this.routerRef.navigate(['/']);
  }

}
