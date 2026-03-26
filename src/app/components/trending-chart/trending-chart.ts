// import { Component, ViewChild, ElementRef } from '@angular/core';
// import Chart from 'chart.js/auto';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-trending-chart',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './trending-chart.html',
//   styleUrl: './trending-chart.css',
// })
// export class TrendingChart {

//   @ViewChild('techChart')
//   chartRef!: ElementRef<HTMLCanvasElement>;

//   chart: any;

//   createChart(labels: string[], data: number[]) {

//     if (!this.chartRef) return;

//     const ctx = this.chartRef.nativeElement;

//     if (this.chart) {
//       this.chart.destroy();
//     }

//     this.chart = new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: labels,
//         datasets: [
//           {
//             label: 'Tech Popularity',
//             data: data,
//            backgroundColor: [
// "#3b82f6",
// "#22c55e",
// "#a855f7",
// "#06b6d4",
// "#f97316"
// ]
//           }
//         ]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false
//       }
//     });

//   }

// }


import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-trending-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="position: relative; height: 280px;">
      <canvas #techChart></canvas>
      <div *ngIf="!hasData" style="
        position: absolute; inset: 0;
        display: flex; align-items: center; justify-content: center;
        font-size: 13px; color: var(--text-muted);
        font-family: var(--font-mono);
      ">
        Search technologies to build the chart
      </div>
    </div>
  `,
})
export class TrendingChart implements AfterViewInit {

  @ViewChild('techChart') chartRef!: ElementRef<HTMLCanvasElement>;

  chart: any;
  hasData = false;
  viewReady = false;

  // Color palette for bars — cycles through these
  private colors = [
    '#6366f1', '#8b5cf6', '#06b6d4', '#10b981',
    '#f59e0b', '#ef4444', '#ec4899', '#14b8a6',
    '#f97316', '#84cc16',
  ];

  ngAfterViewInit() {
    this.viewReady = true;
  }

  createChart(labels: string[], data: number[]) {
    if (!this.viewReady || !this.chartRef?.nativeElement) return;

    const isDark = document.documentElement.classList.contains('dark');
    const textColor   = isDark ? 'rgba(240,239,235,0.6)' : 'rgba(17,17,16,0.5)';
    const gridColor   = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

    const bgColors = labels.map((_, i) => this.colors[i % this.colors.length]);
    const hoverColors = bgColors.map(c => c + 'cc');

    if (this.chart) {
      this.chart.destroy();
    }

    this.hasData = labels.length > 0;

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Pulse Score',
          data,
          backgroundColor: bgColors,
          hoverBackgroundColor: hoverColors,
          borderRadius: 8,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 500,
          easing: 'easeOutQuart',
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? '#1a1a1f' : '#ffffff',
            titleColor: isDark ? '#f0efeb' : '#111110',
            bodyColor: isDark ? '#8c8a84' : '#6b6a66',
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 10,
            callbacks: {
              label: (ctx) => ` Score: ${ctx.parsed.y}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              color: textColor,
              font: { family: 'JetBrains Mono, monospace', size: 12 },
            },
          },
          y: {
            grid: { color: gridColor },
            border: { display: false },
            ticks: {
              color: textColor,
              font: { family: 'JetBrains Mono, monospace', size: 11 },
              maxTicksLimit: 5,
            },
          },
        },
      },
    });
  }
}
