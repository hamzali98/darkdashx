import { Component, inject } from '@angular/core';
import { SideNavBar } from "../side-nav-bar/side-nav-bar";
import { RouterOutlet } from "@angular/router";
import { Loaderservice } from '@app/core/services/loader/loaderservice';
import { Loader } from "@app/core/component/loader/loader";

@Component({
  selector: 'app-home-layout',
  imports: [SideNavBar, RouterOutlet, Loader],
  templateUrl: './home-layout.html',
  styleUrl: './home-layout.css',
})
export class HomeLayout {

 
  
}
