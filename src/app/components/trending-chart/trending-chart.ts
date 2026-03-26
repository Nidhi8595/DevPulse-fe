import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-trending-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="position:relative; height:300px;">
      <canvas #techChart></canvas>
      <div *ngIf="!hasData"
           style="position:absolute;inset:0;display:flex;align-items:center;
                  justify-content:center;font-size:14px;color:var(--text-muted);
                  font-family:var(--font-mono);">
        Search technologies to see scores here
      </div>
    </div>
  `,
})
export class TrendingChart implements AfterViewInit {

  @ViewChild('techChart') chartRef!: ElementRef<HTMLCanvasElement>;

  chart: any;
  hasData = false;
  viewReady = false;

  // Distinct color palette — each tech gets its own color
  private palette = [
    '#6366f1', '#8b5cf6', '#06b6d4', '#10b981',
    '#f59e0b', '#ef4444', '#ec4899', '#14b8a6',
    '#f97316', '#84cc16', '#3b82f6', '#a78bfa',
  ];

  ngAfterViewInit() {
    this.viewReady = true;
  }

  createChart(labels: string[], data: number[]) {
    if (!this.viewReady || !this.chartRef?.nativeElement) return;

    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? 'rgba(240,239,235,0.5)' : 'rgba(17,17,16,0.45)';
    const gridColor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';

    // Give each bar a distinct color, cycling through palette
    const bgColors    = labels.map((_, i) => this.palette[i % this.palette.length]);
    const hoverColors = bgColors.map(c => c + 'dd');

    if (this.chart) this.chart.destroy();

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
          borderRadius: 10,
          borderSkipped: false,
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 600,
          easing: 'easeOutQuart',
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? '#18181b' : '#ffffff',
            titleColor: isDark ? '#f0efeb' : '#111110',
            bodyColor: isDark ? '#8c8a84' : '#6b6a66',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
            borderWidth: 1,
            padding: { x: 14, y: 10 },
            cornerRadius: 12,
            titleFont: { family: "'Space Grotesk', sans-serif", weight: 600, size: 13 },
            bodyFont:  { family: "'JetBrains Mono', monospace", size: 12 },
            callbacks: {
              title: (items) => items[0].label.toUpperCase(),
              label: (ctx) => `  Pulse score: ${ctx.parsed.y}`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
              color: textColor,
              font: { family: "'JetBrains Mono', monospace", size: 12 },
            },
          },
          y: {
            grid: { color: gridColor, lineWidth: 1 },
            border: { display: false, dash: [4, 4] },
            ticks: {
              color: textColor,
              font: { family: "'JetBrains Mono', monospace", size: 11 },
              maxTicksLimit: 5,
              padding: 8,
            },
            beginAtZero: true,
          },
        },
      },
    });
  }
}
