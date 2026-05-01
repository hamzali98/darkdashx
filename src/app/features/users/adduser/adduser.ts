import { RouterOutlet } from '@angular/router';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Formservice } from './services/formservice';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { childnav } from '@app/shared/interface/child-nav-interface';
import { SearchBar } from "@app/shared/components/search-bar/search-bar";
import { HasUnsavedChanges } from '@app/shared/interface/has-unsaved-changes';
import { ChildNavBarService } from '@app/shared/services/child-nav-bar/child-nav-bar-service';
import { GenericChildNavBar } from "@app/shared/components/generic-child-nav-bar/generic-child-nav-bar";
import { DialogService } from '@app/shared/services/dialog-service/dialog';
import { GenericViewPage } from "@app/shared/components/generic-view-page/generic-view-page";

@Component({
  selector: 'app-adduser',
  imports: [RouterOutlet, GenericChildNavBar, TranslateModule, GenericViewPage],
  templateUrl: './adduser.html',
  styleUrl: './adduser.css',
})
export class Adduser implements OnInit, OnDestroy, HasUnsavedChanges {

  navTitle: string = "CREDENTIALS";
  addUserRoutesData: childnav[];

  private userFormService = inject(Formservice);
  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService)
  private childNavBarDataService = inject(ChildNavBarService);

  constructor() {
    this.addUserRoutesData = this.childNavBarDataService.getUserAddRoutes();
  }

  ngOnInit(): void {
    if (!this.isEditing) {
      console.log("add user ngoninit");
      // dialog checking
      if (this.userFormService.hasSavedForm()) {
        this.dialogService.open({
          actbtn: this.translateService.instant('Yes, Restore'),
          title: `📋 ${this.translateService.instant('Draft Found')}`,
          message: this.translateService.instant('You have an unsaved draft. Would you like to restore it?'),
          type: 'generic'
        }).subscribe(result => {
          if (result) {
            // ✅ User said YES — patch saved values into form
            this.userFormService.restoreDraft(this.userFormService.getSavedForm());
          } else {
            // ❌ User said NO — clear draft, init fresh form
            this.userFormService.clearFormFromStorage();
            this.userFormService.resetForm(); // your existing form init method
          }
        });
      } else {
        this.userFormService.resetForm(); // no draft — init fresh normally
      }
    }
  }

  ngOnDestroy(): void {
    // this.userFormService.clearFormFromStorage();
  }

  get isEditing(): boolean {
    return this.userFormService.editing();
  }

  get pageTitleGetter(): string {
    return this.isEditing ? "EDIT_USER" : "ADD_USER";
  }

  hasUnsavedChanges(): boolean {
    return this.userFormService.hasUnsavedChanges();
  }
  resetForm(): void {
    this.userFormService.resetForm();
  }

  isValid(): boolean {
    return this.userFormService.isValid();
  }
}
