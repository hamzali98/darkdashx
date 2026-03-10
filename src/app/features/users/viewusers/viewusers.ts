import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../interface/user';
import { TranslateModule } from '@ngx-translate/core';
import { Formservice } from '../adduser/services/formservice';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '@environments/environment.development';
import { SearchBar } from "@app/shared/components/search-bar/search-bar";
import { TranslationService } from '@app/core/services/translate.service';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { TotalsCards } from "@app/shared/components/totals-cards/totals-cards";
import { DataFetchService } from '@app/shared/services/data/data-fetch-service';
import { GenericTable } from '@app/shared/components/generic-table/generic-table';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar-service';
import { TickAnimationService } from '@app/shared/services/tick-animation/tick-animation-service';

@Component({
  selector: 'app-viewusers',
  imports: [GenericTable, TotalsCards, SearchBar, TranslateModule],
  templateUrl: './viewusers.html',
  styleUrl: './viewusers.css',
})
export class Viewusers implements OnInit {

  length = signal(0)

  parentSearchKey = signal('');
  private readonly url: string = environment.USER_URL;
  private readonly user_form_intent: string = 'user_form_intent';

  userData = signal<User[]>([]);
  private userTableConfig: any[];

  private routerRef = inject(Router);
  private destroyRef = inject(DestroyRef);
  private httpService = inject(Httpservice);
  private userFormService = inject(Formservice);
  private snackService = inject(SnackBarService);
  private dataFetchService = inject(DataFetchService);
  private translationService = inject(TranslationService);
  private tickAnimationService = inject(TickAnimationService);

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
    sessionStorage.setItem(this.user_form_intent, 'add');
    this.routerRef.navigate(['/users/add']);
  }

  editUserData(val: User) {
    sessionStorage.setItem(this.user_form_intent, 'edit');
    this.userFormService.patchFormData(val);
    this.routerRef.navigate(['users/add']);
  }

  private loadUsers() {
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
        },
        error: () => {
          this.snackService.error(
            this.isRTL ? "سرور کی خرابی!" : "Server Error!",
            2000,
            'top-right'
          );
        }
      });
  }

  deleteUserData(val: User) {
    this.httpService.delApi(this.url, val.id).subscribe({
      next: (res) => {
        this.snackService.success(this.isRTL ? "ڈیٹا کامیابی سے حذف ہو گیا!" : "Data deleted successfully!", 2000, 'bottom-right');

        // 2️⃣ Now we update UI locally
        const updated = this.userData()
          .filter(p => p.id !== val.id);

        this.userData.set(updated); //component data update
        this.dataFetchService.refreshData("users", updated); // shared data update for other components
        this.tickAnimationService.show(this.isRTL ? "حذف ہو گیا!" : "Deleted!", 3000);
      },
      error: (err) => {
        this.snackService.error(this.isRTL ? "سرور کی خرابی!" : "Server Error!", 2000, 'bottom-right');
      }
    });
  }

  deleteAllUserData(selectedItems: User[]) {

    console.log("Selected items to delete:", selectedItems);
    if (!selectedItems.length) return;

    // Create a queue of ids to delete
    const idsToDelete = [...selectedItems.map(item => item.id)];
    let deletedCount = 0;

    const deleteNext = (index: number) => {
      if (index >= idsToDelete.length) {
        // ✅ All done — show tick animation once at the end
        this.tickAnimationService.show(this.isRTL ? "حذف ہو گیا!" : "Deleted!", 3000);
        selectedItems = []; // clear selection
        return;
      }

      const id = idsToDelete[index];

      this.httpService.delApi(this.url, id).subscribe({
        next: (res) => {
          deletedCount++;

          // Update local data after each deletion
          const updated = this.userData().filter(p => p.id !== id);
          this.userData.set(updated);
          this.dataFetchService.refreshData("users", updated);

          // Show snack per item OR just once at the end — your choice
          this.snackService.success(
            this.isRTL
              ? `ڈیٹا کامیابی سے حذف ہو گیا! (${deletedCount}/${idsToDelete.length})`
              : `Deleted ${deletedCount} of ${idsToDelete.length}`,
            2000, 'bottom-right'
          );

          // 👇 Delete next item after this one succeeds
          deleteNext(index + 1);
        },
        error: (err) => {
          this.snackService.error(
            this.isRTL ? "سرور کی خرابی!" : `Failed to delete item ${index + 1}`,
            2000, 'bottom-right'
          );

          // ⚠️ Decide: stop on error OR continue to next
          // To STOP:  return;
          // To CONTINUE anyway:
          deleteNext(index + 1);
        }
      });
    };

    deleteNext(0); // kick off the chain
  }


}
