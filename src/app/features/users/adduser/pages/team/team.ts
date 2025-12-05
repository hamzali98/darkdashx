import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Formservice } from '../../services/formservice';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { finalize, timeInterval } from 'rxjs';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';

@Component({
  selector: 'app-team',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './team.html',
  styleUrl: './team.css',
})
export class Team {

  spin: boolean = false;

  teamInfo: FormGroup;
  userFormSubmit: FormGroup;
  userForm = inject(Formservice);
  httpService = inject(Httpservice);

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
    this.spin = true;
    console.log("Whole Form", this.userFormSubmit.value);
    this.httpService.addApi('users', this.userFormSubmit.value).pipe(
      finalize(() => {
        setTimeout(() => {
          this.spin = false;
        }, 1200);
      })
    ).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
        setTimeout(() => {
          this.spin = false;
        }, 1200);
      },
      complete: () => {
        setTimeout(() => {
          this.spin = false;
        }, 1200);
      }
    })
  }

}
