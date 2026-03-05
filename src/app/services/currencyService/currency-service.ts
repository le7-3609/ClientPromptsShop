import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, of } from 'rxjs';

export interface CurrencyOption {
  code: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  private http = inject(HttpClient);

  private currenciesSubject = new BehaviorSubject<CurrencyOption[]>([
    { code: 'USD', name: 'United States Dollar' },
  ]);
  private selectedCurrencySubject = new BehaviorSubject<CurrencyOption>({
    code: 'USD',
    name: 'United States Dollar',
  });
  private rateSubject = new BehaviorSubject<number>(1);
  private errorSubject = new BehaviorSubject<string | null>(null);

  currencies$ = this.currenciesSubject.asObservable();
  selectedCurrency$ = this.selectedCurrencySubject.asObservable();
  rate$ = this.rateSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  loadCurrencies(): void {
    this.http
      .get<Record<string, string>>('https://api.frankfurter.app/currencies')
      .pipe(
        map((result) =>
          Object.entries(result)
            .map(([code, name]) => ({ code, name }))
            .sort((a, b) => a.code.localeCompare(b.code))
        ),
        catchError(() => {
          this.errorSubject.next('Could not load currencies. Falling back to USD.');
          return of([{ code: 'USD', name: 'United States Dollar' }]);
        })
      )
      .subscribe((currencies) => {
        const usd = currencies.find((c) => c.code === 'USD');
        const normalized = usd ? currencies : [{ code: 'USD', name: 'United States Dollar' }, ...currencies];
        this.currenciesSubject.next(normalized);
      });
  }

  selectCurrency(currency: CurrencyOption): void {
    this.selectedCurrencySubject.next(currency);
    if (currency.code === 'USD') {
      this.rateSubject.next(1);
      this.errorSubject.next(null);
      return;
    }
    this.fetchRate(currency.code);
  }

  private fetchRate(code: string): void {
    this.http
      .get<{ rates: Record<string, number> }>(`https://api.frankfurter.app/latest?from=USD&to=${code}`)
      .pipe(
        map((result) => result.rates?.[code] ?? 1),
        catchError(() => {
          this.errorSubject.next(`Could not fetch exchange rate for ${code}.`);
          return of(1);
        })
      )
      .subscribe((rate) => this.rateSubject.next(rate));
  }
}
