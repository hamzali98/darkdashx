import { Injectable, signal, effect } from '@angular/core';

export interface AppTheme {
  id: string;
  name: string;
  desc: string;
  isDark: boolean;
  vars: Record<string, string>;
}

export const THEMES: AppTheme[] = [
  // ── DARK THEMES ──────────────────────────────────────────────
  {
    id: 'midnight', name: 'Midnight', desc: 'Default dark', isDark: true,
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
      '--color-primary-text': '#e2e8f0',
    }
  },
  {
    id: 'ocean', name: 'Ocean', desc: 'Deep blue tones', isDark: true,
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
      '--color-primary-text': '#dbeafe',
    }
  },
  {
    id: 'forest', name: 'Forest', desc: 'Earthy greens', isDark: true,
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
      '--color-primary-text': '#dcfce7',
    }
  },
  {
    id: 'sunset', name: 'Sunset', desc: 'Warm & bold', isDark: true,
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
      '--color-primary-text': '#fef3c7',
    }
  },
  {
    id: 'slate', name: 'Slate', desc: 'Neutral dark', isDark: true,
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
      '--color-primary-text': '#e2e8f0',
    },
  },
  {
    id: 'ember', name: 'Ember', desc: 'Deep crimson & gold', isDark: true,
    vars: {
      '--color-primary': '#ff6b35',
      '--color-secondary2': '#ffd700',
      '--color-secondary': '#c9a87c',
      '--color-primary-bg': '#120a04',
      '--color-card-bg': '#1e1008',
      '--color-input-bg': '#1a0e06',
      '--color-border': '#3d2510',
      '--color-figma-neutral': '#c9a87c',
      '--color-active-route-bg': '#180c05',
      '--color-btn-secondary': '#180c05',
      '--color-button-primary': '#e55a20',
      '--color-active-route-text': '#ff6b35',
      '--color-up-green-arrow': '#14CA74',
      '--color-down-red-arrow': '#FF5A65',
      '--color-lim-green': '#32CD32',
      '--color-purple': '#6C72FF',
      '--color-primary-text': '#fef3c7',
    }
  },

  // ── LIGHT THEMES ─────────────────────────────────────────────
  {
    id: 'cloud', name: 'Cloud', desc: 'Clean light', isDark: false,
    vars: {
      '--color-primary': '#7c3aed',
      '--color-secondary2': '#0ea5e9',
      '--color-secondary': '#475569',
      '--color-primary-bg': '#f1f5f9',
      '--color-card-bg': '#ffffff',
      '--color-input-bg': '#f8fafc',
      '--color-border': '#cbd5e1',
      '--color-figma-neutral': '#64748b',
      '--color-active-route-bg': '#ede9fe',
      '--color-btn-secondary': '#e2e8f0',
      '--color-button-primary': '#7c3aed',
      '--color-active-route-text': '#7c3aed',
      '--color-up-green-arrow': '#16a34a',
      '--color-down-red-arrow': '#dc2626',
      '--color-lim-green': '#16a34a',
      '--color-purple': '#7c3aed',
      '--color-primary-text': '#0f172a',
    }
  },
  {
    id: 'rose', name: 'Rose', desc: 'Soft & warm', isDark: false,
    vars: {
      '--color-primary': '#e11d48',
      '--color-secondary2': '#f97316',
      '--color-secondary': '#6b7280',
      '--color-primary-bg': '#fff1f2',
      '--color-card-bg': '#ffffff',
      '--color-input-bg': '#fff5f6',
      '--color-border': '#fecdd3',
      '--color-figma-neutral': '#9f1239',
      '--color-active-route-bg': '#ffe4e6',
      '--color-btn-secondary': '#fce7f3',
      '--color-button-primary': '#e11d48',
      '--color-active-route-text': '#e11d48',
      '--color-up-green-arrow': '#16a34a',
      '--color-down-red-arrow': '#dc2626',
      '--color-lim-green': '#16a34a',
      '--color-purple': '#9333ea',
      '--color-primary-text': '#1c0a0d',
    }
  },
  {
    id: 'arctic', name: 'Arctic', desc: 'Icy blues', isDark: false,
    vars: {
      '--color-primary': '#0284c7',
      '--color-secondary2': '#06b6d4',
      '--color-secondary': '#334155',
      '--color-primary-bg': '#f0f9ff',
      '--color-card-bg': '#ffffff',
      '--color-input-bg': '#f8fbff',
      '--color-border': '#bae6fd',
      '--color-figma-neutral': '#0369a1',
      '--color-active-route-bg': '#e0f2fe',
      '--color-btn-secondary': '#e0f2fe',
      '--color-button-primary': '#0284c7',
      '--color-active-route-text': '#0284c7',
      '--color-up-green-arrow': '#16a34a',
      '--color-down-red-arrow': '#dc2626',
      '--color-lim-green': '#16a34a',
      '--color-purple': '#6C72FF',
      '--color-primary-text': '#0c2a3d',
    }
  },
  {
    id: 'meadow', name: 'Meadow', desc: 'Fresh greens', isDark: false,
    vars: {
      '--color-primary': '#16a34a',
      '--color-secondary2': '#65a30d',
      '--color-secondary': '#374151',
      '--color-primary-bg': '#f0fdf4',
      '--color-card-bg': '#ffffff',
      '--color-input-bg': '#f6fef9',
      '--color-border': '#bbf7d0',
      '--color-figma-neutral': '#166534',
      '--color-active-route-bg': '#dcfce7',
      '--color-btn-secondary': '#dcfce7',
      '--color-button-primary': '#16a34a',
      '--color-active-route-text': '#16a34a',
      '--color-up-green-arrow': '#16a34a',
      '--color-down-red-arrow': '#dc2626',
      '--color-lim-green': '#16a34a',
      '--color-purple': '#6C72FF',
      '--color-primary-text': '#052e16',
    }
  },
  {
    id: 'sand', name: 'Sand', desc: 'Earthy neutrals', isDark: false,
    vars: {
      '--color-primary': '#b45309',
      '--color-secondary2': '#d97706',
      '--color-secondary': '#57534e',
      '--color-primary-bg': '#fefce8',
      '--color-card-bg': '#ffffff',
      '--color-input-bg': '#fffdf5',
      '--color-border': '#e7e5e4',
      '--color-figma-neutral': '#78716c',
      '--color-active-route-bg': '#fef3c7',
      '--color-btn-secondary': '#f5f5f4',
      '--color-button-primary': '#b45309',
      '--color-active-route-text': '#b45309',
      '--color-up-green-arrow': '#16a34a',
      '--color-down-red-arrow': '#dc2626',
      '--color-lim-green': '#16a34a',
      '--color-purple': '#6C72FF',
      '--color-primary-text': '#1c1008'
    },
  },
  {
    id: 'blossom', name: 'Blossom', desc: 'Soft lavender & pink', isDark: false,
    vars: {
      '--color-primary': '#9333ea',
      '--color-secondary2': '#ec4899',
      '--color-secondary': '#6b7280',
      '--color-primary-bg': '#faf5ff',
      '--color-card-bg': '#ffffff',
      '--color-input-bg': '#fdf4ff',
      '--color-border': '#e9d5ff',
      '--color-figma-neutral': '#7e22ce',
      '--color-active-route-bg': '#f3e8ff',
      '--color-btn-secondary': '#fce7f3',
      '--color-button-primary': '#9333ea',
      '--color-active-route-text': '#9333ea',
      '--color-up-green-arrow': '#16a34a',
      '--color-down-red-arrow': '#dc2626',
      '--color-lim-green': '#16a34a',
      '--color-purple': '#9333ea',
      '--color-primary-text': '#2e1065'
    }
  }
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
    document.documentElement.setAttribute('data-theme', id);

    // flip Tailwind's dark mode class
    if (theme.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

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

  getDarkThemes() {
    return THEMES.filter(t => t.isDark);
  }

  getLightThemes() {
    return THEMES.filter(t => !t.isDark);
  }
}