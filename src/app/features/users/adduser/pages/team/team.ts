import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Formservice } from '../../services/formservice';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { finalize, timeInterval } from 'rxjs';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';
import { Router } from '@angular/router';
import { Loaderservice } from '@app/core/services/loader/loaderservice';

@Component({
  selector: 'app-team',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './team.html',
  styleUrl: './team.css',
})
export class Team {

  teamInfo: FormGroup;
  userFormSubmit: FormGroup;
  userForm = inject(Formservice);
  httpService = inject(Httpservice);
  routerRef = inject(Router);
  loaderService = inject(Loaderservice);

  constructor() {
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
    this.loaderService.showLoader();
    console.log("Whole Form", this.userFormSubmit.value);
    this.httpService.addApi('users', this.userFormSubmit.value).pipe(
      finalize(() => {
        setTimeout(() => {
          this.loaderService.hideLoader();
        }, 1200);
        this.userForm.resetForm();
        this.routerRef.navigate(['/users/view']);
      })
    ).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
        this.loaderService.hideLoader();
      },
      complete: () => {
        this.loaderService.hideLoader();
      }
    })
  }

}
