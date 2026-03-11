import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CustomInputConfig, GenericInput } from "../generic-input/generic-input";

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule, TranslateModule, GenericInput],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})

export class SearchBar {

  searchKey = model("");

  searchbarConfig: CustomInputConfig;

  constructor() {
    this.searchbarConfig = {
      ngclass: '',
      startIcon: 'assets/icons/neutral/search.svg',
      type: 'text',
      inputId: 'search',
      inputName: 'search',
      errorMessage: '',
      placeholder: 'SEARCH',
      iconActions: [
        {
          iconPath: 'assets/icons/input_icons/cross.svg',
          action: () => this.clearText(),
          isActive: () => !!this.searchKey(), 
        }
      ]
    }
  }

  updateSearchKey(key: string | null | undefined) {
    this.searchKey.set(key || "");
  }

  clearText() {
    this.searchKey.set("");
  }
}
