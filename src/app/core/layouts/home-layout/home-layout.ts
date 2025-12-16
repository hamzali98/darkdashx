import { Component, inject } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { GenericSideBar } from "../generic-side-bar/generic-side-bar";
import { Formservice } from '@app/features/users/adduser/services/formservice';

@Component({
  selector: 'app-home-layout',
  imports: [RouterOutlet, GenericSideBar],
  templateUrl: './home-layout.html',
  styleUrl: './home-layout.css',
})
export class HomeLayout {

  userFormService = inject(Formservice);
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
        routeNames: ["View Features", "Add Features"],
        routeLink: ["/users/view", "/users/add",]
      },
      {
        routePath: 'pricing', tileName: "Pricing",
        coloredIcon: "assets/icons/colored/dollar.svg",
        uncoloredIcon: "assets/icons/uncolored/dollar.svg",
        iconsAlt: "pricing", topPadding: "pt-0",
        routeNames: ["View Pricing", "Add Pricing"],
        routeLink: ["/users/view", "/users/add",]
      },
      {
        routePath: 'integrations', tileName: "Integrations",
        coloredIcon: "assets/icons/colored/puzzlepiece.svg",
        uncoloredIcon: "assets/icons/uncolored/puzzlepiece.svg",
        iconsAlt: "integrations", topPadding: "pt-0",
        routeNames: ["View Integrations", "Add Integrations"],
        routeLink: ["/users/view", "/users/add",]
      },
    ]
  }

}
