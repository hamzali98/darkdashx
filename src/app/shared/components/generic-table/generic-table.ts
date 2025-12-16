import { Component, EventEmitter, input, Input, Output, signal, OnChanges, SimpleChanges } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { tableColumns } from '@app/shared/interface/generic-table-interface';
import { TitleCasePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-generic-table',
  imports: [FormsModule, NgClass, TitleCasePipe, CurrencyPipe],
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
      this.updatePagedData();
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
    if (this.checkList.length === this.tableData?.length) {
      return true;
    } else {
      return false;
    }
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
    this.updatePagedData();
  }

  updatePagedData() {
    this.startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.endIndex = this.startIndex + this.itemsPerPage;
    if (this.endIndex > this.tableTotal) {
      this.endIndex = this.tableTotal;
    }
    this.currentPageData = this.tableData.slice(this.startIndex, this.endIndex);
  }

  previousPage() {
    console.log('prev button clicked');
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedData();
    }
  }

  nextPage() {
    console.log('next button clicked');
    const totalpages = this.tableData.length / this.itemsPerPage;
    if (this.currentPage < totalpages) {
      this.currentPage++;
      this.updatePagedData();
    }
  }


}

