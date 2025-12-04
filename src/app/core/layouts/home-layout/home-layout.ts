import { Component } from '@angular/core';
import { SideNavBar } from "../side-nav-bar/side-nav-bar";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-home-layout',
  imports: [SideNavBar, RouterOutlet],
  templateUrl: './home-layout.html',
  styleUrl: './home-layout.css',
})
export class HomeLayout {

}
