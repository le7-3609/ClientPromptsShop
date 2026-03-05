import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private doc = inject(DOCUMENT);
  private readonly STORAGE_KEY = 'theme-mode';
  
  isDark = false;

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    this.isDark = saved === 'dark';
    this.apply();
  }

  toggle() {
    this.isDark = !this.isDark;
    this.apply();
    localStorage.setItem(this.STORAGE_KEY, this.isDark ? 'dark' : 'light');
  }

  private apply() {
    this.doc.documentElement.classList.toggle('dark-mode', this.isDark);
  }
}
