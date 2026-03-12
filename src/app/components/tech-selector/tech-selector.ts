import { Component } from '@angular/core';
import { FeedService } from '../../services/feed';

@Component({
  selector: 'app-tech-selector',
  imports: [],
  templateUrl: './tech-selector.html',
  styleUrl: './tech-selector.css',
})
export class TechSelector {
  news: any[] = [];
  github: any[] = [];
  reddit: any[] = [];

  constructor(private feedService: FeedService) {}

  selectTech(tech: string) {

     this.feedService.getFeed(tech).subscribe((data: any) => {

      console.log("Feed Data:", data);

      this.news = data.news;
      this.github = data.github;
      this.reddit = data.reddit;

    });
  }
}
