import { Component } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { TechSelector } from './components/tech-selector/tech-selector';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Navbar, TechSelector],
  templateUrl: './app.html',
})
export class App {}
