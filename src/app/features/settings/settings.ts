import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ThemeService, THEMES } from '@app/shared/services/theme-service/theme-service';

@Component({
  selector: 'app-settings',
  imports: [NgClass],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  themeService = inject(ThemeService);
  themes = THEMES;
}
