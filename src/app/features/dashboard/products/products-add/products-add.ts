import { Component } from '@angular/core';
import { SearchBar } from "@app/shared/components/search-bar/search-bar";
import { RouterOutlet } from "@angular/router";
import { childnav } from '@app/shared/interface/child-nav-interface';
import { GenericChildNavBar } from "@app/shared/components/generic-child-nav-bar/generic-child-nav-bar";

@Component({
  selector: 'app-products-add',
  imports: [SearchBar, RouterOutlet, GenericChildNavBar],
  templateUrl: './products-add.html',
  styleUrl: './products-add.css',
})
export class ProductsAdd {

  title: string = "Details";
  routerData : childnav[];

  constructor(){
    this.routerData = [
      {route: "/home/products/add/1", icon: "assets/icons/neutral/product.svg", tiletitle: "Basic Information"},
      {route: "/home/products/add/2", icon: "assets/icons/neutral/stock.svg", tiletitle: "Detailed Information"},

    ]
  }

}
