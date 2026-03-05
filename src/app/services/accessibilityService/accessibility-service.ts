import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export type FontScale = 'normal' | 'large' | 'xl';

export interface AccessibilitySettings {
  highContrast: boolean;
  fontScale: FontScale;
  reducedMotion: boolean;
  focusIndicators: boolean;
}

const STORAGE_KEY = 'a11y-settings';
const DEFAULTS: AccessibilitySettings = {
  highContrast: false,
  fontScale: 'normal',
  reducedMotion: false,
  focusIndicators: false,
};

@Injectable({ providedIn: 'root' })
export class AccessibilityService {
  private doc = inject(DOCUMENT);

  private settingsSubject = new BehaviorSubject<AccessibilitySettings>(this.load());
  settings$ = this.settingsSubject.asObservable();

  get settings(): AccessibilitySettings { return this.settingsSubject.value; }

  constructor() { this.apply(this.settings); }

  toggleHighContrast()    { this.update({ highContrast:    !this.settings.highContrast }); }
  toggleReducedMotion()   { this.update({ reducedMotion:   !this.settings.reducedMotion }); }
  toggleFocusIndicators() { this.update({ focusIndicators: !this.settings.focusIndicators }); }

  setHighContrast(v: boolean)    { this.update({ highContrast: v }); }
  setReducedMotion(v: boolean)   { this.update({ reducedMotion: v }); }
  setFocusIndicators(v: boolean) { this.update({ focusIndicators: v }); }
  setFontScale(s: FontScale) { this.update({ fontScale: s }); }
  reset() { this.update({ ...DEFAULTS }); }

  private update(p: Partial<AccessibilitySettings>) {
    const next = { ...this.settings, ...p };
    this.settingsSubject.next(next);
    this.apply(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  private apply(s: AccessibilitySettings) {
    const h = this.doc.documentElement;
    h.classList.toggle('a11y-high-contrast',    s.highContrast);
    h.classList.toggle('a11y-reduced-motion',   s.reducedMotion);
    h.classList.toggle('a11y-focus-indicators', s.focusIndicators);
    h.classList.remove('a11y-font-large', 'a11y-font-xl');
    if (s.fontScale === 'large') h.classList.add('a11y-font-large');
    if (s.fontScale === 'xl')    h.classList.add('a11y-font-xl');
  }

  private load(): AccessibilitySettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch {}
    return { ...DEFAULTS };
  }
}
