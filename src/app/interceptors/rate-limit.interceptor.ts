import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, EMPTY, timer, retry } from 'rxjs';
import { MessageService } from 'primeng/api';
import { RateLimitService } from '../services/rateLimitService/rate-limit.service';

const MAX_RETRIES = 4;
const BASE_DELAY_MS = 20_000;  // 20s → 40s → 80s → 160s

function isRetryable(status: number): boolean {
  return status === 429 || (status >= 500 && status <= 599);
}

function backoffDelay(attempt: number): number {
  const exponential = BASE_DELAY_MS * Math.pow(2, attempt); // 20s, 40s, 80s, 160s
  const jitter = Math.random() * BASE_DELAY_MS;             // 0–20s random jitter
  return exponential + jitter;
}

export const rateLimitInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const rateLimitService = inject(RateLimitService);

  if (rateLimitService.isRateLimited()) return EMPTY;

  return next(req).pipe(
    retry({
      count: MAX_RETRIES,
      delay: (error: HttpErrorResponse, attempt: number) => {
        if (!isRetryable(error?.status)) return throwError(() => error);
        const delayMs = backoffDelay(attempt - 1);
        rateLimitService.startRetryCountdown(Math.round(delayMs / 1000), messageService);
        return timer(delayMs);
      },
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 429) {
        const retryAfter = error.headers?.get('Retry-After');
        const parsed = retryAfter ? parseInt(retryAfter, 10) : NaN;
        const cooldown = isNaN(parsed) ? BASE_DELAY_MS / 1000 : parsed;
        rateLimitService.activateCooldown(cooldown, messageService);
      }
      return throwError(() => error);
    })
  );
};
