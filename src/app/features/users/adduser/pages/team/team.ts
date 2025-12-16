import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Formservice } from '../../services/formservice';
import { Loaderservice } from '@app/core/services/loader/loaderservice';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { CompanyListService } from '@app/shared/services/companylist/company-list-service';
import { companyInterface } from '@app/shared/interface/company';

@Component({
  selector: 'app-team',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './team.html',
  styleUrl: './team.css',
})
export class Team {

  url = "users";

  // positions: [];
  companyList: companyInterface[];

  teamInfo: FormGroup;
  userFormSubmit: FormGroup;

  userForm = inject(Formservice);
  httpService = inject(Httpservice);
  routerRef = inject(Router);
  loaderService = inject(Loaderservice);
  private companyListService = inject(CompanyListService);

  constructor() {
    this.companyList = this.companyListService.getCompanyList();
    this.userFormSubmit = this.userForm.getForm();
    this.teamInfo = this.userForm.getForm().get('team_info') as FormGroup;
    this.teamInfo.markAllAsTouched();
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
    console.log("form data", this.userFormSubmit.value);
    if(this.userForm.editing()){
      this.loaderService.showLoader();
      console.log("Id for previous data", this.userForm.editingId());
      const id = this.userForm.editingId();
      console.log("ID : ", id);
    console.log("Whole Form", this.userFormSubmit.value);
    this.httpService.editApi(this.url, id, this.userFormSubmit.value).subscribe({
      next: (res) => {
        console.log(res);
        this.userForm.resetForm();
        this.routerRef.navigate(['/users/view']);
      },
      error: (err) => {
        console.log(err);
        this.loaderService.hideLoader();
      }
    })
    } else {

      this.loaderService.showLoader();
      console.log("Whole Form", this.userFormSubmit.value);
      this.httpService.addApi(this.url, this.userFormSubmit.value).subscribe({
        next: (res) => {
          console.log(res);
          this.userForm.resetForm();
          this.routerRef.navigate(['/users/view']);
        },
        error: (err) => {
          console.log(err);
          this.loaderService.hideLoader();
        }
      })
    }
  }

}
