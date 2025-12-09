import { Component, NgModule, EventEmitter, input, Input, OnInit, Output, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { User } from '@app/features/users/interface/user';
import { FormsModule } from '@angular/forms';

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

  checkList : any[] = [];

  checked = signal(true);
  status = signal(false);
  tableName = input("Generic");

  @Input() tableData: T[] = [];
  @Input() columns: tableColumns<T>[] = [];

  @Output() onDeleteClicked : EventEmitter<any> = new EventEmitter();
  @Output() onEditClicked : EventEmitter<any> = new EventEmitter();

  get tableTotal() {
    return this.tableData.length;
  }

  onChangePerPage(){
    console.log(this.itemsPerPage);
  }

  onChecked(data: any) {
    console.log(data);
    if(this.checkList.includes(data)){
      const index = this.checkList.indexOf(data);
      console.log(index);
      this.checkList.splice(index, 1);
    } else {
      this.checkList.push(data);
    }
    console.log(this.checkList);
  }

  onCompare(){
    if(this.tableData.length === this.checkList.length){
      return 1;
    } else if(this.tableData.length !== this.checkList.length && this.checkList.length !== 0){
      return 2;
    } else {
      return 3;
    }
  }

  onAllCheck(){
    if(this.checkList.length === 0){
      this.checkList = this.tableData;
    } else {
      this.checkList = [];
    }
    console.log(this.checkList);
  }

  onContains(data : any){
    return this.checkList.includes(data) ? true : false;
  }

  getValue(obj: any, key: any) {
    return key.reduce((access: any, key: any) => access?.[key], obj);
    // return key.split('.').reduce((access:any, key:any) => access?.[key], obj);
  }

  onClickedDelete(data: T){
    // console.log(data);
    this.onDeleteClicked.emit(data);
  }

  onClickedEdit(data: T){
    this.onEditClicked.emit(data);
  }
}

