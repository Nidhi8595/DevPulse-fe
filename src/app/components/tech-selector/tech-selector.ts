import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FeedService } from '../../services/feed';
import { CommonModule } from '@angular/common';
import { TrendingChart } from '../trending-chart/trending-chart';
@Component({
  selector: 'app-tech-selector',
  imports: [CommonModule, TrendingChart],
  templateUrl: './tech-selector.html',
  styleUrl: './tech-selector.css',
})
export class TechSelector {
  @ViewChild(TrendingChart) chartComponent!: TrendingChart;

  bookmarks: any[] = [];

  techStacks: string[] = [
    "react",
    "node",
    "python",
    "golang",
    "express",
    "cpp",
    "rust",
    "java",
    "csharp",
    "javascript",
    "typescript",
    "mysql",
    "postgresql",
    "tailwind",
    "mongodb",
    "nextjs",
    "angular",
    "vue",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "gcp",
    "flutter",
    "dart",
    "swift",
    "kotlin",
    "reactnative",
    "nestjs",
    "springboot",
    "laravel",
    "django",
    "ruby",
    "rails",
    "php",
    "graphql",
    "apollo",
    "redis",
    "elasticsearch",
    "firebase",
    "serverless",
    "cloudflare"
  ];

  techPopularity: Record<string, number> = {};

  news: any[] = [];
  github: any[] = [];
  reddit: any[] = [];

  loading = false;

  constructor(private feedService: FeedService,
    private cdr: ChangeDetectorRef
  ) { }

  updateChart() {

    const labels = Object.keys(this.techPopularity);
    const data = Object.values(this.techPopularity);

    if (this.chartComponent) {
      this.chartComponent.createChart(labels, data);
    }
  }

  selectTech(tech: string) {
    this.loading = true;

    this.feedService.getFeed(tech).subscribe({
      next: (data: any) => {

        console.log("Feed Data:", data);

        this.news = data.news;
        this.github = data.github;
        this.reddit = data.reddit;

        const score =
          data.github.length * 3 +
          data.reddit.length * 2 +
          data.news.length;

        this.techPopularity[tech] = score;

console.log(this.techPopularity)
        this.loading = false;
        this.cdr.detectChanges(); // ⭐ force UI refresh
        this.updateChart();


      },
      error: (error) => {
        console.error('Error fetching feed:', error);
        this.loading = false;
        this.cdr.detectChanges();

      }
    });
  }

  ngOnInit() {

    const saved = localStorage.getItem("devpulse-bookmarks");

    if (saved) {
      this.bookmarks = JSON.parse(saved);
    }

  }
  saveBookmark(item: any) {

    const saved = JSON.parse(localStorage.getItem("devpulse-bookmarks") || "[]");

    saved.push(item);

    localStorage.setItem("devpulse-bookmarks", JSON.stringify(saved));

    this.bookmarks = saved;

  }
}
