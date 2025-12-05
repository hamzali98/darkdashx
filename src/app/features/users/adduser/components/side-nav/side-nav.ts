import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  imports: [RouterLink, NgClass],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav {

  routerRef = inject(Router);

   isActive(route: string): boolean {
    // if (route === '') {
    //   return this.routerRef.url === '/' || this.routerRef.url === '';
    // }
    return this.routerRef.url.includes(route);
  }
}
