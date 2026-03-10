import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SearchBar } from "@app/shared/components/search-bar/search-bar";
import { GenericChildNavBar } from "@app/shared/components/generic-child-nav-bar/generic-child-nav-bar";
import { childnav } from '@app/shared/interface/child-nav-interface';
import { ChildNavBarService } from '@app/shared/services/child-nav-bar/child-nav-bar-service';
import { Formservice } from './services/formservice';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogService } from '@app/shared/services/dialog-service/dialog';
import { map } from 'rxjs';

@Component({
  selector: 'app-adduser',
  imports: [RouterOutlet, SearchBar, GenericChildNavBar, TranslateModule],
  templateUrl: './adduser.html',
  styleUrl: './adduser.css',
})
export class Adduser implements OnInit {

  navTitle: string = "CREDENTIALS";
  addUserRoutesData: childnav[];

  private routerRef = inject(Router);
  private dialogService = inject(DialogService);
  private userFormService = inject(Formservice);
  private translateModule = inject(TranslateService);
  private childNavBarDataService = inject(ChildNavBarService);

  constructor() {
    this.addUserRoutesData = this.childNavBarDataService.getUserAddRoutes();
  }

  ngOnInit(): void {
    const intent = sessionStorage.getItem('user_form_intent');

    if (!intent) {
      // No intent flag means user landed here via refresh — send them back
      this.routerRef.navigate(['/users/view']);
    } else {
      // Valid navigation — consume the flag so refresh now kicks them out
      sessionStorage.removeItem('user_form_intent');
    }
  }

  get isEditing(): boolean {
    return this.userFormService.editing();
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
