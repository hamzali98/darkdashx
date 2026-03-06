import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule, TranslateModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})

export class SearchBar {

  searchKey = model("");

  updateSearchKey(key: string | null | undefined) {
    this.searchKey.set(key || "");
  }

  clearText() {
    this.searchKey.set("");
  }
}
