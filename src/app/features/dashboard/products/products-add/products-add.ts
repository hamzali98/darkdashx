import { map } from 'rxjs/operators';
import { Router, RouterOutlet } from "@angular/router";
import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormService } from './service/form-service';
import { childnav } from '@app/shared/interface/child-nav-interface';
import { SearchBar } from "@app/shared/components/search-bar/search-bar";
import { DialogService } from '@app/shared/services/dialog-service/dialog';
import { ChildNavBarService } from '@app/shared/services/child-nav-bar/child-nav-bar-service';
import { GenericChildNavBar } from "@app/shared/components/generic-child-nav-bar/generic-child-nav-bar";
import { HasUnsavedChanges } from '@app/shared/interface/has-unsaved-changes';

@Component({
  selector: 'app-products-add',
  imports: [SearchBar, RouterOutlet, GenericChildNavBar, TranslateModule],
  templateUrl: './products-add.html',
  styleUrl: './products-add.css',
})
export class ProductsAdd implements OnInit, HasUnsavedChanges {

  title: string = "DETAILS";
  addProductRoutesData: childnav[];

  private routerRef = inject(Router);
  private dialogService = inject(DialogService);
  private productFormService = inject(FormService);
  private translateModule = inject(TranslateService);
  private addProductRoutesDataService = inject(ChildNavBarService);

  constructor() {
    this.addProductRoutesData = this.addProductRoutesDataService.getProductAddRoutes();
  }

  ngOnInit(): void {
    const intent = sessionStorage.getItem('product_form_intent');
    if (!intent) {
      // No intent flag means user landed here via refresh — send them back
      this.routerRef.navigate(['/products']);
    } else {
      // Valid navigation — consume the flag so refresh now kicks them out
      sessionStorage.removeItem('product_form_intent');
    }
  }

  get isEditing(): boolean {
    return this.productFormService.editing();
  }

  hasUnsavedChanges(): boolean {
    return this.productFormService.hasUnsavedChanges();
  }
  resetForm(): void {
    this.productFormService.resetForm();
  }

  isValid(): boolean {
    return this.productFormService.isValid();
  }

}
