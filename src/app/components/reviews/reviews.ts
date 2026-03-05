import { Component, OnInit, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RatingModule } from 'primeng/rating'
import { ToastModule } from 'primeng/toast'
import { SelectModule } from 'primeng/select'
import { MessageService } from 'primeng/api'
import { ReviewService } from '../../services/reviewService/review-service'
import { AdminReviewModel } from '../../models/review-model'

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, RatingModule, ToastModule, SelectModule],
  providers: [MessageService],
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss',
})
export class Reviews implements OnInit {
  reviews: AdminReviewModel[] = []
  loaded = false
  averageScore = 0

  scoreFilter: number | null = null
  siteTypeFilter: string = ''
  siteTypes: string[] = []

  get filteredReviews(): AdminReviewModel[] {
    return this.reviews.filter((r) => {
      const scoreOk = this.scoreFilter === null || r.score === this.scoreFilter
      const typeOk = !this.siteTypeFilter || r.siteTypeName === this.siteTypeFilter
      return scoreOk && typeOk
    })
  }

  get activeFilterCount(): number {
    return (this.scoreFilter !== null ? 1 : 0) + (this.siteTypeFilter ? 1 : 0)
  }

  private reviewService = inject(ReviewService)
  private messageService = inject(MessageService)

  ngOnInit(): void {
    this.reviewService.getReviews()

    this.reviewService.review$.subscribe({
      next: (data) => {
        if (data) {
          this.reviews = data
          this.averageScore = data.length
            ? Math.round((data.reduce((sum, r) => sum + r.score, 0) / data.length) * 10) / 10
            : 0
          this.siteTypes = [...new Set(data.map((r) => r.siteTypeName).filter(Boolean))]
        }
        this.loaded = true
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load reviews',
          life: 3000,
        })
        this.loaded = true
      },
    })

    this.reviewService.error$.subscribe({
      next: (err) => {
        if (err) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load reviews',
            life: 3000,
          })
          this.loaded = true
        }
      },
    })
  }

  setScoreFilter(score: number | null): void {
    this.scoreFilter = this.scoreFilter === score ? null : score
  }

  clearFilters(): void {
    this.scoreFilter = null
    this.siteTypeFilter = ''
  }
}
