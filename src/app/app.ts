import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loaderservice } from './shared/services/loader/loaderservice';
import { Loader } from "./shared/components/loader/loader";
import { SnackBar } from "./shared/components/snack-bar/snack-bar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Loader, SnackBar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('dashboard');

   private loaderService = inject(Loaderservice);

  get loaderState (){
    return this.loaderService.getLoader();
  }
}
