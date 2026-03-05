import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { AccordionModule } from 'primeng/accordion';
import { CarouselModule } from 'primeng/carousel';
import { RatingModule } from 'primeng/rating';
import { ReviewService } from '../../services/reviewService/review-service';
import { AdminReviewModel } from '../../models/review-model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ChartModule,
    ButtonModule,
    AnimateOnScrollModule,
    AccordionModule,
    CarouselModule,
    RatingModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  chartData: any;
  chartOptions: any;
  reviews: AdminReviewModel[] = [];
  reviewsWithImages: AdminReviewModel[] = [];
  reviewsLoaded = false;
  averageScore = 0;

  private reviewService = inject(ReviewService);

  ngOnInit(): void {
    this.reviewService.getReviews();

    this.reviewService.review$.subscribe({
      next: (data) => {
        if (data) {
          this.reviews = data;
          this.reviewsWithImages = data.filter(r => !!r.reviewImageUrl);
          this.averageScore =
            data.length
              ? Math.round((data.reduce((s, r) => s + r.score, 0) / data.length) * 10) / 10
              : 0;
          this.buildChart(data);
        }
        this.reviewsLoaded = true;
      },
    });

    // default empty chart while loading
    this.buildChart([]);
  }

  private buildChart(reviews: AdminReviewModel[]): void {
    // Score distribution: count of reviews per score 1–5
    const scoreCount = [0, 0, 0, 0, 0];
    for (const r of reviews) {
      const idx = Math.round(r.score) - 1;
      if (idx >= 0 && idx < 5) scoreCount[idx]++;
    }

    this.chartData = {
      labels: ['1 ★', '2 ★', '3 ★', '4 ★', '5 ★'],
      datasets: [
        {
          label: 'Reviews',
          data: scoreCount,
          backgroundColor: ['#4c1d95', '#5b21b6', '#7e22ce', '#9333ea', '#d946ef'],
          borderRadius: 10,
          borderSkipped: false,
        },
      ],
    };

    this.chartOptions = {
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) => ` ${ctx.raw} review${ctx.raw !== 1 ? 's' : ''}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1, color: '#8139eb' },
          grid: { color: 'rgba(129,57,235,0.08)' },
        },
        x: {
          grid: { display: false },
          ticks: { color: '#8139eb', font: { size: 14 } },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  }
}