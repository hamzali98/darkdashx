import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Layout } from '@app/core/services/layout';

@Component({
  selector: 'app-main-logo',
  imports: [RouterLink],
  templateUrl: './main-logo.html',
  styleUrl: './main-logo.css',
})
export class MainLogo {

  private layoutService = inject(Layout);

  onOpen(section: string){
    this.layoutService.onOpen(section);
  }
}
