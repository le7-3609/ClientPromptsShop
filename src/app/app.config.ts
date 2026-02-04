import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeuix/themes/lara';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    providePrimeNG({
      theme: {
        preset: Lara,
        options: {
          darkModeSelector: false,
          primitiveColors: {
            purple: {
              50: '#f4f2ff',
              // ... הגדרת שאר הגוונים
              500: '#8139eb',
              600: '#9b68ee',
              // ...
            }
          },
          semantic: {
            primary: {
              colorScheme: {
                light: {
                  root: '{purple.500}',
                  hover: '{purple.600}',
                  active: '{purple.700}'
                }
              }
            }
          }
        }
      }
    })
  ]
};