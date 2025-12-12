import { Component, inject } from '@angular/core';
import { SideNavBar } from "../side-nav-bar/side-nav-bar";
import { RouterOutlet } from "@angular/router";
import { Loaderservice } from '@app/core/services/loader/loaderservice';
import { Loader } from "@app/core/component/loader/loader";
import { GenericSideBar } from "../generic-side-bar/generic-side-bar";

@Component({
  selector: 'app-home-layout',
  imports: [SideNavBar, RouterOutlet, GenericSideBar],
  templateUrl: './home-layout.html',
  styleUrl: './home-layout.css',
})
export class HomeLayout {

  /*
  routerLink paths, 
  opening names like (home)
  icons paths colore and uncolored. and alt names
  toppadding?
  tile name?
  each tile inner routers with count and their names with links
  
  sidenav routes = {
  }
  
  */

  sideCols: any[];

  constructor() {
    this.sideCols = [
      {
        routePath: 'home', tileName: "Dashboard",
        coloredIcon: "assets/icons/colored/homeicon.svg",
        uncoloredIcon: "assets/icons/uncolored/homeicon.svg",
        iconsAlt: "home", topPadding: "pt-7",
        routeNames: ["Home", "Reports", "Tasks", "Products"],
        routeLink: ["/", "/home/reports", "/home/tasks", "/home/products"]
      },
      {
        routePath: 'users', tileName: "Users",
        coloredIcon: "assets/icons/colored/usericon.svg",
        uncoloredIcon: "assets/icons/uncolored/usericon.svg",
        iconsAlt: "user", topPadding: "pt-0",
        routeNames: ["View Users", "Add Users"],
        routeLink: ["/users/view", "/users/add",]
      },
      {
        routePath: 'features', tileName: "Features",
        coloredIcon: "assets/icons/colored/star.svg",
        uncoloredIcon: "assets/icons/uncolored/star.svg",
        iconsAlt: "feat", topPadding: "pt-0",
        routeNames: ["View Users", "Add Users"],
        routeLink: ["/users/view", "/users/add",]
      },
    ]
  }

}
