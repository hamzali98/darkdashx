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

@Component({
  selector: 'app-products-add',
  imports: [SearchBar, RouterOutlet, GenericChildNavBar, TranslateModule],
  templateUrl: './products-add.html',
  styleUrl: './products-add.css',
})
export class ProductsAdd implements OnInit {

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
      if(!this.productFormService.hasUnsavedChanges() && this.productFormService.isInvalid()){
        this.routerRef.navigate(['/products']);
      } else {
        this.dialogService.open({
            actbtn: this.translateModule.instant('CONFIRM'),
            title: `⚠️ ${this.translateModule.instant('Confirmation Alert')}`,
            message: this.translateModule.instant('You have unsaved changes. Are you sure you want to leave?'),
            type: 'generic'
          }).pipe(
            map(confirmed => {
              if (confirmed) {
                this.productFormService.resetForm(); // ✅ Clean up if user confirms leave
              }
              return confirmed; // true = allow navigation, false = block it
            })
          );
      }
      // this.routerRef.navigate(['/products']);
    } else {
      // Valid navigation — consume the flag so refresh now kicks them out
      sessionStorage.removeItem('product_form_intent');
    }
  }

  get isEditing(): boolean {
    return this.productFormService.editing();
  }
}
