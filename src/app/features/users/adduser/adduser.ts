import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SearchBar } from "@app/shared/components/search-bar/search-bar";
import { GenericChildNavBar } from "@app/shared/components/generic-child-nav-bar/generic-child-nav-bar";
import { childnav } from '@app/shared/interface/child-nav-interface';


@Component({
  selector: 'app-adduser',
  imports: [RouterOutlet, SearchBar, GenericChildNavBar],
  templateUrl: './adduser.html',
  styleUrl: './adduser.css',
})
export class Adduser {

  navTitle: string = "Credentials";
  navData: childnav[];

  constructor(){
    this.navData = [
      {route: "/users/add/1", icon: "assets/icons/neutral/pencil.svg", tiletitle: "Personal Information"},
      {route: "/users/add/2", icon: "assets/icons/neutral/usericon.svg", tiletitle: "Basic Information"},
      {route: "/users/add/3", icon: "assets/icons/neutral/team.svg", tiletitle: "Team Information"},
    ]
  }
}
