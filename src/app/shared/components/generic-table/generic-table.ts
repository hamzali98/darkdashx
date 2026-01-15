import { Component, EventEmitter, input, Input, Output, signal, OnChanges, SimpleChanges, computed, inject, model } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { tableColumns } from '@app/shared/interface/generic-table-interface';
import { TitleCasePipe, CurrencyPipe } from '@angular/common';
import { DataError } from "../data-error/data-error";

@Component({
  selector: 'app-generic-table',
  imports: [FormsModule, NgClass, TitleCasePipe, CurrencyPipe, DataError],
  templateUrl: './generic-table.html',
  styleUrl: './generic-table.css',
})
export class GenericTable<T> implements OnChanges {

  checked = signal(true);
  status = signal(false);

  itemsPerPage: number = 5;
  currentPage: number = 1;
  startIndex: number = 0;
  endIndex: number = 0;

  sortdirection = signal('');
  sortcol = signal('id');
  // searchterm = signal('');
  searchTerm = model('');

  currentPageData: T[] = [];

  tableName = input("Generic");

  checkList: any[] = [];




  @Input() tableData: T[] = [];
  @Input() columns: tableColumns<T>[] = [];

  @Output() onDeleteClicked: EventEmitter<any> = new EventEmitter();
  @Output() onEditClicked: EventEmitter<any> = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData']) {
      this.currentPage = 1;
      const pageResult = this.updatePagedData(this.tableData, this.currentPage, this.itemsPerPage);
      this.currentPageData = pageResult.currentPageData;
      this.startIndex = pageResult.startIndex;
      this.endIndex = pageResult.endIndex;
      // this.tableTotal = pageResult.tableTotal;
      // this.totalPages = pageResult.totalPages;
    }

    if (this.searchTerm()) {
      this.onDataSearch(this.searchTerm());
    }
  }

  get tableTotal() {
    return this.tableData?.length ?? 0;
  }

  get isIndeterminate() {
    // if (this.checkList.length === 0 || this.checkList.length === this.tableData.length) {
    if (this.checkList.length === 0 || this.checkList.length === this.currentPageData.length) {
      return false;
    } else {
      return true;
    }
  }

  get isChecked() {
    if (this.checkList.length === this.currentPageData.length) {
      return true;
    } else {
      return false;
    }
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

  checkUncheckRow(data: any, event: any) {
    if (this.checkList.includes(data)) {
      const index = this.checkList.indexOf(data);
      this.checkList.splice(index, 1);
    } else {
      this.checkList.push(data);
    }
    console.log(this.checkList);
  }

  // onCheckboxChange(event: any) {
  //   // console.log(event.target.id);
  //   console.log(`checked : ${event.target.checked} , id : ${event.target.id}`);
  // }

  toggleSelectallRows(event: any) {
    const checked = event.target.checked;
    if (checked) {
      // this.checkList = [...this.tableData];
      this.checkList = [...this.currentPageData]
    } else {
      this.checkList = [];
    }

    console.log("whole check list : ", this.checkList);
  }

  getValue(obj: any, key: any) {
    return key.reduce((access: any, key: any) => access?.[key], obj);
    // return key.split('.').reduce((access:any, key:any) => access?.[key], obj);
  }

  onClickedDelete(data: T) {
    // console.log(data);
    this.onDeleteClicked.emit(data);
  }

  onClickedEdit(data: T) {
    this.onEditClicked.emit(data);
  }

  get displayStartIndex() {
    return this.tableData ? this.startIndex + 1 : this.startIndex;
  }

  onChangePerPage() {
    console.log(this.itemsPerPage);
    // this.updatePagedData(this.tableData, this.currentPage, this.itemsPerPage);
    const pageResult = this.updatePagedData(this.tableData, this.currentPage, this.itemsPerPage);
      this.currentPageData = pageResult.currentPageData;
      this.startIndex = pageResult.startIndex;
      this.endIndex = pageResult.endIndex;
  }

  // updatePagedData() {
  //   this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
  //   this.endIndex = this.startIndex + this.itemsPerPage;
  //   if (this.endIndex > this.tableTotal) {
  //     this.endIndex = this.tableTotal;
  //   }
  //   this.currentPageData = this.tableData.slice(this.startIndex, this.endIndex);
  // }

  updatePagedData<T>(
    data: T[],
    currentPage: number,
    itemsPerPage: number
  ) {
    const tableTotal = data.length;

    const startIndex = (currentPage - 1) * itemsPerPage;

    let endIndex = startIndex + itemsPerPage;
    if (endIndex > tableTotal) {
      endIndex = tableTotal;
    }

    const currentPageData = data.slice(startIndex, endIndex);

    return {
      currentPageData,
      startIndex,
      endIndex,
      tableTotal,
      totalPages: Math.ceil(tableTotal / itemsPerPage),
    };
  }


  previousPage() {
    console.log('prev button clicked');
    if (this.currentPage > 1) {
      this.checkList = [];
      this.currentPage--;
      // this.updatePagedData(this.tableData, this.currentPage, this.itemsPerPage);
      const pageResult = this.updatePagedData(this.tableData, this.currentPage, this.itemsPerPage);
      this.currentPageData = pageResult.currentPageData;
      this.startIndex = pageResult.startIndex;
      this.endIndex = pageResult.endIndex;
    }
  }

  nextPage() {
    console.log('next button clicked');
    const totalpages = this.tableData.length / this.itemsPerPage;
    if (this.currentPage < totalpages) {
      // if(this.checkList.length >= 1) {
      // }
      this.checkList = [];
      this.currentPage++;
      // this.updatePagedData(this.tableData, this.currentPage, this.itemsPerPage);
      const pageResult = this.updatePagedData(this.tableData, this.currentPage, this.itemsPerPage);
      this.currentPageData = pageResult.currentPageData;
      this.startIndex = pageResult.startIndex;
      this.endIndex = pageResult.endIndex;

    }
  }

  // sorting
  doSorting(column: any) {
    console.log('sorting called on : ', column);
    console.log('sorting column : ', this.sortcol());
    console.log('sorting direction : ', this.sortdirection());
    if (this.sortcol() === column) {
      this.sortdirection.set(
        this.sortdirection() === 'asc'
          ? 'dsc'
          : this.sortdirection() === 'dsc'
            ? ''
            : 'asc'
      );
    } else {
      this.sortcol.set(column);
      this.sortdirection.set('asc');
    }
    console.log('sorting column : ', this.sortcol());
    console.log('sorting direction : ', this.sortdirection());
    console.log("table data", this.tableData);

    if (this.sortdirection() === 'asc') {
      this.currentPageData.sort((a: any, b: any) => (this.getValue(a, column) > this.getValue(b, column) ? 1 : -1));
    } else if (this.sortdirection() === 'dsc') {
      this.currentPageData.sort((a: any, b: any) => (this.getValue(b, column) > this.getValue(a, column) ? 1 : -1));
    } else {
      this.currentPageData = this.currentPageData;
    }
  }

  onDataSearch(value: string) {
    console.log(value);
    const filtereddata = this.filterData(this.tableData, value);
    // this.updatePagedData(filtereddata, this.currentPage, this.itemsPerPage);
    const pageResult = this.updatePagedData(filtereddata, this.currentPage, this.itemsPerPage);
      this.currentPageData = pageResult.currentPageData;
      this.startIndex = pageResult.startIndex;
      this.endIndex = pageResult.endIndex;
    // if (value) {
    //   console.log("condition called");
    //   this.currentPageData = this.currentPageData;
    //   this.currentPageData = filtereddata;
    // } else {
    //   console.log("else called");
    //   this.updatePagedData();
    // }
    // this.currentPageData = this.filterData(this.tableData, value);
    console.log(this.currentPageData);
  }

  filterData<T>(data: T[], searchText: string): T[] {
    if (!searchText) return data;

    const lowerSearch = searchText.toLowerCase();

    return data.filter(item =>
      JSON.stringify(item)
        .toLowerCase()
        .includes(lowerSearch)
    );
  }

  // filterUsers(users: any[], search: string) {
  //   search = search.toLowerCase();

  //   return users.filter(u =>
  //     u.personal_info.user_name.toLowerCase().includes(search) ||
  //     u.personal_info.user_email.toLowerCase().includes(search) ||
  //     u.team_info.team_name.toLowerCase().includes(search)
  //   );
  // }


}

