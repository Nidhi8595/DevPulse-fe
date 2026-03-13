import { Component, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-trending-chart',
  imports: [],
  templateUrl: './trending-chart.html',
  styleUrl: './trending-chart.css',
})
export class TrendingChart implements AfterViewInit {

  ngAfterViewInit() {

    new Chart("techChart", {
      type: 'bar',
      data: {
        labels: ['React', 'Node', 'MongoDB', 'Tailwind'],
        datasets: [
          {
            label: 'Popularity',
            data: [95, 85, 70, 80],
            backgroundColor: [
              '#3b82f6',
              '#22c55e',
              '#a855f7',
              '#06b6d4'
            ]
          }
        ]
      },
      options: {
        responsive: true
      }
    });

  }
}
