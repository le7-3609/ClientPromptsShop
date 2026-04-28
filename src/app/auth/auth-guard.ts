import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authService/auth-service';
import { firstValueFrom } from 'rxjs';
import { filter, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthInitialized()) {
    await firstValueFrom(
      authService.authInitialized$.pipe(
        filter(initialized => initialized === true),
        take(1)
      )
    );
  }

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
  return false;
};
