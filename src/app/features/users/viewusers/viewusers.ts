import { AfterViewInit, Component, DestroyRef, inject, OnInit, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '@environments/environment.development';
import { GenericTable } from '@app/shared/components/generic-table/generic-table';
import { TotalsCards } from "@app/shared/components/totals-cards/totals-cards";
import { User } from '../interface/user';
import { Loaderservice } from '@app/shared/services/loader/loaderservice';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { SearchBar } from "@app/shared/components/search-bar/search-bar";
import { Formservice } from '../adduser/services/formservice';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar-service';
import { TranslationService } from '@app/core/services/translate.service';
import { DataFetchService } from '@app/shared/services/data/data-fetch-service';

@Component({
  selector: 'app-viewusers',
  imports: [GenericTable, TotalsCards, SearchBar, TranslateModule],
  templateUrl: './viewusers.html',
  styleUrl: './viewusers.css',
})
export class Viewusers implements OnInit {

  url: string = environment.USER_URL;

  length = signal(0)
  parentSearchKey = signal('');

  userData = signal<User[]>([]);

  private userTableConfig: any[];

  private routerRef = inject(Router);
  private destroyRef = inject(DestroyRef);
  private httpService = inject(Httpservice);
  private userFormService = inject(Formservice);
  // private loaderService = inject(Loaderservice);
  private snackService = inject(SnackBarService);
  private dataFetchService = inject(DataFetchService);
  private translationService = inject(TranslationService);

  constructor() {

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
    this.loadUsers();
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

  private loadUsers() {
    // this.loaderService.showLoader();

    this.dataFetchService.sharedUserData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {

          this.userData.set(res ?? []);
          this.length.set(res?.length ?? 0);

          // if (!res || res.length === 0) {
          //   this.snackService.error(
          //     this.isRTL ? "کوئی ڈیٹا نہیں ملا!" : "No data found",
          //     2000,
          //     'top-right'
          //   );
          // }
          // this.loaderService.hideLoader();
        },
        error: () => {
          this.snackService.error(
            this.isRTL ? "سرور کی خرابی!" : "Server Error!",
            2000,
            'top-right'
          );
          // this.loaderService.hideLoader();
        }
      });
  }

  deleteUserData(val: User) {
    // this.loaderService.showLoader();

    this.httpService.delApi(this.url, val.id).subscribe({
      next: (res) => {
        this.snackService.success(this.isRTL ? "ڈیٹا کامیابی سے حذف ہو گیا!" : "Data deleted successfully!", 2000, 'bottom-right');

        // 2️⃣ Now we update UI locally
        const updated = this.userData()
          .filter(p => p.id !== val.id);

        this.userData.set(updated); //component data update
        this.dataFetchService.refreshData("users", updated); // shared data update for other components
        // this.loaderService.hideLoader();
      },
      error: (err) => {
        // this.loaderService.hideLoader();
        this.snackService.error(this.isRTL ? "سرور کی خرابی!" : "Server Error!", 2000, 'bottom-right');
      }
    })
  }

  editUserData(val: User) {
    // this.loaderService.showLoader();
    this.userFormService.patchFormData(val);
    // this.loaderService.hideLoader();
    this.routerRef.navigate(['users/add']);
  }

}
