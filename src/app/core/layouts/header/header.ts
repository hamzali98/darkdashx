import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MainLogo } from "@app/shared/components/main-logo/main-logo";

@Component({
  selector: 'app-header',
  imports: [RouterLink, NgClass, MainLogo],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  username = "Guest";

  open = signal("");

  onRoute(val : string){}

  onLogout() { }
}
