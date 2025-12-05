import { Component, signal } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-generic-table',
  imports: [NgClass],
  templateUrl: './generic-table.html',
  styleUrl: './generic-table.css',
})
export class GenericTable {

  checked = signal(true);
  status = signal(false);

  onChecked(){
    this.checked.update(v => !v);
  }

  onStatus(){
    this.status.update(v => !v);
  }


}

