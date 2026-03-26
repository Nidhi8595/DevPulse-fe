// import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
// import { FeedService } from '../../services/feed';
// import { TechService } from '../../services/tech';
// import { CommonModule, DecimalPipe } from '@angular/common';
// import { TrendingChart } from '../trending-chart/trending-chart';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-tech-selector',
//   imports: [CommonModule, TrendingChart, FormsModule, DecimalPipe],
//   templateUrl: './tech-selector.html',
//   styleUrl: './tech-selector.css',
// })
// export class TechSelector {

//   @ViewChild(TrendingChart) chartComponent!: TrendingChart;

//   bookmarks: any[] = [];

//   searchTerm: string = "";

//   recentTech: string[] = [];

//   suggestions: string[] = [];

//   selectedFromSuggestion = false;

//   techPopularity: Record<string, number> = {};

//   news: any[] = [];
//   github: any[] = [];
//   reddit: any[] = [];
//   stackoverflow: any[] = [];
//   hackernews: any[] = [];
//   devto: any[] = [];
//   githubTrending: any[] = [];
//   npm: any[] = [];

//   loading = false;

//   constructor(
//     private feedService: FeedService,
//     private techService: TechService,
//     private cdr: ChangeDetectorRef
//   ) { }

//   normalizeTechName(name: string): string {

//     const map: Record<string, string> = {
//       nodejs: "node",
//       "node.js": "node",
//       reactjs: "react",
//       "react.js": "react",
//       nestjs: "nest",
//       "express.js": "express",
//     };

//     const clean = name.toLowerCase().trim();

//     return map[clean] || clean;
//   }

//   updateChart() {

//     const labels = Object.keys(this.techPopularity);
//     const data = Object.values(this.techPopularity);

//     if (this.chartComponent) {
//       this.chartComponent.createChart(labels, data);
//     }
//   }

//   selectTech(tech: string) {

//     this.selectedFromSuggestion = true;
//     this.searchTerm = tech;
//     this.suggestions = [];

//     const canonical = this.normalizeTechName(tech);

//     if (this.techPopularity[canonical]) {
//       console.log("Already loaded:", canonical);
//       return;
//     }

//     this.loading = true;

//     this.feedService.getFeed(tech).subscribe({
//       next: (data: any) => {

//         console.log("Feed Data:", data);

//         if (data.error) {
//           alert(data.error);
//           this.loading = false;
//           return;
//         }

//         this.news = data.news;
//         this.github = data.github;
//         this.reddit = data.reddit;
//         this.stackoverflow = data.stackoverflow;
//         this.hackernews = data.hackernews;
//         this.devto = data.devto;
//         this.githubTrending = data.githubTrending || [];
//         this.npm = data.npm || [];

//         // const score =
//         //   data.github.length * 3 +
//         //   data.stackoverflow.length * 4 +
//         //   data.reddit.length * 2 +
//         //   data.hackernews.length +
//         //   data.devto.length;
//         const score =
//           (data.github?.length || 0) * 3 +
//           (data.githubTrending?.length || 0) * 2 +
//           (data.reddit?.length || 0) * 2 +
//           (data.stackoverflow?.length || 0) * 2 +
//           (data.hackernews?.length || 0) * 2 +
//           (data.devto?.length || 0) * 1 +
//           (data.npm?.length || 0) * 1 +
//           (data.news?.length || 0) * 1;

//         this.techPopularity[canonical] = score;

//         this.loading = false;
//         this.cdr.detectChanges();
//         this.updateChart();

//       },
//       error: (error) => {
//         console.error('Error fetching feed:', error);
//         this.loading = false;
//       }
//     });
//   }

//   ngOnInit() {

//     const saved = localStorage.getItem("devpulse-bookmarks");

//     if (saved) {
//       this.bookmarks = JSON.parse(saved);
//     }
//   }

//   saveBookmark(item: any) {

//     const saved = JSON.parse(
//       localStorage.getItem("devpulse-bookmarks") || "[]"
//     );

//     saved.push(item);

//     localStorage.setItem(
//       "devpulse-bookmarks",
//       JSON.stringify(saved)
//     );

//     this.bookmarks = saved;
//   }

//   searchTech() {

//     if (!this.selectedFromSuggestion) {
//       alert("Please select a technology from the suggestions.");
//       return;
//     }

//     const tech = this.searchTerm.trim().toLowerCase();

//     if (!this.recentTech.includes(tech)) {
//       this.recentTech.unshift(tech);
//     }
//   }

//   onSearchChange() {
//     this.selectedFromSuggestion = false;

//     if (this.searchTerm.length < 2) {
//       this.suggestions = [];
//       return;
//     }

//     this.techService
//       .search(this.searchTerm)
//       .subscribe((data: any) => {

//         this.suggestions = data;

//       });
//   }
// }

import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FeedService } from '../../services/feed';
import { TechService } from '../../services/tech';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { TrendingChart } from '../trending-chart/trending-chart';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tech-selector',
  standalone: true,
  imports: [CommonModule, TrendingChart, FormsModule, DecimalPipe, DatePipe],
  templateUrl: './tech-selector.html',
  styleUrl: './tech-selector.css',
})
export class TechSelector {

  @ViewChild(TrendingChart) chartComponent!: TrendingChart;

  // Expose Object to template
  Object = Object;

  // ── State ──────────────────────────────────────────────
  searchTerm = '';
  suggestions: string[] = [];
  recentTech: string[] = [];
  selectedFromSuggestion = false;
  loading = false;
  hasResults = false;

