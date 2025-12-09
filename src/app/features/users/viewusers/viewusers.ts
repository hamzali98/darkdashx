import { Component, inject, OnInit, signal } from '@angular/core';
import { GenericTable } from '@app/shared/components/generic-table/generic-table';
import { TotalsCards } from "@app/shared/components/totals-cards/totals-cards";
import { User } from '../interface/user';
import { Loaderservice } from '@app/core/services/loader/loaderservice';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viewusers',
  imports: [GenericTable, TotalsCards],
  templateUrl: './viewusers.html',
  styleUrl: './viewusers.css',
})
export class Viewusers {

  // tableIcons: string[];
  // tableHeads: string[];
  // columnKeys: string[];

  total: number = 0;
  userData!: User[];
  userColumns: any[];
  // userData!: any[];

  private loaderService = inject(Loaderservice);
  private httpService = inject(Httpservice);
  private routerRef = inject(Router);

  constructor() {
    this.userColumns = [
      { key: ["personal_info", "user_name"], icon: "assets/icons/uncolored/usericon.svg", label: "Name" },
      { key: ["personal_info", "user_email"], icon: "assets/icons/uncolored/email.svg", label: "Email" },
      { key: ["basic_info", "user_phone"], icon: "assets/icons/uncolored/phone.svg", label: "Phone" },
      { key: ["basic_info", "user_location"], icon: "assets/icons/uncolored/location.svg", label: "Location" },
      { key: ["team_info", "team_name"], icon: "assets/icons/uncolored/companybag.svg", label: "Team" },
      { key: "online", icon: "assets/icons/uncolored/statustick.svg", label: "Status" },
    ]

    this.getUserData();
  }

  onAddUserClick(){
    this.routerRef.navigate(['/users/add']);
  }

  getUserData() {
    this.loaderService.showLoader();
    this.httpService.getApi('users').pipe(
      finalize(() => {
        this.loaderService.hideLoader();
      }),
    ).subscribe({
      next: (res) => {
        console.log(res);
        this.userData = res.body;
      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  deleteUserData(val: any){
    console.log(val);
  }

}
