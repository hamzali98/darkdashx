import {
  Component,
  EventEmitter,
  input,
  Input,
  Output,
  signal,
  OnChanges,
  SimpleChanges,
  inject,
  model,
  viewChild,
  ElementRef
} from '@angular/core';
import { NgClass, TitleCasePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { tableColumns } from '@app/shared/interface/generic-table-interface';
import { DataError } from "../data-error/data-error";
import { DialogService } from '@app/shared/services/dialog-service/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '@app/core/services/translate.service';

// ─── npm install xlsx jspdf jspdf-autotable ───────────────────────────────────
import * as XLSX from 'xlsx';
import { TooltipDirective } from "@app/shared/directive/tooltip/tooltip";
import { TickAnimationService } from '@app/shared/services/tick-animation/tick-animation-service';
// ─────────────────────────────────────────────────────────────────────────────


@Component({
  selector: 'app-generic-table',
  imports: [
    FormsModule,
    NgClass,
    TitleCasePipe,
    CurrencyPipe,
    DataError,
    TranslateModule,
    TooltipDirective
  ],
  templateUrl: './generic-table.html',
  styleUrl: './generic-table.css',
})
export class GenericTable<T> implements OnChanges {

  checked = signal(true);
  status = signal(false);

  startIndex: number = 0;
  endIndex: number = 0;
  tableTotal: number = 0;
  totalPages: number = 0;

  sortdirection = signal('');
  sortcol = signal('id');
  searchTerm = model('');

  currentPageData: T[] = [];
  checkList: any[] = [];
  private filteredData: T[] = [];

  tableName = input("Generic");
  @Input() itemsPerPage: number = 5;
  @Input() initialPage: number = 1;
  currentPage: number = this.initialPage;
  @Input() tableData: T[] = [];
  @Input() columns: tableColumns<T>[] = [];

  @Output() onDeleteClicked: EventEmitter<any> = new EventEmitter();
  @Output() deleteAllClicked: EventEmitter<any> = new EventEmitter();
  @Output() onEditClicked: EventEmitter<any> = new EventEmitter();

  genericTableData = viewChild<ElementRef>('genericDataTable');
  // @viewChild('genericDataTable') genericTableData! : ElementRef;

  private dialogService = inject(DialogService);
  private translateService = inject(TranslationService);
  private tickAnimationService = inject(TickAnimationService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData'] && this.tableData) {
      this.checkList = []; // Clear selections on data change
      this.filteredData = [...this.tableData];
      this.currentPage = 1;
      // paging logic
      const pageResult = this.updatePagedData(this.filteredData, this.currentPage, this.itemsPerPage);
      this.currentPageData = pageResult.currentPageData;
      this.startIndex = pageResult.startIndex;
      this.endIndex = pageResult.endIndex;
      this.tableTotal = pageResult.tableTotal;
      this.totalPages = pageResult.totalPages;
    }

    // search filter
    if (changes['searchTerm']) {
      this.onDataSearch(this.searchTerm() || '');
    }
  }

  // selection indeterminate
  get isIndeterminate() {
    return this.checkList.length > 0 && this.checkList.length < this.currentPageData.length;
  }

  // is checked and state validation
  get isChecked() {
    return this.currentPageData.length > 0 && this.checkList.length === this.currentPageData.length;
  }

  get selectedItems() {
    return this.checkList.length;
  }

  imgSrc(src: any) {
    // console.log("src of img", src);
    return `assets/logos/${src}.svg`;
  }

  IncludesTableData(data: any) {
    return this.checkList.includes(data);
  }

  // rows deselecting
  checkUncheckRow(data: T, event: any) {
    const index = this.checkList.indexOf(data);
    index > -1 ? this.checkList.splice(index, 1) : this.checkList.push(data);
  }

  // all rows selection
  toggleSelectallRows(event: any) {
    if (event.target.checked) {
      const newSelections = this.currentPageData.filter(item => !this.checkList.includes(item));
      this.checkList.push(...newSelections);
    } else {
      this.checkList = this.checkList.filter(item => !this.currentPageData.includes(item));
    }
  }

  getValue(obj: any, key: any) {
    return key.reduce((access: any, key: any) => access?.[key], obj);
    // return key.split('.').reduce((access:any, key:any) => access?.[key], obj);
  }

  onClickedDelete(data: T) {
    const isRTL = this.translateService.getCurrentLanguage() === 'ur';
    this.dialogService.open({
      actbtn: isRTL ? 'حذف کریں' : 'Delete',
      title: isRTL ? '⚠️ حذف کرنے کی انتباہ' : '⚠️ Action Alert',
      message: isRTL ? 'کیا آپ واقعی اس اندراج کو حذف کرنا چاہتے ہیں؟' : 'Are you sure you want to delete this entry',
      type: 'generic'
    }).subscribe(result => {
      if (result) {
        this.onDeleteClicked.emit(data);
      } else {
        // User clicked Cancel - do nothing
        // console.log('User cancelled deletion');
      }
    });
  }

  deleteAll() {
    const isRTL = this.translateService.getCurrentLanguage() === 'ur';
    this.dialogService.open({
      actbtn: isRTL ? 'حذف کریں' : 'Delete',
      title: isRTL ? '⚠️ حذف کرنے کی انتباہ' : '⚠️ Action Alert',
      message: isRTL ?
        `کیا آپ واقعی ${this.checkList.length} ${this.checkList.length === 1 ? 'اندراج' : 'اندراجات'} کو حذف کرنا چاہتے ہیں؟ `
        : `Are you sure you want to delete ${this.checkList.length} ${this.checkList.length === 1 ? 'entry' : 'entries'}?`,
      type: 'generic'
    }).subscribe(result => {
      if (result) {
        console.log("event emitting!");
        console.log("Deleting items:", this.checkList);
        this.deleteAllClicked.emit(this.checkList);
        // this.deleteAllClicked.emit("emitted!");
      } else {
        // User clicked Cancel - do nothing
        // console.log('User cancelled deletion');
      }
    });
  }

  onClickedEdit(data: T) {
    this.onEditClicked.emit(data);
  }

  onChangePerPage() {
    this.currentPage = 1;
    this.checkList = [];
    if (!this.filteredData || this.filteredData.length === 0) {
      this.filteredData = [...this.tableData];
    }
    const sourceData = this.filteredData.length > 0 ? this.filteredData : [...this.tableData];
    const pageResult = this.updatePagedData(sourceData, this.currentPage, this.itemsPerPage);
    // const pageResult = this.updatePagedData(this.filteredData, this.currentPage, this.itemsPerPage);
    this.currentPageData = pageResult.currentPageData;
    this.startIndex = pageResult.startIndex;
    this.endIndex = pageResult.endIndex;
    this.tableTotal = pageResult.tableTotal;
    this.totalPages = pageResult.totalPages;
  }

  updatePagedData<T>(
    data: T[],
    currentPage: number,
    itemsPerPage: number
  ) {
    const tableTotal = data.length;
    const startIndex = Number((currentPage - 1)) * Number(itemsPerPage);
    let endIndex = Number(startIndex) + Number(itemsPerPage);
    if (endIndex > tableTotal) {
      endIndex = Number(tableTotal);
    }

    const currentPageData = data.slice(startIndex, endIndex);
    return {
      currentPageData,
      startIndex,
      endIndex,
      tableTotal,
      totalPages: Math.ceil(Number(tableTotal) / Number(itemsPerPage)),
    };
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.checkList = [];
      this.currentPage--;
      const pageResult = this.updatePagedData(this.filteredData, this.currentPage, this.itemsPerPage);
      this.currentPageData = pageResult.currentPageData;
      this.startIndex = pageResult.startIndex;
      this.endIndex = pageResult.endIndex;
      this.tableTotal = pageResult.tableTotal;
      this.totalPages = pageResult.totalPages;
    }
  }

  nextPage() {
    const totalpages = Math.ceil(Number(this.filteredData.length) / Number(this.itemsPerPage));
    if (this.currentPage < totalpages) {
      this.checkList = [];
      this.currentPage++;
      const pageResult = this.updatePagedData(this.filteredData, this.currentPage, this.itemsPerPage);
      this.currentPageData = pageResult.currentPageData;
      this.startIndex = pageResult.startIndex;
      this.endIndex = pageResult.endIndex;
      this.tableTotal = pageResult.tableTotal;
      this.totalPages = pageResult.totalPages;
    }
  }

  // sorting
  // Replace entire doSorting method to sort tableData, then update pagination:
  doSorting(column: any) {
    if (this.sortcol() === column) {
      this.sortdirection.set(this.sortdirection() === 'asc' ? 'dsc' : this.sortdirection() === 'dsc' ? '' : 'asc');
    } else {
      this.sortcol.set(column);
      this.sortdirection.set('asc');
    }

    if (this.sortdirection() === 'asc') {
      this.tableData.sort((a: any, b: any) => (this.getValue(a, column) > this.getValue(b, column) ? 1 : -1));
      this.filteredData.sort((a: any, b: any) => (this.getValue(a, column) > this.getValue(b, column) ? 1 : -1));
    } else if (this.sortdirection() === 'dsc') {
      this.tableData.sort((a: any, b: any) => (this.getValue(b, column) > this.getValue(a, column) ? 1 : -1));
      this.filteredData.sort((a: any, b: any) => (this.getValue(b, column) > this.getValue(a, column) ? 1 : -1));
    }

    const pageResult = this.updatePagedData(this.filteredData, this.currentPage, this.itemsPerPage);
    this.currentPageData = pageResult.currentPageData;
    this.startIndex = pageResult.startIndex;
    this.endIndex = pageResult.endIndex;
  }

  onDataSearch(value: string) {
    this.currentPage = 1;
    this.filteredData = (!value || value.trim() === '')
      ? [...this.tableData]
      : this.filterData(this.tableData, value);

    const pageResult = this.updatePagedData(this.filteredData, 1, this.itemsPerPage);
    this.currentPageData = pageResult.currentPageData;
    this.startIndex = pageResult.startIndex;
    this.endIndex = pageResult.endIndex;
    this.tableTotal = pageResult.tableTotal;
    this.totalPages = pageResult.totalPages;
  }

  filterData<T>(data: T[], searchText: string): T[] {
    if (!searchText || searchText.trim() === '') return data;
    const lowerSearch = searchText.toLowerCase();
    return data.filter(item =>
      JSON.stringify(item)
        .toLowerCase()
        .includes(lowerSearch)
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // EXPORT HELPERS
  // ─────────────────────────────────────────────────────────────────────────

  private getDisplayValue(row: any, col: tableColumns<T>): string {
    if (col.func) {
      const raw = Array.isArray(col.key)
        ? this.getValue(row, col.key)
        : row[col.key as string];
      return col.func(raw) ?? '';
    }
    const val = Array.isArray(col.key)
      ? this.getValue(row, col.key)
      : row[col.key as string];
    return val !== null && val !== undefined ? String(val) : '';
  }

  // ── Translates status values that come from func transformers ──────────────
  // e.g.  "ONLINE" → "Online" / "آن لائن"  |  "IN_STOCK" → "In Stock" / "دستیاب"
  private translateStatusValue(raw: string): string {
    const key = raw.toUpperCase();
    const map: Record<string, string> = {
      ONLINE: this.translateService.instant('ONLINE'),
      OFFLINE: this.translateService.instant('OFFLINE'),
      IN_STOCK: this.translateService.instant('IN_STOCK'),
      OUT_OF_STOCK: this.translateService.instant('OUT_OF_STOCK'),
    };
    return map[key] ?? raw;
  }

  private buildExportData(): { headers: string[]; rows: string[][] } {
    // Translate column header labels
    const headers = this.columns.map(col => {
      const label = col.label ?? String(col.key);
      // instant() returns the key itself when no translation found, so it's safe
      return this.translateService.instant(label);
    });

    const rows = this.tableData.map(row =>
      this.columns.map(col => {
        const raw = this.getDisplayValue(row, col);
        // Translate status values (produced by func transformers)
        return col.func ? this.translateStatusValue(raw) : raw;
      })
    );

    return { headers, rows };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // XLSX EXPORT
  // ─────────────────────────────────────────────────────────────────────────

  downloadXLSX(): void {
    const { headers, rows } = this.buildExportData();
    const tableName = this.tableName() ?? 'Table';

    // Sheet data: header row + data rows
    const wsData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Auto column widths
    ws['!cols'] = headers.map((h, i) => ({
      wch: Math.min(
        Math.max(h.length, ...rows.map(r => (r[i] ?? '').length)) + 4,
        50
      )
    }));

    // Freeze header row
    ws['!freeze'] = { xSplit: 0, ySplit: 1 };

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, tableName.slice(0, 31)); // sheet name max 31 chars
    this.tickAnimationService.show(this.translateService.instant('EXPORT_SUCCESS'), 3000);
    setTimeout(() => {
      XLSX.writeFile(wb, `${tableName}-${new Date().toISOString().slice(0, 10)}.csv`);
    }, 1500);
  }

  downloadPDF() {
    const msg = this.translateService.instant("Service not available yet!")
    alert(msg);
  }
}

