import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loaderservice } from './core/services/loader/loaderservice';
import { Loader } from "./core/component/loader/loader";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Loader],
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
