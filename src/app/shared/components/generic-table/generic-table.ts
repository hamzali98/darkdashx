import { Component, NgModule, EventEmitter, input, Input, OnInit, Output, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { User } from '@app/features/users/interface/user';
import { FormsModule } from '@angular/forms';

// export interface checkList {
//   checkBox: boolean,
//   checkboxId: string,
//   data: Object,
// }

export interface tableColumns<T> {
  key: keyof T,
  render?: (row: T) => any;
  icon?: string[],
  label: string,
}

@Component({
  selector: 'app-generic-table',
  imports: [NgClass, FormsModule],
  templateUrl: './generic-table.html',
  styleUrl: './generic-table.css',
})
export class GenericTable<T> {

  itemsPerPage: number = 10;

  checkList: any[] = [];

  checked = signal(true);
  status = signal(false);
  tableName = input("Generic");

  @Input() tableData: T[] = [];
  @Input() columns: tableColumns<T>[] = [];

  @Output() onDeleteClicked: EventEmitter<any> = new EventEmitter();
  @Output() onEditClicked: EventEmitter<any> = new EventEmitter();

  get tableTotal() {
    return this.tableData.length;
  }

  get isIndeterminate(){
    if(this.checkList.length === 0 || this.checkList.length === this.tableData.length){
      return false;
    } else {
      return true;
    }
  }

  get isChecked(){
    if (this.checkList.length === this.tableData.length){
      return true;
    } else {
      return false;
    }
  }

  IncludesTableData(data:any){
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

  onCheckboxChange(event: any) {
    // console.log(event.target.id);
    console.log(`checked : ${event.target.checked} , id : ${event.target.id}`);
  }

  toggleSelectallRows(event : any){
    const checked = event.target.checked;
    if(checked){
      this.checkList = [...this.tableData];
    } else {
      this.checkList = [];
    }

    console.log("whole check list : ", this.checkList);
  }

  onChangePerPage() {
    console.log(this.itemsPerPage);
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
}

