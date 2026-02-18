import { Component, inject } from '@angular/core';
import { SearchBar } from "@app/shared/components/search-bar/search-bar";
import { RouterOutlet } from "@angular/router";
import { childnav } from '@app/shared/interface/child-nav-interface';
import { GenericChildNavBar } from "@app/shared/components/generic-child-nav-bar/generic-child-nav-bar";
import { ChildNavBarService } from '@app/shared/services/child-nav-bar/child-nav-bar-service';
import { FormService } from './service/form-service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-products-add',
  imports: [SearchBar, RouterOutlet, GenericChildNavBar, TranslateModule],
  templateUrl: './products-add.html',
  styleUrl: './products-add.css',
})
export class ProductsAdd {

  title: string = "DETAILS";
  addProductRoutesData : childnav[];

  private addProductRoutesDataService = inject(ChildNavBarService);
  productFormService = inject(FormService);

  constructor(){
    this.addProductRoutesData = this.addProductRoutesDataService.getProductAddRoutes();
  }

}
