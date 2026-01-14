import { Injectable } from '@angular/core';
import { childnav } from '@app/shared/interface/child-nav-interface';

@Injectable({
  providedIn: 'root',
})
export class ChildNavBarService {

  private readonly productAddRoutes: childnav[] = [
    { route: "/home/products/add/1", icon: "assets/icons/neutral/product.svg", tiletitle: "Basic Information" },
    { route: "/home/products/add/2", icon: "assets/icons/neutral/stock.svg", tiletitle: "Detailed Information" },
  ];

  private readonly userAddRoutes: childnav[] = [
    { route: "/users/add/1", icon: "assets/icons/neutral/pencil.svg", tiletitle: "Personal Information" },
    { route: "/users/add/2", icon: "assets/icons/neutral/usericon.svg", tiletitle: "Basic Information" },
    { route: "/users/add/3", icon: "assets/icons/neutral/team.svg", tiletitle: "Team Information" },
  ];

  getProductAddRoutes() : childnav[] {
    return this.productAddRoutes;
  }

  getUserAddRoutes() : childnav[] {
    return this.userAddRoutes;
  }

}
