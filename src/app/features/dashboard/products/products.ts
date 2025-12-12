import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {

  private routerRef = inject(Router);

  goToroute(){
    this.routerRef.navigate(['home/products/add']);
  }
}
