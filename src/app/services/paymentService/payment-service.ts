import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface CreatePaymentOrderRequest {
  cartId: number;
  clientAmount: string;
  currency: string;
  productIds: number[];
  basicSiteId?: number | null; // included for server-side order linking
}

export interface CreatePaymentOrderResponse {
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly PAYMENTS_URL = `${environment.apiUrl}/Payments`;

  constructor(private http: HttpClient) {}

  createOrder(payload: CreatePaymentOrderRequest): Observable<CreatePaymentOrderResponse> {
    return this.http.post<CreatePaymentOrderResponse>(`${this.PAYMENTS_URL}/create`, payload);
  }

  captureOrder(paypalOrderId: string, cartId: number): Observable<any> {
    return this.http.post<any>(
      `${this.PAYMENTS_URL}/capture/${paypalOrderId}/carts/${cartId}`,
      {}
    );
  }
}