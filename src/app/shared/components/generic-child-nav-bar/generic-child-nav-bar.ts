import { NgClass } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { childnav } from '@app/shared/interface/child-nav-interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-generic-child-nav-bar',
  imports: [RouterLink, NgClass, TranslateModule],
  templateUrl: './generic-child-nav-bar.html',
  styleUrl: './generic-child-nav-bar.css',
})
export class GenericChildNavBar {

  @Input() navTitle!: string;
  @Input() navData! : childnav[];
  routerRef = inject(Router);

   isActive(route: string): boolean {
    // if (route === '') {
    //   return this.routerRef.url === '/' || this.routerRef.url === '';
    // }
    return this.routerRef.url.includes(route);
  }
}
