import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { interval } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-kanban-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kanban-task-card.component.html',
  host: { '[attr.id]': 'kanban-task-card' },
  styleUrls: ['./kanban-task-card.component.css']
})
export class KanbanTaskCardComponent implements OnChanges, AfterViewInit {
  isMaximized = true;
  isWarning = false;
  isBacklog = false;
  isDone = false;
  isHold = false;
  isBacklogCircle = false;
  @Input() task: Task | undefined;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();
  @Output() moveTaskToBacklog = new EventEmitter<Task>();



  toggleDetails() {
    if (!this.isDone) {
      this.isMaximized = !this.isMaximized;
    }
  }

  minimizeTask() {
    this.isMaximized = false;
  }

  toggleMaximize() {
    if (this.task && this.task.status == 'Done') {
      this.isMaximized = !this.isMaximized;
    }
  }


  ngAfterViewInit() {
    this.cdRef.detectChanges(); // Trigger change detection
  }

  timeRemaining!: string;
  duration!: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      if (this.task) {
        this.isMaximized = this.task.status !== 'Done';
      }
      this.calculateTimeRemaining();
      // this.startTaskStatusPolling();
    }
  }

  constructor(private taskService: TaskService, private cdRef: ChangeDetectorRef, private authService: AuthService) { } // Inject AuthService

  calculateTimeRemaining(): void {
    if (this.task) {
      const startDate = new Date(this.task.createdDate ?? '');
      const dueDate = new Date(this.task.dueDate);
      const now = new Date();
  
      if (isNaN(startDate.getTime()) || isNaN(dueDate.getTime())) {
        this.timeRemaining = 'Invalid date';
        this.duration = 'Unknown';
        console.log('Invalid date detected');
        return;
      }
  
      let timeRemaining = dueDate.getTime() - now.getTime();
      if (timeRemaining < 0) {
        timeRemaining = 0;
      }
  
      const days = Math.floor(timeRemaining / (24 * 60 * 60 * 1000));
      const hours = Math.floor((timeRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const mins = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);
  
      const duration = dueDate.getTime() - startDate.getTime();
      const durationDays = Math.floor(duration / (24 * 60 * 60 * 1000));
  
      this.duration = isNaN(durationDays) ? 'Unknown' : `${durationDays} days`;
      this.timeRemaining = `${days}D:${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
      this.isWarning = timeRemaining < 2 * 60 * 60 * 1000;
      this.isDone = this.task.status === 'Done'; // Set the isDone property based on the task's status
  
      if (timeRemaining === 0 && (this.task.status === 'To Do' || this.task.status === 'In Progress')) {
        this.timeRemaining = '00:00:00:00';
        this.isBacklog = true;
        this.moveTaskToBacklog.emit(this.task); // Emit an event to move the task to the Backlog column
      } else {
        this.isBacklog = false;
      }
      
  
      console.log('Time Remaining:', this.timeRemaining);
      console.log('Duration:', this.duration);
    }
  }
  

  editTask() {
    if (this.task) {
      this.edit.emit(this.task);
    }
  }

  deleteTask() {
    if (this.task) {
      this.delete.emit(this.task.id);
    }
  }

  private taskStatusPollingSubscription: any;

  // startTaskStatusPolling() {
  //   if (this.task) {
  //     this.taskStatusPollingSubscription = interval(100) // 100ms = 0.1sec
  //       .subscribe(() => {
  //         this.getTaskStatus();
  //       });
  //   }
  // }

  // async getTaskStatus() {
  //   if (this.task) {
  //     const userId = this.authService.getUserId();
  //     const status = await this.taskService.getTaskStatus(this.task.id);
  //     console.log('Task status:', status);
  //     this.isDone = status === 'Done';
  //     this.isHold = status === 'On Hold';
  //     this.isBacklogCircle = status === 'Backlog';
  //     this.cdRef.markForCheck();
  //   }
  // }

  ngOnDestroy() {
    if (this.taskStatusPollingSubscription) {
      this.taskStatusPollingSubscription.unsubscribe();
    }
  }

}
