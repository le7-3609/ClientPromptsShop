import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RateLimitService {
  readonly isRateLimited = signal(false);
  readonly remainingSeconds = signal(0);

  // Prevents duplicate toasts when multiple 429s fire simultaneously
  isToastActive = false;

  private _countdownInterval: ReturnType<typeof setInterval> | null = null;
  private _cooldownTimer: ReturnType<typeof setTimeout> | null = null;

  activateCooldown(seconds: number): void {
    this.isRateLimited.set(true);
    this.remainingSeconds.set(seconds);

    this._clearTimers();

    this._countdownInterval = setInterval(() => {
      const next = this.remainingSeconds() - 1;
      this.remainingSeconds.set(next);
      if (next <= 0) this._clearTimers();
    }, 1000);

    this._cooldownTimer = setTimeout(() => {
      this.isRateLimited.set(false);
      this.remainingSeconds.set(0);
      this.isToastActive = false;
      this._clearTimers();
    }, seconds * 1000);
  }

  private _clearTimers(): void {
    if (this._countdownInterval) {
      clearInterval(this._countdownInterval);
      this._countdownInterval = null;
    }
    if (this._cooldownTimer) {
      clearTimeout(this._cooldownTimer);
      this._cooldownTimer = null;
    }
  }
}
