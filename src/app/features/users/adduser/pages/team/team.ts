import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Formservice } from '../../services/formservice';
import { Loaderservice } from '@app/shared/services/loader/loaderservice';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { CompanyListService } from '@app/shared/services/companylist/company-list-service';
import { DataFetchService } from '@app/shared/services/data/data-fetch-service';
import { companyInterface } from '@app/shared/interface/company';
import { User } from '@app/features/users/interface/user';
import { environment } from '@environments/environment.development';
import { TranslateModule } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar-service';
import { TranslationService } from '@app/core/services/translate.service';

@Component({
  selector: 'app-team',
  imports: [ReactiveFormsModule, FormsModule, TranslateModule, NgClass],
  templateUrl: './team.html',
  styleUrl: './team.css',
})
export class Team {


  url: string = environment.USER_URL;

  companyList: companyInterface[];
  teamInfo: FormGroup;
  userFormSubmit: FormGroup;

  // ✅ all private
  private routerRef = inject(Router);
  private userForm = inject(Formservice);
  private httpService = inject(Httpservice);
  private loaderService = inject(Loaderservice);
  private snackService = inject(SnackBarService);
  private dataFetchService = inject(DataFetchService);
  private companyListService = inject(CompanyListService);
  private translationService = inject(TranslationService);

  constructor() {
    this.companyList = this.companyListService.getCompanyList();
    this.userFormSubmit = this.userForm.getForm();
    this.teamInfo = this.userForm.getForm().get('team_info') as FormGroup;
    this.teamInfo.markAllAsTouched();
  }

  get userformEditing() { return this.userForm.editing(); }
  get team_name() { return this.teamInfo.get('team_name'); }
  get team_rank() { return this.teamInfo.get('team_rank'); }
  get team_mail() { return this.teamInfo.get('team_mail'); }
  get team_office() { return this.teamInfo.get('team_office'); }
  get isRTL(): boolean { return this.translationService.getCurrentLanguage() === 'ur'; }

  onFormSubmit() {
    if (this.userFormSubmit.invalid) {
      this.snackService.warning(
        this.isRTL ? "براہ کرم تمام مطلوبہ فیلڈز کو پُر کریں!" : "Please fill in all required fields!",
        5000, 'bottom-center'
      );
      return; // ✅ early return, no deeply nested else
    }

    this.loaderService.showLoader(); // ✅ moved out, shared by both branches

    if (this.userformEditing) {
      const id = this.userForm.editingId();

      this.httpService.editApi(this.url, id, this.userFormSubmit.value).pipe(
        finalize(() => this.loaderService.hideLoader()) // ✅ always hides, even on error
      ).subscribe({
        next: (res) => {
          // ✅ update edited user in shared BehaviorSubject
          const updatedUser = res as User;
          const current = this.dataFetchService.getUserSnapshot();
          const updated = current.map(u => u.id === updatedUser.id ? updatedUser : u);
          this.dataFetchService.refreshData('users', updated);

          this.snackService.success(
            this.isRTL ? "ڈیٹا کامیابی سے اپ ڈیٹ ہو گیا!" : "User updated successfully!",
            2000, 'bottom-right'
          );
          this.userForm.resetForm();
          this.routerRef.navigate(['/users/view']);
        },
        error: () => { // ✅ no silent error swallowing
          this.snackService.error(
            this.isRTL ? "اپ ڈیٹ ناکام!" : "Update failed!",
            2000, 'bottom-right'
          );
        }
      });

    } else {

      this.httpService.addApi(this.url, this.userFormSubmit.value).pipe(
        finalize(() => this.loaderService.hideLoader()) // ✅ always hides, even on error
      ).subscribe({
        next: (res) => {
          // ✅ append new user into shared BehaviorSubject
          const newUser = res as User;
          const current = this.dataFetchService.getUserSnapshot();
          this.dataFetchService.refreshData('users', [...current, newUser]);

          this.snackService.success(
            this.isRTL ? "ڈیٹا کامیابی سے شامل ہو گیا!" : "User added successfully!",
            2000, 'bottom-right'
          );
          this.userForm.resetForm();
          this.routerRef.navigate(['/users/view']);
        },
        error: () => {
          this.snackService.error(
            this.isRTL ? "ڈیٹا شامل کرنے میں ناکام!" : "Failed to add user!",
            2000, 'bottom-right'
          );
        }
      });
    }
  }
}