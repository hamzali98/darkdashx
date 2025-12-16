import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { GenericTable } from '@app/shared/components/generic-table/generic-table';
import { TotalsCards } from "@app/shared/components/totals-cards/totals-cards";
import { User } from '../interface/user';
import { Loaderservice } from '@app/core/services/loader/loaderservice';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { SearchBar } from "@app/shared/components/search-bar/search-bar";

@Component({
  selector: 'app-viewusers',
  imports: [GenericTable, TotalsCards, SearchBar],
  templateUrl: './viewusers.html',
  styleUrl: './viewusers.css',
})
export class Viewusers {

  length: number = 0;

  // totalUsers: number = 0;
  userData!: User[];
  userColumns: any[];

  private loaderService = inject(Loaderservice);
  private httpService = inject(Httpservice);
  private routerRef = inject(Router);

  constructor() {
    this.userColumns = [
      { id: 'id', key: ["personal_info", "user_name"], icon: "assets/icons/neutral/usericon.svg", label: "Name" },
      { id: 'id', key: ["personal_info", "user_email"], icon: "assets/icons/neutral/email.svg", label: "Email" },
      { id: 'id', key: ["basic_info", "user_phone"], icon: "assets/icons/neutral/phone.svg", label: "Phone" },
      { id: 'id', key: ["basic_info", "user_location"], icon: "assets/icons/neutral/location.svg", label: "Location" },
      { id: 'id', key: ["team_info", "team_name"], icon: "assets/icons/neutral/bag.svg", label: "Team" },
      { id: 'id', func: (v: any) => v === true ? "Online" : "Offline" , key: "status", icon: "assets/icons/neutral/statustick.svg", label: "Status" },
    ]
    this.getUserData();
  }

  onAddUserClick() {
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
        this.length = this.userData.length;
      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  deleteUserData(val: any) {
    console.log(val);
  }

}
