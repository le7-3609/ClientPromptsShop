import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/authService/auth-service';
import { firstValueFrom } from 'rxjs';
import { filter, take } from 'rxjs/operators';

export const roleGuard: CanActivateFn = async (route, state) => {
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

  if (!authService.isLoggedIn()) {
    router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  const requiredRoles = route.data['roles'] as string[] | undefined;

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const hasRequiredRole = requiredRoles.some(role => authService.hasRole(role));

  if (hasRequiredRole) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
