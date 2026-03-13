import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  toggleDark() {
  document.documentElement.classList.toggle("dark");
  };

  viewBookmark() {
  document.getElementById("bookmark")?.scrollIntoView({ behavior: "smooth" });
  };

  viewTrends(){
  document.getElementById("trends")?.scrollIntoView({ behavior: "smooth" });
  }

}
