import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Formservice } from '../../services/formservice';
import { User } from '@app/features/users/interface/user';
import { InputConfigs } from '../../config/input-configs';
import { environment } from '@environments/environment.development';
import { FormStyle } from "@app/shared/components/form-style/form-style";
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { ListService } from '@app/shared/services/list-service/list-service';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataFetchService } from '@app/shared/services/data/data-fetch-service';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar-service';
import { companyListInterface } from '@app/shared/interface/company-list.interface';
import { TickAnimationService } from '@app/shared/services/tick-animation/tick-animation-service';
import { CustomInputConfig, GenericInput } from '@app/shared/components/generic-input/generic-input';
import { SubmitButton } from "@app/shared/components/submit-button/submit-button";
import { TextButton } from "@app/shared/components/text-button/text-button";

@Component({
  selector: 'app-team',
  imports: [ReactiveFormsModule, FormsModule, TranslateModule, FormStyle, GenericInput, SubmitButton, TextButton],
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
  private tickAnimationService = inject(TickAnimationService);
  private translateService = inject(TranslateService);

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
        this.translateService.instant("Please fill in all required fields!"),
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
            this.translateService.instant("User updated successfully!"),
            2000, 'bottom-right'
          );
          this.tickAnimationService.show(this.translateService.instant("Updated!"), 3000);
          this.userFormService.markClean();
          setTimeout(() => {
            this.userFormService.clearFormFromStorage(); // 👈 add this line
            this.userFormService.resetForm();
            this.navigate();
          }, 3000);
        },
        error: () => { // ✅ no silent error swallowing
          this.snackService.error(
            this.translateService.instant("Update failed!"),
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
            this.translateService.instant("User added successfully!"),
            2000, 'bottom-right'
          );
          this.tickAnimationService.show(this.translateService.instant("Added!"), 3000);
          this.userFormService.markClean();
          setTimeout(() => {
            this.userFormService.clearFormFromStorage(); // 👈 add this line
            this.userFormService.resetForm();
            this.navigate();
          }, 3000);
        },
        error: () => {
          this.snackService.error(
            this.translateService.instant("Failed to add user!"),
            2000, 'bottom-right'
          );
        }
      });
    }
  }
}