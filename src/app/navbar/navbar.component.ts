import { Component, OnInit  } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { SidenavService } from '../services/sidenav.service';


@Component({
  standalone: true,
  imports: [MatToolbarModule, MatIconModule],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class AppNavbarComponent implements OnInit {

  currentDateTime?: string; // Mark as optional

  ngOnInit() {
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000); // Update every second
  }

  updateDateTime() {
    const now = new Date();
    this.currentDateTime = now.toLocaleString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    });
  }

  constructor(private sidenavService: SidenavService) {}

  toggleSidenav() {
    this.sidenavService.toggleSidenav();
  }


}
