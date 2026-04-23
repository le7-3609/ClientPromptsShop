import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { OrderDetailsModel, AddReviewModel, OrderSummaryModel, UpdateOrderStatusModel } from '../../models/order-model';
import { environment } from '../../../environments/environment.development';
import { AdminReviewModel, ReviewApiModel } from '../../models/review-model';

export interface AdminOrdersResponse {
  orders: OrderSummaryModel[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private BASIC_URL = `${environment.apiUrl}/Orders`;
  private USERS_URL = `${environment.apiUrl}/Users`;
  private REVIEWS_URL = `${environment.apiUrl}/Reviews`;

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
    return this.http.get<AdminReviewModel[]>(this.REVIEWS_URL);
  }

  getReviewByOrderId(orderId: number): Observable<ReviewApiModel> {
    return this.http.get<ReviewApiModel>(`${this.REVIEWS_URL}/${orderId}`);
  }

  saveReview(orderId: number, review: AddReviewModel, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append('Score', String(review.score));
    if (review.note) formData.append('Note', review.note);
    if (file) formData.append('Image', file);
    return this.http.post(`${this.REVIEWS_URL}/${orderId}`, formData);
  }

  updateReview(orderId: number, review: AddReviewModel): Observable<any> {
    return this.getReviewByOrderId(orderId).pipe(
      switchMap((existing) =>
        this.http.put(this.REVIEWS_URL, {
          ReviewId: existing.reviewId,
          OrderId: review.orderId,
          Score: review.score,
          Note: review.note,
          ReviewImageUrl: review.reviewImageUrl,
        })
      )
    );
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