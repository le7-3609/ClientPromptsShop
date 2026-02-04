import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ChartModule, ButtonModule, AnimateOnScrollModule, AccordionModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  chartData: any;
  chartOptions: any;

  ngOnInit() {
    this.chartData = {
      labels: ['עיצובים מוכנים', 'אלמנטים', 'תבניות אתר', 'תוספים'],
      datasets: [
        {
          label: 'רכישות באתר',
          data: [540, 325, 702, 420],
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC'],
          hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D', '#BA68C8']
        }
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: { position: 'bottom' }
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }
}