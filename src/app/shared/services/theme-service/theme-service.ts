// theme.service.ts
import { Injectable, signal, effect } from '@angular/core';

export interface AppTheme {
  id: string;
  name: string;
  desc: string;
  vars: Record<string, string>;
}

export const THEMES: AppTheme[] = [
  {
    id: 'midnight', name: 'Midnight', desc: 'Default dark',
    vars: {
      '--color-primary': '#cb3cff',
      '--color-secondary2': '#00c2ff',
      '--color-secondary': '#aeb9e1',
      '--color-primary-bg': '#081027',
      '--color-card-bg': '#0b1738',
      '--color-input-bg': '#0b1739',
      '--color-border': '#343b4f',
      '--color-figma-neutral': '#AEB9E1',
      '--color-active-route-bg': '#0a1330',
      '--color-btn-secondary': '#0a1330',
      '--color-button-primary': '#c23af4',
      '--color-active-route-text': '#cb3cff',
      '--color-up-green-arrow': '#14CA74',
      '--color-down-red-arrow': '#FF5A65',
      '--color-lim-green': '#32CD32',
      '--color-purple': '#6C72FF',
    }
  },
  {
    id: 'ocean', name: 'Ocean', desc: 'Deep blue tones',
    vars: {
      '--color-primary': '#00c2ff',
      '--color-secondary2': '#6C72FF',
      '--color-secondary': '#a8c4e0',
      '--color-primary-bg': '#05142b',
      '--color-card-bg': '#0a1f3d',
      '--color-input-bg': '#0d2340',
      '--color-border': '#1a3050',
      '--color-figma-neutral': '#a8c4e0',
      '--color-active-route-bg': '#071830',
      '--color-btn-secondary': '#071830',
      '--color-button-primary': '#00a8e0',
      '--color-active-route-text': '#00c2ff',
      '--color-up-green-arrow': '#14CA74',
      '--color-down-red-arrow': '#FF5A65',
      '--color-lim-green': '#32CD32',
      '--color-purple': '#6C72FF',
    }
  },
  {
    id: 'forest', name: 'Forest', desc: 'Earthy greens',
    vars: {
      '--color-primary': '#14CA74',
      '--color-secondary2': '#32CD32',
      '--color-secondary': '#a8c9b0',
      '--color-primary-bg': '#071a0f',
      '--color-card-bg': '#0d2a18',
      '--color-input-bg': '#0f2a1a',
      '--color-border': '#1a3d25',
      '--color-figma-neutral': '#a8c9b0',
      '--color-active-route-bg': '#0a2214',
      '--color-btn-secondary': '#0a2214',
      '--color-button-primary': '#10b866',
      '--color-active-route-text': '#14CA74',
      '--color-up-green-arrow': '#14CA74',
      '--color-down-red-arrow': '#FF5A65',
      '--color-lim-green': '#32CD32',
      '--color-purple': '#6C72FF',
    }
  },
  {
    id: 'sunset', name: 'Sunset', desc: 'Warm & bold',
    vars: {
      '--color-primary': '#FF5A65',
      '--color-secondary2': '#ff9f43',
      '--color-secondary': '#e0b8a8',
      '--color-primary-bg': '#1a0d07',
      '--color-card-bg': '#2a1510',
      '--color-input-bg': '#251208',
      '--color-border': '#3d2018',
      '--color-figma-neutral': '#e0b8a8',
      '--color-active-route-bg': '#1f0f08',
      '--color-btn-secondary': '#1f0f08',
      '--color-button-primary': '#e04550',
      '--color-active-route-text': '#FF5A65',
      '--color-up-green-arrow': '#14CA74',
      '--color-down-red-arrow': '#FF5A65',
      '--color-lim-green': '#32CD32',
      '--color-purple': '#6C72FF',
    }
  },
  {
    id: 'slate', name: 'Slate', desc: 'Neutral dark',
    vars: {
      '--color-primary': '#6C72FF',
      '--color-secondary2': '#aeb9e1',
      '--color-secondary': '#9ca3be',
      '--color-primary-bg': '#0f1117',
      '--color-card-bg': '#181b23',
      '--color-input-bg': '#1a1e28',
      '--color-border': '#2d3148',
      '--color-figma-neutral': '#9ca3be',
      '--color-active-route-bg': '#131720',
      '--color-btn-secondary': '#131720',
      '--color-button-primary': '#5a60e0',
      '--color-active-route-text': '#6C72FF',
      '--color-up-green-arrow': '#14CA74',
      '--color-down-red-arrow': '#FF5A65',
      '--color-lim-green': '#32CD32',
      '--color-purple': '#6C72FF',
    }
  },
];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'app-theme';

  activeThemeId = signal<string>('midnight');

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY) ?? 'midnight';
    this.applyTheme(saved);

    effect(() => {
      const id = this.activeThemeId();
      this.applyTheme(id);
      localStorage.setItem(this.STORAGE_KEY, id);
    });
  }

  private applyTheme(id: string) {
    const theme = THEMES.find(t => t.id === id) ?? THEMES[0];
    const root = document.documentElement;
    // in applyTheme() in your service, also set:
document.documentElement.setAttribute('data-theme', id);
    Object.entries(theme.vars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });
    this.activeThemeId.set(id);
  }

  setTheme(id: string) {
    this.activeThemeId.set(id);
  }

  getThemes() {
    return THEMES;
  }
}