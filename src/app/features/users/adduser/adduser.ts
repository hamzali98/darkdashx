import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SideNav } from "./components/side-nav/side-nav";
import { SearchBar } from "@app/shared/components/search-bar/search-bar";


@Component({
  selector: 'app-adduser',
  imports: [SideNav, RouterOutlet, SearchBar],
  templateUrl: './adduser.html',
  styleUrl: './adduser.css',
})
export class Adduser {

}