  // ── Feed data ──────────────────────────────────────────
  news: any[]           = [];
  github: any[]         = [];
  reddit: any[]         = [];
  stackoverflow: any[]  = [];
  hackernews: any[]     = [];
  devto: any[]          = [];
  githubTrending: any[] = [];
  npm: any[]            = [];

  // ── Chart data ─────────────────────────────────────────
  techPopularity: Record<string, number> = {};

  // ── Bookmarks ──────────────────────────────────────────
  bookmarks: any[] = [];

  constructor(
    private feedService: FeedService,
    private techService: TechService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const saved = localStorage.getItem('devpulse-bookmarks');
    if (saved) {
      try { this.bookmarks = JSON.parse(saved); } catch { this.bookmarks = []; }
    }
  }

  // ── Normalize tech name ────────────────────────────────
  private normalizeTechName(name: string): string {
    const map: Record<string, string> = {
      'nodejs': 'node', 'node.js': 'node',
      'reactjs': 'react', 'react.js': 'react',
      'nestjs': 'nest', 'express.js': 'express',
      'vuejs': 'vue', 'angularjs': 'angular',
    };
    const clean = name.toLowerCase().trim();
    return map[clean] ?? clean;
  }

  // ── Search bar input ───────────────────────────────────
  onSearchChange() {
    this.selectedFromSuggestion = false;
    if (this.searchTerm.length < 2) {
      this.suggestions = [];
      return;
    }
    this.techService.search(this.searchTerm).subscribe({
      next: (data: any) => { this.suggestions = data; },
      error: () => { this.suggestions = []; },
    });
  }

  // ── Called when user clicks a suggestion ───────────────
  selectTech(tech: string) {
    this.selectedFromSuggestion = true;
    this.searchTerm = tech;
    this.suggestions = [];

    const canonical = this.normalizeTechName(tech);

    // Don't re-fetch if already loaded
    if (this.techPopularity[canonical] !== undefined) {
      // Still update the displayed data for this tech
      this.loadFromTech(tech);
      return;
    }

    this.fetchFeed(tech);
  }

  // ── Called by Search button ────────────────────────────
  searchTech() {
    if (!this.selectedFromSuggestion) {
      // Visual hint: shake the input
      return;
    }
    const tech = this.searchTerm.trim().toLowerCase();
    if (!this.recentTech.includes(tech)) {
      this.recentTech = [tech, ...this.recentTech].slice(0, 8);
    }
  }

  // ── Fetch from API ─────────────────────────────────────
  private fetchFeed(tech: string) {
    this.loading = true;
    this.hasResults = false;
    this.clearFeedData();

    this.feedService.getFeed(tech).subscribe({
      next: (data: any) => {
        if (data.error) {
          alert(data.error);
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        this.news          = data.news          || [];
        this.github        = data.github        || [];
        this.reddit        = data.reddit        || [];
        this.stackoverflow = data.stackoverflow || [];
        this.hackernews    = data.hackernews    || [];
        this.devto         = data.devto         || [];
        this.githubTrending = data.githubTrending || [];
        this.npm           = data.npm           || [];

        const canonical = this.normalizeTechName(tech);
        const score =
          (data.github?.length         || 0) * 5 +
          (data.githubTrending?.length || 0) * 3 +
          (data.reddit?.length         || 0) * 3 +
          (data.stackoverflow?.length  || 0) * 3 +
          (data.hackernews?.length     || 0) * 2 +
          (data.devto?.length          || 0) * 2 +
          (data.npm?.length            || 0) * 2 +
          (data.news?.length           || 0) * 1;

        this.techPopularity[canonical] = score;

        // Add to recent
        if (!this.recentTech.includes(canonical)) {
          this.recentTech = [canonical, ...this.recentTech].slice(0, 8);
        }

        this.hasResults = true;
        this.loading = false;
        this.cdr.detectChanges();
        this.updateChart();
      },
      error: (err) => {
        console.error('Feed error:', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // ── Reload display for already-fetched tech (no API call) ─
  private loadFromTech(tech: string) {
    // Data is already in arrays from the previous fetch
    // Just re-trigger change detection to show it
    this.hasResults = true;
    this.cdr.detectChanges();
  }

  // ── Clear all feed arrays ──────────────────────────────
  private clearFeedData() {
    this.news = []; this.github = []; this.reddit = [];
    this.stackoverflow = []; this.hackernews = []; this.devto = [];
    this.githubTrending = []; this.npm = [];
  }

  // ── Update chart ───────────────────────────────────────
  updateChart() {
    const entries = Object.entries(this.techPopularity)
      .sort((a, b) => b[1] - a[1]);
    const labels = entries.map(e => e[0]);
    const data   = entries.map(e => e[1]);

    if (this.chartComponent) {
      this.chartComponent.createChart(labels, data);
    }
  }

  // ── Bookmarks ──────────────────────────────────────────
  saveBookmark(item: any) {
    const url = item.url;
    if (!url) return;

    // Avoid duplicates
    if (this.bookmarks.some(b => b.url === url)) return;

    this.bookmarks = [item, ...this.bookmarks];
    localStorage.setItem('devpulse-bookmarks', JSON.stringify(this.bookmarks));
  }

  removeBookmark(index: number) {
    this.bookmarks = this.bookmarks.filter((_, i) => i !== index);
    localStorage.setItem('devpulse-bookmarks', JSON.stringify(this.bookmarks));
  }

  clearBookmarks() {
    this.bookmarks = [];
    localStorage.removeItem('devpulse-bookmarks');
  }
}
