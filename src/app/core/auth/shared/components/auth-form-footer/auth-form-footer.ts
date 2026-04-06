import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-form-footer',
  imports: [TranslateModule, RouterLink],
  template: `<div class="mb-3 text-primary-text text-center ">
            {{linkLabel | translate}}
            <a [routerLink]="routeLink" class="text-sm text-secondary2 underline cursor-pointer ">
              {{linkName | translate}}</a>
        </div>`,
  // templateUrl: './auth-form-footer.html',
  // styleUrl: './auth-form-footer.css',
})
export class AuthFormFooter {

  @Input({required:true}) linkLabel!:string;
  @Input({required:true}) routeLink!:string;
  @Input({required: true}) linkName!:string;

}