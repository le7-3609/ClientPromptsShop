import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { environment } from '../../../environments/environment.development'
import { AdminReviewModel } from '../../models/review-model'

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private http = inject(HttpClient)
  private REVIEWS_URL = `${environment.apiUrl}/Reviews`

  private reviewSubject = new BehaviorSubject<AdminReviewModel[] | null>(null)
  public review$: Observable<AdminReviewModel[] | null> = this.reviewSubject.asObservable()

  private errorSubject = new BehaviorSubject<HttpErrorResponse | null>(null)
  public error$: Observable<HttpErrorResponse | null> = this.errorSubject.asObservable()

  getReviews(): void {
    this.http.get<AdminReviewModel[]>(this.REVIEWS_URL).subscribe({
      next: (data) => {
        this.reviewSubject.next(data ?? [])
        this.errorSubject.next(null)
      },
      error: (err) => {
        this.errorSubject.next(err)
      },
    })
  }
}
