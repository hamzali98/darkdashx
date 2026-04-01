import { NgClass, SlicePipe, UpperCasePipe } from '@angular/common';
import { Component, effect, inject, Input, model, OnChanges, OnDestroy, OnInit, signal, SimpleChanges } from '@angular/core';
import { FormService } from '@app/features/dashboard/products/products-add/service/form-service';
import { Formservice } from '@app/features/users/adduser/services/formservice';
import { DataFetchService } from '@app/shared/services/data/data-fetch-service';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

// export interface SelectOption {
//   key: string;
//   value: any;
// }

export interface SelectOption {
  key: string;
  value: any;
  meta?: string;   // category · company for product / email for user
  active?: boolean;
}

@Component({
  selector: 'app-generic-drop-menu',
  imports: [NgClass, SlicePipe, UpperCasePipe, TranslatePipe],
  templateUrl: './generic-drop-menu.html',
  styleUrl: './generic-drop-menu.css',
})
export class GenericDropMenu implements OnInit, OnDestroy, OnChanges {

  isOpen = signal(false);

  selectedOption = signal<SelectOption | null>(null);
  dropdownPosition = signal<'bottom' | 'top'>('bottom');
  searchTerm = model();

  selectOptions = signal<SelectOption[]>([]);

  private subscription = new Subscription();

  @Input({ required: true }) key!: string;

  private dataService = inject(DataFetchService);
  private productFormService = inject(FormService);
  private userFormService = inject(Formservice);

  constructor() {
    // effect
    effect(() => {
      this.searchTerm(); // track the signal
      this.fetchDataOptions();
    });
  }

  ngOnInit() {
    // this triggers the fetch if not already loaded
    this.subscription.add(
      this.dataService.sharedProductData().subscribe(data => {
        // BehaviorSubject will emit current value immediately
        // and again when fetch completes
        console.log('product data loaded:', data);
      })
    );

    this.subscription.add(
      this.dataService.sharedUserData().subscribe(data => {
        console.log('user data loaded:', data);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
    // if(changes['searchTerm']){
    //   console.log("Searching...", this.searchTerm());
    //   this.fetchDataOptions();
    // }
  }

  get productData() {
    return this.dataService.getProductSnapshot();
  }
  get userData() {
    return this.dataService.getUserSnapshot();
  }


  fetchDataOptions() {
    const term = (this.searchTerm() as string)?.toLowerCase().trim();

    if (!term) {
      this.selectOptions.set([]); // clear when empty
      return;
    }

    if (this.key === 'product') {
      this.isOpen.set(true);
      const results = this.productData.filter(item =>
        JSON.stringify(item).toLowerCase().includes(term)
      );
      // map to SelectOption shape
      // this.selectOptions.set(results.map(item => ({
      //   key: item.basic_info.product_name,   // replace with actual product name field
      //   value: item.id
      // })));
      // product mapping
      this.selectOptions.set(results.map(item => ({
        key: item.basic_info.product_name,
        value: item.id,
        meta: `${item.basic_info.product_category} · ${item.basic_info.product_company}`,
        active: item.status
      })));

    } else {
      this.isOpen.set(true);
      const results = this.userData.filter(item =>
        JSON.stringify(item).toLowerCase().includes(term)
      );
      // this.selectOptions.set(results.map(item => ({
      //   key: item.personal_info.user_name,
      //   value: item.id
      // })));
      // user mapping:
      this.selectOptions.set(results.map(item => ({
        key: item.personal_info.user_name,
        value: item.id,
        meta: `${item.personal_info.user_email}`,
        active: item.status
      })));
    }
  }

  // ─── Select ───────────────────────────────────────────
  selectOption(option: SelectOption) {
    this.isOpen.set(false);
    console.log("Selected option : ", option);

    if (this.key === 'product') {
      const found = this.productData.find(item => item.id === option.value);
      if (found) {
        this.productFormService.patchForNewEntry(found);
      }

    } else {
      const found = this.userData.find(item => item.id === option.value);
      if (found) {
        this.userFormService.patchForNewEntry(found);
      }
    }
  }
}
