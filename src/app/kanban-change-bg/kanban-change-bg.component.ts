import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackgroundService } from '../services/background.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-kanban-change-bg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kanban-change-bg.component.html',
  styleUrls: ['./kanban-change-bg.component.css']
})
export class KanbanChangeBgComponent {
  backgrounds: { src: string }[] = [
    { src: '../assets/images/board-bg/1.jpg' },
    { src: '../assets/images/board-bg/2.jpg' },
    { src: '../assets/images/board-bg/3.jpg' },
    { src: '../assets/images/board-bg/4.jpg' },
  ];

  @Output() backgroundChanged = new EventEmitter<string>();
  @Output() closeChangeBgFormEvent = new EventEmitter<void>();

  constructor(
    private backgroundService: BackgroundService,
    private authService: AuthService
  ) {}

  changeBackground(bg: string) {
    const email = this.authService.getEmail(); // Add this method to AuthService if not exists
    this.backgroundService.updateBackground(email, bg).subscribe(
      () => {
        this.backgroundChanged.emit(bg);
        this.closeForm();
      },
      error => console.error('Error updating background:', error)
    );
  }

  closeForm() {
    this.closeChangeBgFormEvent.emit(); // Emit an event to close the form
  }
}
