import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FeedService } from '../../services/feed';
import { TechService } from '../../services/tech';
import { CommonModule } from '@angular/common';
import { TrendingChart } from '../trending-chart/trending-chart';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tech-selector',
  imports: [CommonModule, TrendingChart, FormsModule],
  templateUrl: './tech-selector.html',
  styleUrl: './tech-selector.css',
})
export class TechSelector {

  @ViewChild(TrendingChart) chartComponent!: TrendingChart;

  bookmarks: any[] = [];

  searchTerm: string = "";

  recentTech: string[] = [];

  suggestions: string[] = [];

  selectedFromSuggestion = false;

  techPopularity: Record<string, number> = {};

  news: any[] = [];
  github: any[] = [];
  reddit: any[] = [];
  stackoverflow: any[] = [];

  loading = false;

  constructor(
    private feedService: FeedService,
    private techService: TechService,
    private cdr: ChangeDetectorRef
  ) { }

  normalizeTechName(name: string): string {

    const map: Record<string, string> = {
      nodejs: "node",
      "node.js": "node",
      reactjs: "react",
      "react.js": "react",
      nestjs: "nest",
      "express.js": "express",
    };

    const clean = name.toLowerCase().trim();

    return map[clean] || clean;
  }

  updateChart() {

    const labels = Object.keys(this.techPopularity);
    const data = Object.values(this.techPopularity);

    if (this.chartComponent) {
      this.chartComponent.createChart(labels, data);
    }
  }

  selectTech(tech: string) {

    this.selectedFromSuggestion = true;
    this.searchTerm = tech;
    this.suggestions = [];

    const canonical = this.normalizeTechName(tech);

    if (this.techPopularity[canonical]) {
      console.log("Already loaded:", canonical);
      return;
    }

    this.loading = true;

    this.feedService.getFeed(tech).subscribe({
      next: (data: any) => {

        console.log("Feed Data:", data);

        if (data.error) {
          alert(data.error);
          this.loading = false;
          return;
        }

        this.news = data.news;
        this.github = data.github;
        this.reddit = data.reddit;
        this.stackoverflow = data.stackoverflow;
        const score =
          data.github.length * 3 +
          data.stackoverflow.length * 4 +
          data.reddit.length * 2 +
          data.news.length;

        this.techPopularity[canonical] = score;

        this.loading = false;
        this.cdr.detectChanges();
        this.updateChart();

      },
      error: (error) => {
        console.error('Error fetching feed:', error);
        this.loading = false;
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

    const saved = JSON.parse(
      localStorage.getItem("devpulse-bookmarks") || "[]"
    );

    saved.push(item);

    localStorage.setItem(
      "devpulse-bookmarks",
      JSON.stringify(saved)
    );

    this.bookmarks = saved;
  }

  searchTech() {

    if (!this.selectedFromSuggestion) {
      alert("Please select a technology from the suggestions.");
      return;
    }

    const tech = this.searchTerm.trim().toLowerCase();

    if (!this.recentTech.includes(tech)) {
      this.recentTech.unshift(tech);
    }
  }

  onSearchChange() {
    this.selectedFromSuggestion = false;

    if (this.searchTerm.length < 2) {
      this.suggestions = [];
      return;
    }

    this.techService
      .search(this.searchTerm)
      .subscribe((data: any) => {

        this.suggestions = data;

      });
  }
}
