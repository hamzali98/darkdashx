import { AfterViewInit, Component, inject, OnInit, Signal, signal } from '@angular/core';
import { GenericTable } from '@app/shared/components/generic-table/generic-table';
import { TotalsCards } from "@app/shared/components/totals-cards/totals-cards";
import { User } from '../interface/user';
import { Loaderservice } from '@app/shared/services/loader/loaderservice';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { SearchBar } from "@app/shared/components/search-bar/search-bar";
import { Formservice } from '../adduser/services/formservice';
import { environment } from '@environments/environment.development';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar-service';
import { TranslationService } from '@app/core/services/translate.service';
import { TranslateModule } from '@ngx-translate/core';
import { DataFetchService } from '@app/shared/services/data/data-fetch-service';

@Component({
  selector: 'app-viewusers',
  imports: [GenericTable, TotalsCards, SearchBar, TranslateModule],
  templateUrl: './viewusers.html',
  styleUrl: './viewusers.css',
})
export class Viewusers implements OnInit, AfterViewInit {

  url: string = environment.USER_URL;
  
  length = signal(0)
  parentSearchKey = signal('');
  
  userData = signal<User[]>([]);

  private userTableConfig: any[];

  private loaderService = inject(Loaderservice);
  private httpService = inject(Httpservice);
  private routerRef = inject(Router);
  private userFormService = inject(Formservice);
  private snackService = inject(SnackBarService);
  private translationService = inject(TranslationService);
  private dataFetchService = inject(DataFetchService);

  constructor() {
    // this.dataFetchService.ngOnInit();

    this.userTableConfig = [
      {
        id: 'id', key: ["personal_info", "user_name"], subkey: ["personal_info", "user_email"],
        icon: "assets/icons/neutral/usericon.svg", label: "NAME"
      },
      // { id: 'id', key: ["personal_info", "user_email"], icon: "assets/icons/neutral/email.svg", label: "Email" },
      { id: 'id', key: ["basic_info", "user_phone"], icon: "assets/icons/neutral/phone.svg", label: "PHONE" },
      { id: 'id', key: ["basic_info", "user_location"], icon: "assets/icons/neutral/location.svg", label: "LOCATION" },
      { id: 'id', key: ["team_info", "team_name"], icon: "assets/icons/neutral/bag.svg", label: "COMPANY" },
      { id: 'id', func: (v: any) => v === true ? "ONLINE" : "OFFLINE", key: "status", icon: "assets/icons/neutral/statustick.svg", label: "STATUS" },
    ];

    this.userFormService.resetForm();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.getUserfromService();
  }

  get isRTL(): boolean {
    return this.translationService.getCurrentLanguage() === 'ur';
  }

  get userTableConfiggetter() {
    return this.userTableConfig;
  }

  onAddUserClick() {
    this.routerRef.navigate(['/users/add']);
  }

  getUserfromService() {
    this.loaderService.showLoader();
    this.dataFetchService.sharedUserData().subscribe({
      next: (res) => {
        if (!res || res.length === 0) {
          this.snackService.error(this.isRTL ? "کوئی ڈیٹا نہیں ملا!" : "No data found", 2000, 'top-right');
        }
        this.userData.set(res);
        this.length.set(res.length ?? 0);
        this.loaderService.hideLoader();
        this.snackService.success(this.isRTL ? "ڈیٹا کامیابی سے لیا گیا!" : "Data fetched successfully!", 2000, 'top-right');
      },
      error: (err) => {
        this.loaderService.hideLoader();
        this.snackService.error(this.isRTL ? "سرور کی خرابی!" : "Server Error!", 2000, 'top-right');
      }
    })
  }

  deleteUserData(val: User) {
    this.loaderService.showLoader();
    // console.log("prod data in prod view", val);
    this.httpService.delApi(this.url, val.id).subscribe({
      next: (res) => {
        // console.log(res);
        this.snackService.success(this.isRTL ? "ڈیٹا کامیابی سے حذف ہو گیا!" : "Data deleted successfully!", 2000, 'bottom-right');
        // this.getUserData();
        // this.loaderService.hideLoader();
      },
      error: (err) => {
        // console.log(err);
        this.loaderService.hideLoader();
        this.snackService.error(this.isRTL ? "سرور کی خرابی!" : "Server Error!", 2000, 'bottom-right');
      }
    })
  }

  editUserData(val: User) {
    this.loaderService.showLoader();
    this.userFormService.patchFormData(val);
    this.loaderService.hideLoader();
    this.routerRef.navigate(['users/add']);
  }

}
