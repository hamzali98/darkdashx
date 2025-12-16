import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SearchBar } from "@app/shared/components/search-bar/search-bar";
import { GenericChildNavBar } from "@app/shared/components/generic-child-nav-bar/generic-child-nav-bar";
import { childnav } from '@app/shared/interface/child-nav-interface';
import { ChildNavBarService } from '@app/shared/services/child-nav-bar/child-nav-bar-service';
import { Formservice } from './services/formservice';


@Component({
  selector: 'app-adduser',
  imports: [RouterOutlet, SearchBar, GenericChildNavBar],
  templateUrl: './adduser.html',
  styleUrl: './adduser.css',
})
export class Adduser {

  navTitle: string = "Credentials";
  addUserRoutesData: childnav[];

  private childNavBarDataService = inject(ChildNavBarService);
  userFormService = inject(Formservice);

  constructor() {
    this.addUserRoutesData = this.childNavBarDataService.getUserAddRoutes();
  }
}
