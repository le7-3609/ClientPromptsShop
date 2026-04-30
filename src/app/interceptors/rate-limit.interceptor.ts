import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, EMPTY } from 'rxjs';
import { MessageService } from 'primeng/api';
import { RateLimitService } from '../services/rateLimitService/rate-limit.service';

const DEFAULT_COOLDOWN_SECONDS = 60;

export const rateLimitInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const rateLimitService = inject(RateLimitService);

  // Block outgoing request immediately if cooldown is active
  if (rateLimitService.isRateLimited()) return EMPTY;

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 429) return throwError(() => error);

      const retryAfter = error.headers.get('Retry-After');
      const parsed = retryAfter ? parseInt(retryAfter, 10) : NaN;
      const cooldown = isNaN(parsed) ? DEFAULT_COOLDOWN_SECONDS : parsed;

      rateLimitService.activateCooldown(cooldown);

      // De-duplication: only show one toast per cooldown window
      if (!rateLimitService.isToastActive) {
        rateLimitService.isToastActive = true;
        messageService.add({
          severity: 'warn',
          summary: 'Too Many Requests',
          detail: `Too many requests. Retrying in ${cooldown} seconds...`,
          life: cooldown * 1000,
          styleClass: 'rate-limit-toast',
          data: { cooldown },
        });
      }

      return throwError(() => error);
    })
  );
};
