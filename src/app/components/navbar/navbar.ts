// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-navbar',
//   imports: [],
//   templateUrl: './navbar.html',
//   styleUrl: './navbar.css',
// })
// export class Navbar {
//   toggleDark() {
//   document.documentElement.classList.toggle("dark");
//   };

//   viewBookmark() {
//   document.getElementById("bookmark")?.scrollIntoView({ behavior: "smooth" });
//   };

//   viewTrends(){
//   document.getElementById("trends")?.scrollIntoView({ behavior: "smooth" });
//   }

// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isDark = false;

  toggleDark() {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('dark', this.isDark);
  }

  viewTrends() {
    const el = document.getElementById('trends');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  viewBookmark() {
    const el = document.getElementById('bookmark');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
