import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RateLimitService {
  readonly isRateLimited = signal(false);
  readonly remainingSeconds = signal(0);

  isToastActive = false;

  private _countdownInterval: ReturnType<typeof setInterval> | null = null;
  private _cooldownTimer: ReturnType<typeof setTimeout> | null = null;

  // Shows a ticking toast during a retry wait without blocking further requests
  startRetryCountdown(seconds: number, messageService: import('primeng/api').MessageService): void {
    this.remainingSeconds.set(seconds);
    this._clearCountdown();

    if (!this.isToastActive) {
      this.isToastActive = true;
      messageService.add({
        key: 'rate-limit',
        severity: 'warn',
        summary: 'Too Many Requests',
        detail: '',
        sticky: true,
        styleClass: 'rate-limit-toast',
      });
    }

    this._countdownInterval = setInterval(() => {
      const next = this.remainingSeconds() - 1;
      this.remainingSeconds.set(next);
      if (next <= 0) {
        this._clearCountdown();
        messageService.clear('rate-limit');
        this.isToastActive = false;
      }
    }, 1000);
  }

  activateCooldown(seconds: number, messageService: import('primeng/api').MessageService): void {
    if (this.isToastActive) return;

    this.isRateLimited.set(true);
    this.remainingSeconds.set(seconds);
    this.isToastActive = true;
    this._clearTimers();

    messageService.add({
      key: 'rate-limit',
      severity: 'warn',
      summary: 'Too Many Requests',
      detail: '',
      sticky: true,
      styleClass: 'rate-limit-toast',
    });

    this._countdownInterval = setInterval(() => {
      const next = this.remainingSeconds() - 1;
      this.remainingSeconds.set(next);
      if (next <= 0) this._clearTimers();
    }, 1000);

    this._cooldownTimer = setTimeout(() => {
      this.isRateLimited.set(false);
      this.remainingSeconds.set(0);
      this.isToastActive = false;
      messageService.clear('rate-limit');
      this._clearTimers();
    }, seconds * 1000);
  }

  private _clearCountdown(): void {
    if (this._countdownInterval) {
      clearInterval(this._countdownInterval);
      this._countdownInterval = null;
    }
  }

  private _clearTimers(): void {
    this._clearCountdown();
    if (this._cooldownTimer) {
      clearTimeout(this._cooldownTimer);
      this._cooldownTimer = null;
    }
  }
}
