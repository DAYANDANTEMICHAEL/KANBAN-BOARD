import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { KanbanColumnComponent } from '../kanban-column/kanban-column.component';
import { KanbanTaskCardComponent } from '../kanban-task-card/kanban-task-card.component';
import { KanbanCreateTaskFormComponent } from '../kanban-create-task-form/kanban-create-task-form.component';
import { KanbanUpdateTaskFormComponent } from '../kanban-update-task-form/kanban-update-task-form.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

declare var $: any; // Import jQuery to use Bootstrap's JS features

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    KanbanColumnComponent,
    KanbanCreateTaskFormComponent,
    KanbanUpdateTaskFormComponent,
    KanbanTaskCardComponent,
    ConfirmationModalComponent,
    ConfirmationModalComponent,
    MatSidenavModule,
    MatIcon
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class AppSidebarComponent implements OnInit {
  showForm = true;
  tasks: Task[] = [];
  connectedLists: string[] = [];

  user = {
    firstName: '',
    lastName: '',
    role: '',
    avatar: '',
  };

  constructor(
    private taskService: TaskService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user.firstName = this.authService.getfirstName() || '';
    this.user.lastName = this.authService.getlastName() || '';
    this.user.role = this.authService.getRole() || '';
    this.user.avatar = this.authService.getavatar() || ''; // Fetch role from AuthService
    
    console.log('First Name:', this.user.firstName);
    console.log('Last Name:', this.user.lastName);
    console.log('Role:', this.user.role);
    console.log('Avatar:', this.user.avatar);
  }











  logout() {
    this.authService.logout().subscribe(
      () => {
        console.log('Logged out successfully');
        this.router.navigate(['/login']); // Redirect to login page
      },
      (error) => {
        console.error('Error during logout', error);
      }
    );
  }

  minimizeAllTasks() {
    this.tasks.forEach((task) => (task.isMaximized = false));
  }

  // Methods to handle the create task modal
  openCreateTaskModal() {
    $('#createTaskModal').modal('show');
  }

  closeCreateTaskModal() {
    $('#createTaskModal').modal('hide');
  }

  // Methods to handle the change background modal
  openChangeBackgroundModal() {
    $('#changeBackgroundModal').modal('show');
  }

  closeChangeBackgroundModal() {
    $('#changeBackgroundModal').modal('hide');
  }

  // Assuming this is used to close the modal from the change background component
  closeChangeForm() {
    $('#changeBackgroundModal').modal('hide');
  }

  handleImageError(event: any) {
    console.error('Error loading image:', event);
    event.target.src = 'path/to/fallback-image.png'; // Optional: provide a fallback image
  }
}
