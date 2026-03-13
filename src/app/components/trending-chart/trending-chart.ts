import { Component, ViewChild, ElementRef } from '@angular/core';
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trending-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trending-chart.html',
  styleUrl: './trending-chart.css',
})
export class TrendingChart {

  @ViewChild('techChart')
  chartRef!: ElementRef<HTMLCanvasElement>;

  chart: any;

  createChart(labels: string[], data: number[]) {

    if (!this.chartRef) return;

    const ctx = this.chartRef.nativeElement;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Tech Popularity',
            data: data,
           backgroundColor: [
"#3b82f6",
"#22c55e",
"#a855f7",
"#06b6d4",
"#f97316"
]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

  }

}
