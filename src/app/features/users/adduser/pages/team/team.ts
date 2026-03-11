import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Formservice } from '../../services/formservice';
import { User } from '@app/features/users/interface/user';
import { InputConfigs } from '../../config/input-configs';
import { environment } from '@environments/environment.development';
import { FormStyle } from "@app/shared/components/form-style/form-style";
import { TranslationService } from '@app/core/services/translate.service';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { ListService } from '@app/shared/services/list-service/list-service';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataFetchService } from '@app/shared/services/data/data-fetch-service';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar-service';
import { companyListInterface } from '@app/shared/interface/company-list.interface';
import { TickAnimationService } from '@app/shared/services/tick-animation/tick-animation-service';
import { CustomInputConfig, GenericInput } from '@app/shared/components/generic-input/generic-input';

@Component({
  selector: 'app-team',
  imports: [ReactiveFormsModule, FormsModule, TranslateModule, FormStyle, GenericInput],
  templateUrl: './team.html',
  styleUrl: './team.css',
})
export class Team {

  url: string = environment.USER_URL;

  companiesList: companyListInterface[];
  teamInfo: FormGroup;
  userFormSubmit: FormGroup;

  userTeamNameConfig: CustomInputConfig;
  userTeamRankConfig: CustomInputConfig;
  userTeamOfficeConfig: CustomInputConfig;
  userTeamEmailConfig: CustomInputConfig;

  // ✅ all private
  private routerRef = inject(Router);
  private userFormService = inject(Formservice);
  private httpService = inject(Httpservice);
  private listService = inject(ListService);
  private snackService = inject(SnackBarService);
  private dataFetchService = inject(DataFetchService);
  private translationService = inject(TranslationService);
  private tickAnimationService = inject(TickAnimationService);

  constructor() {
    this.companiesList = this.listService.getCompanyList();
    this.userFormSubmit = this.userFormService.getForm();
    this.teamInfo = this.userFormService.getForm().get('team_info') as FormGroup;
    this.teamInfo.markAllAsTouched();

    this.userTeamNameConfig = new InputConfigs().userTeamNameConfig;
    this.userTeamRankConfig = new InputConfigs().userTeamRankConfig;
    this.userTeamOfficeConfig = new InputConfigs().userTeamOfficeConfig;
    this.userTeamEmailConfig = new InputConfigs().userTeamEmailConfig;
  }

  get userformEditing() { return this.userFormService.editing(); }
  get team_name() { return this.teamInfo.get('team_name'); }
  get team_rank() { return this.teamInfo.get('team_rank'); }
  get team_mail() { return this.teamInfo.get('team_mail'); }
  get team_office() { return this.teamInfo.get('team_office'); }
  get isRTL(): boolean { return this.translationService.getCurrentLanguage() === 'ur'; }

  private navigate(): void {
    this.routerRef.navigate(['/users/view']);
  }

  onCancel() {
    this.userFormService.resetForm();
    this.navigate();
  }

  onFormSubmit() {
    if (this.userFormSubmit.invalid) {
      this.snackService.warning(
        this.isRTL ? "براہ کرم تمام مطلوبہ فیلڈز کو پُر کریں!" : "Please fill in all required fields!",
        5000, 'bottom-center'
      );
      return; // ✅ early return, no deeply nested else
    }

    if (this.userformEditing) {
      const id = this.userFormService.editingId();

      this.httpService.editApi(this.url, id, this.userFormSubmit.value).subscribe({
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
          this.tickAnimationService.show(this.isRTL ? "اپ ڈیٹ ہو گیا!" : "Updated!", 3000);
          this.userFormService.markClean();
          setTimeout(() => {
            this.userFormService.clearFormFromStorage(); // 👈 add this line
            this.userFormService.resetForm();
            this.navigate();
          }, 3000);
        },
        error: () => { // ✅ no silent error swallowing
          this.snackService.error(
            this.isRTL ? "اپ ڈیٹ ناکام!" : "Update failed!",
            2000, 'bottom-right'
          );
        }
      });

    } else {

      this.httpService.addApi(this.url, this.userFormSubmit.value).subscribe({
        next: (res) => {
          // ✅ append new user into shared BehaviorSubject
          const newUser = res as User;
          const current = this.dataFetchService.getUserSnapshot();
          this.dataFetchService.refreshData('users', [...current, newUser]);

          this.snackService.success(
            this.isRTL ? "ڈیٹا کامیابی سے شامل ہو گیا!" : "User added successfully!",
            2000, 'bottom-right'
          );
          this.tickAnimationService.show(this.isRTL ? "شامل ہو گیا!" : "Added!", 3000);
          this.userFormService.markClean();
          setTimeout(() => {
            this.userFormService.clearFormFromStorage(); // 👈 add this line
            this.userFormService.resetForm();
            this.navigate();
          }, 3000);
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