import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
})
export class Navbar {
  isDark = false;

  toggleDark() {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('dark', this.isDark);
  }

  viewTrends() {
    document.getElementById('trends')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  viewBookmark() {
    document.getElementById('bookmark')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
