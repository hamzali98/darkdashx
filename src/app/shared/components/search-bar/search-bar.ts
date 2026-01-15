import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {

  searchKey = model("");

  // updateSerchKey(key: string){
  //   this.searchKey.set(key)
  // }

  updateSerchKey(key: string | null | undefined){
  this.searchKey.set(key || "");
}
}
