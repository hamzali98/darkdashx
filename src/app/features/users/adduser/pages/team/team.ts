import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Formservice } from '../../services/formservice';
import { Loaderservice } from '@app/shared/services/loader/loaderservice';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { CompanyListService } from '@app/shared/services/companylist/company-list-service';
import { companyInterface } from '@app/shared/interface/company';
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

  isRTL: boolean;

  url: string = environment.USER_URL;

  // positions: [];
  companyList: companyInterface[];

  teamInfo: FormGroup;
  userFormSubmit: FormGroup;

  routerRef = inject(Router);
  userForm = inject(Formservice);
  httpService = inject(Httpservice);
  loaderService = inject(Loaderservice);
  private snackService = inject(SnackBarService);
  private companyListService = inject(CompanyListService);
  private translationService = inject(TranslationService);

  constructor() {
    this.companyList = this.companyListService.getCompanyList();
    this.userFormSubmit = this.userForm.getForm();
    this.teamInfo = this.userForm.getForm().get('team_info') as FormGroup;
    this.teamInfo.markAllAsTouched();

    this.isRTL = this.translationService.getCurrentLanguage() === 'ur';
  }

  get team_name() {
    return this.teamInfo.get('team_name');
  }
  get team_rank() {
    return this.teamInfo.get('team_rank');
  }
  get team_office() {
    return this.teamInfo.get('team_office');
  }
  get team_mail() {
    return this.teamInfo.get('team_mail');
  }

  onFormSubmit() {
    if (this.userFormSubmit.invalid) {
      this.snackService.warning(this.isRTL ? "براہ کرم تمام مطلوبہ فیلڈز کو پُر کریں!" : "Please fill in all required fields!", 5000, 'bottom-center');
    } else {

      // console.log("form data", this.userFormSubmit.value);
      if (this.userForm.editing()) {
        this.loaderService.showLoader();
        // console.log("Id for previous data", this.userForm.editingId());
        const id = this.userForm.editingId();
        //   console.log("ID : ", id);
        // console.log("Whole Form", this.userFormSubmit.value);
        this.httpService.editApi(this.url, id, this.userFormSubmit.value).subscribe({
          next: (res) => {
            // console.log(res);
            this.userForm.resetForm();
            this.routerRef.navigate(['/users/view']);
          },
          error: (err) => {
            // console.log(err);
            this.loaderService.hideLoader();
          }
        })
      } else {

        this.loaderService.showLoader();
        // console.log("Whole Form", this.userFormSubmit.value);
        this.httpService.addApi(this.url, this.userFormSubmit.value).subscribe({
          next: (res) => {
            // console.log(res);
            this.userForm.resetForm();
            this.routerRef.navigate(['/users/view']);
          },
          error: (err) => {
            // console.log(err);
            this.loaderService.hideLoader();
          }
        })
      }
    }
  }
}
