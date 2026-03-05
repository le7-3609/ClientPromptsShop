export interface ReviewModel {
  reviewId: number
  orderId: number
  stars: number
  reviewText?: string
  reviewImg?: string
}

export interface ReviewApiModel {
  reviewId: number
  orderId: number
  score: number
  note?: string
  reviewImageUrl?: string
}

export interface AdminReviewModel {
  reviewId: number
  reviewImageUrl?: string
  note?: string
  score: number
  siteName: string
  siteTypeName: string
}
