import { Component, model } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {

  searchKey = model("");

  updateSerchKey(key: string){
    this.searchKey.set(key)
  }

}
