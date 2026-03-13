import { Component, ChangeDetectorRef } from '@angular/core';
import { FeedService } from '../../services/feed';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tech-selector',
  imports: [CommonModule],
  templateUrl: './tech-selector.html',
  styleUrl: './tech-selector.css',
})
export class TechSelector {
bookmarks: any[] = [];

  news: any[] = [];
  github: any[] = [];
  reddit: any[] = [];

  loading = false;

  constructor(private feedService: FeedService,
    private cdr: ChangeDetectorRef
  ) { }

  selectTech(tech: string) {
    this.loading = true;

    this.feedService.getFeed(tech).subscribe({
      next: (data: any) => {

        console.log("Feed Data:", data);

        this.news = data.news;
        this.github = data.github;
        this.reddit = data.reddit;

        this.loading = false;
        this.cdr.detectChanges(); // ⭐ force UI refresh

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

  alert("Saved to bookmarks ⭐");

}
}
