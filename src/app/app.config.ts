import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeuix/themes/lara';
import { definePreset } from '@primeuix/themes';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { rateLimitInterceptor } from './interceptors/rate-limit.interceptor';

const PurplePreset = definePreset(Lara, {
  semantic: {
    primary: {
      50: '#f4f2ff',
      100: '#ece7ff',
      200: '#ddd2ff',
      300: '#c4adff',
      400: '#a67fff',
      500: '#8139eb',
      600: '#742fd5',
      700: '#6125b1',
      800: '#4f1f8f',
      900: '#431d75',
      950: '#2d0f52',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([rateLimitInterceptor])),
    MessageService,
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: PurplePreset,
        options: {
          darkModeSelector: false,
          cssLayer: false,
        }
      }
    })
  ]
};