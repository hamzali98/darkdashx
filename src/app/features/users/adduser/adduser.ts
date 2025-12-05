import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SideNav } from "./components/side-nav/side-nav";


@Component({
  selector: 'app-adduser',
  imports: [SideNav, RouterOutlet, ],
  templateUrl: './adduser.html',
  styleUrl: './adduser.css',
})
export class Adduser {

}
