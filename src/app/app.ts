import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./components/navbar/navbar";
import { TechSelector } from "./components/tech-selector/tech-selector";
import { TrendingChart } from './components/trending-chart/trending-chart';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, TechSelector,TrendingChart],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('devpulse');
}
