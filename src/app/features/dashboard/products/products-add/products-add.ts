import { RouterOutlet } from "@angular/router";
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormService } from './service/form-service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { childnav } from '@app/shared/interface/child-nav-interface';
import { SearchBar } from "@app/shared/components/search-bar/search-bar";
import { HasUnsavedChanges } from '@app/shared/interface/has-unsaved-changes';
import { ChildNavBarService } from '@app/shared/services/child-nav-bar/child-nav-bar-service';
import { GenericChildNavBar } from "@app/shared/components/generic-child-nav-bar/generic-child-nav-bar";
import { DialogService } from "@app/shared/services/dialog-service/dialog";
import { GenericViewPage } from "@app/shared/components/generic-view-page/generic-view-page";

@Component({
  selector: 'app-products-add',
  imports: [RouterOutlet, GenericChildNavBar, TranslateModule, GenericViewPage],
  templateUrl: './products-add.html',
  styleUrl: './products-add.css',
})
export class ProductsAdd implements OnInit, OnDestroy, HasUnsavedChanges {

  title: string = "DETAILS";
  addProductRoutesData: childnav[];

  private productFormService = inject(FormService);
  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService);
  private addProductRoutesDataService = inject(ChildNavBarService);

  constructor() {
    this.addProductRoutesData = this.addProductRoutesDataService.getProductAddRoutes();
  }

  ngOnInit(): void {
    if (!this.isEditing) {
      if (this.productFormService.hasSavedForm()) {
        this.dialogService.open({
          actbtn: this.translateService.instant('Yes, Restore'),
          title: `📋 ${this.translateService.instant('Draft Found')}`,
          message: this.translateService.instant('You have an unsaved draft. Would you like to restore it?'),
          type: 'generic'
        }).subscribe(result => {
          if (result) {
            // ✅ User said YES — patch saved values into form
            this.productFormService.restoreDraft(this.productFormService.getSavedForm());
          } else {
            // ❌ User said NO — clear draft, init fresh form
            this.productFormService.clearFormFromStorage();
            this.productFormService.resetForm(); // your existing form init method
          }
        });
      } else {
        this.productFormService.resetForm(); // no draft — init fresh normally
      }
    }
  }

  ngOnDestroy(): void {
    // this.productFormService.clearFormFromStorage();
  }

  get isEditing(): boolean {
    return this.productFormService.editing();
  }

  get pageTitlegetter(): string {
    return this.isEditing ? "EDIT_PRODUCT" : "ADD_PRODUCT";
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
