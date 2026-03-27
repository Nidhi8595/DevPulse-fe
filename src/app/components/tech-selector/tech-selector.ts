import { Component, ChangeDetectorRef, ViewChild, ApplicationRef } from '@angular/core';
import { FeedService } from '../../services/feed';
import { TechService } from '../../services/tech';
import { CommonModule, DecimalPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { TrendingChart } from '../trending-chart/trending-chart';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-tech-selector',
  standalone: true,
  imports: [CommonModule, TrendingChart, FormsModule, DecimalPipe, DatePipe, TitleCasePipe],
  templateUrl: './tech-selector.html',
  styleUrl: './tech-selector.css',
})
export class TechSelector {

  @ViewChild(TrendingChart) chartComponent!: TrendingChart;
  private searchSubject = new Subject<string>();

  // Expose Object to template for Object.keys()
  Object = Object;

  // ── Search state ───────────────────────────────
  searchTerm = '';
  suggestions: string[] = [];
  recentTech: string[] = [];
  selectedFromSuggestion = false;

  // ── Loading / results state ────────────────────
  loading = false;
  hasResults = false;
  currentTech = '';

  // Skeleton items array for *ngFor
  skeletonItems = Array(6).fill(0);

  // Source badges shown in empty state
  sources = [
    'GitHub Releases', 'GitHub Trending', 'Reddit',
    'Stack Overflow', 'Hacker News', 'Dev.to',
    'Tech News', 'NPM'
  ];

  // ── Feed data ──────────────────────────────────
  news: any[] = [];
  github: any[] = [];
  reddit: any[] = [];
  stackoverflow: any[] = [];
  hackernews: any[] = [];
  devto: any[] = [];
  githubTrending: any[] = [];
  npm: any[] = [];

  // ── Chart ──────────────────────────────────────
  techPopularity: Record<string, number> = {};

  // ── Bookmarks ──────────────────────────────────
  bookmarks: any[] = [];

  // Computed total results count
  get totalResults(): number {
    return this.news.length + this.github.length + this.reddit.length
      + this.stackoverflow.length + this.hackernews.length
      + this.devto.length + this.githubTrending.length + this.npm.length;
  }

  constructor(
    private feedService: FeedService,
    private techService: TechService,
    private cdr: ChangeDetectorRef,
    private appRef: ApplicationRef,

  ) { }

  // ngOnInit() {
  //   const saved = localStorage.getItem('devpulse-bookmarks');
  //   if (saved) {
  //     try { this.bookmarks = JSON.parse(saved); } catch { this.bookmarks = []; }
  //   }
  // }


  ngOnInit() {
  // Load bookmarks
  const saved = localStorage.getItem('devpulse-bookmarks');
  if (saved) {
    try { this.bookmarks = JSON.parse(saved); } catch { this.bookmarks = []; }
  }

  // Debounced search — waits 300ms after user stops typing
  // distinctUntilChanged skips if the value hasn't changed
  // switchMap cancels any in-flight request when a new one comes in
  this.searchSubject.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => {
      if (term.length < 2) return [];
      return this.techService.search(term);
    })
  ).subscribe({
    next: (data: any) => {
      this.suggestions = data || [];
      this.cdr.detectChanges();
      this.appRef.tick();
    },
    error: () => { this.suggestions = []; }
  });
}

  // ── Normalize ──────────────────────────────────
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

  // ── Autocomplete ───────────────────────────────
  // onSearchChange() {
  //   this.selectedFromSuggestion = false;
  //   if (this.searchTerm.length < 2) {
  //     this.suggestions = [];
  //     return;
  //   }
  //   this.techService.search(this.searchTerm).subscribe({
  //     next: (data: any) => { this.suggestions = data || []; },
  //     error: () => { this.suggestions = []; },
  //   });
  // }

  onSearchChange() {
  this.selectedFromSuggestion = false;
  this.searchSubject.next(this.searchTerm);
  if (this.searchTerm.length < 2) {
    this.suggestions = [];
  }
}

  // ── Select from suggestion list ────────────────
  selectTech(tech: string) {
    this.selectedFromSuggestion = true;
    this.searchTerm = tech;
    this.suggestions = [];

    const canonical = this.normalizeTechName(tech);

    // Add to recent list
    if (!this.recentTech.includes(canonical)) {
      this.recentTech = [canonical, ...this.recentTech].slice(0, 8);
    }

    this.fetchFeed(tech);
  }

  // ── Search button ──────────────────────────────
  searchTech() {
    if (!this.selectedFromSuggestion) return;
    const tech = this.searchTerm.trim().toLowerCase();
    this.fetchFeed(tech);
  }

  // ── API fetch ──────────────────────────────────
  private fetchFeed(tech: string) {
    this.loading = true;
    this.hasResults = false;
    this.currentTech = this.normalizeTechName(tech);
    this.clearFeedData();
    this.cdr.detectChanges();
    this.appRef.tick();

    this.feedService.getFeed(tech).subscribe({
      next: (data: any) => {
        if (data.error) {
          alert(data.error);
          this.loading = false;
          this.cdr.detectChanges();
          this.appRef.tick();
          return;
        }

        this.news = data.news || [];
        this.github = data.github || [];
        this.reddit = data.reddit || [];
        this.stackoverflow = data.stackoverflow || [];
        this.hackernews = data.hackernews || [];
        this.devto = data.devto || [];
        this.githubTrending = data.githubTrending || [];
        this.npm = data.npm || [];

        // Calculate weighted pulse score
        const canonical = this.normalizeTechName(tech);
        const score =
          (data.github?.length || 0) * 5 +
          (data.githubTrending?.length || 0) * 3 +
          (data.reddit?.length || 0) * 3 +
          (data.stackoverflow?.length || 0) * 3 +
          (data.hackernews?.length || 0) * 2 +
          (data.devto?.length || 0) * 2 +
          (data.npm?.length || 0) * 2 +
          (data.news?.length || 0) * 1;

        this.techPopularity[canonical] = score;

        this.hasResults = true;
        this.loading = false;
        this.cdr.detectChanges();
        this.appRef.tick();

        // Update chart after a short delay so it renders after DOM update
        setTimeout(() => this.updateChart(), 100);
      },
      error: (err) => {
        console.error('Feed error:', err);
        this.loading = false;
        this.cdr.detectChanges();
        this.appRef.tick();
      },
    });
  }

  // ── Clear arrays ───────────────────────────────
  private clearFeedData() {
    this.news = []; this.github = []; this.reddit = [];
    this.stackoverflow = []; this.hackernews = []; this.devto = [];
    this.githubTrending = []; this.npm = [];
  }

  // ── Chart update ───────────────────────────────
  updateChart() {
    const entries = Object.entries(this.techPopularity)
      .sort((a, b) => b[1] - a[1]);
    const labels = entries.map(e => e[0]);
    const data = entries.map(e => e[1]);
    if (this.chartComponent) {
      this.chartComponent.createChart(labels, data);
    }
  }

  // ── Bookmarks ──────────────────────────────────
  saveBookmark(item: any) {
    if (!item?.url) return;
    if (this.bookmarks.some(b => b.url === item.url)) return;
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
