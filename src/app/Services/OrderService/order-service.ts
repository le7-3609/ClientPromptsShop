import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDetailsModel, AddReviewModel, OrderSummaryModel } from '../../Models/order-model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private BASIC_URL = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }

  // שליפת כל ההזמנות של המשתמש המחובר
  getUserOrders(userId: number): Observable<OrderSummaryModel[]> {
    return this.http.get<OrderSummaryModel[]>(`${this.BASIC_URL}/user/${userId}`);
  }

  // שליפת פרטי הזמנה ספציפית (כולל פריטים וביקורת אם יש)
  getOrderDetails(orderId: number): Observable<OrderDetailsModel> {
    return this.http.get<OrderDetailsModel>(`${this.BASIC_URL}/${orderId}`);
  }

  // הוספת ביקורת חדשה
  saveReview(orderId: number, review: AddReviewModel): Observable<any> {
    return this.http.post(`${this.BASIC_URL}/${orderId}/review`, review);
  }
}