import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDetailsModel, AddReviewModel, OrderSummaryModel, UpdateOrderStatusModel } from '../../models/order-model';
import { environment } from '../../../environments/environment.development';
import { AdminReviewModel } from '../../models/review-model';

export interface AdminOrdersResponse {
  orders: OrderSummaryModel[];
  totalSum: number;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private BASIC_URL = `${environment.apiUrl}/Orders`;
  private USERS_URL = `${environment.apiUrl}/Users`;

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<AdminOrdersResponse> {
    return this.http.get<AdminOrdersResponse>(this.BASIC_URL);
  }

  getUserOrders(userId: number): Observable<OrderSummaryModel[]> {
    return this.http.get<OrderSummaryModel[]>(`${this.USERS_URL}/${userId}/orders`);
  }

  getOrders(): Observable<AdminOrdersResponse> {
    return this.http.get<AdminOrdersResponse>(this.BASIC_URL);
  }

  getOrderStatuses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASIC_URL}/statuses`);
  }

  getOrderDetails(orderId: number): Observable<OrderDetailsModel> {
    return this.http.get<OrderDetailsModel>(`${this.BASIC_URL}/${orderId}`);
  }

  getOrderItems(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.BASIC_URL}/${orderId}/orderItems`);
  }

  getAllReviews(): Observable<AdminReviewModel[]> {
    return this.http.get<AdminReviewModel[]>(`${this.BASIC_URL}/reviews`);
  }

  saveReview(orderId: number, review: AddReviewModel): Observable<any> {
    return this.http.post(`${this.BASIC_URL}/${orderId}/review`, review);
  }

  updateReview(orderId: number, review: AddReviewModel): Observable<any> {
    return this.http.put(`${this.BASIC_URL}/${orderId}/review`, review);
  }

  updateOrderStatus(payload: UpdateOrderStatusModel): Observable<any> {
    return this.http.put(this.BASIC_URL, {
      OrderId: payload.orderId,
      StatusName: payload.statusName,
      UserId: payload.userId,
      SiteName: payload.siteName,
      SiteTypeName: payload.siteTypeName,
      SiteDescription: payload.siteDescription,
      OrderSum: payload.orderSum,
      OrderDate: payload.orderDate,
      ReviewId: payload.reviewId,
      Score: payload.score,
      ReviewImageUrl: payload.reviewImageUrl,
    });
  }

  createOrderFromCart(cartId: number): Observable<any> {
    return this.http.post(`${this.BASIC_URL}/carts/${cartId}`, {});
  }

  getOrderPrompt(orderId: number): Observable<string> {
    return this.http.get(`${this.BASIC_URL}/${orderId}/prompt`, { responseType: 'text' });
  }
}