import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { KanbanColumnComponent } from '../kanban-column/kanban-column.component';
import { KanbanTaskCardComponent } from '../kanban-task-card/kanban-task-card.component';
import { KanbanCreateTaskFormComponent } from '../kanban-create-task-form/kanban-create-task-form.component';
import { KanbanUpdateTaskFormComponent } from '../kanban-update-task-form/kanban-update-task-form.component';
import { KanbanChangeBgComponent } from '../kanban-change-bg/kanban-change-bg.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { BackgroundService } from '../services/background.service';

declare var $: any;  // Import jQuery to use Bootstrap's JS features

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, KanbanColumnComponent, KanbanCreateTaskFormComponent, KanbanUpdateTaskFormComponent, KanbanChangeBgComponent, KanbanTaskCardComponent, ConfirmationModalComponent],
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css']
})
export class KanbanBoardComponent implements OnInit {
  showForm = true;
  tasks: Task[] = [];
  taskToEdit: Task | null = null;
  isUpdateFormOpen: boolean = false;
  columns = [
    { title: 'TODO', status: 'To Do' },
    { title: 'IN PROGRESS', status: 'In Progress' },
    { title: 'DONE', status: 'Done' },
  ];
  connectedLists: string[] = [];
  user = {
    background: '',
    firstName: '',
    lastName: '',
  };


  // For confirmation modal
  confirmationTitle: string = '';
  confirmationMessage: string = '';
  confirmationAction: (() => void) | null = null;

  constructor(private taskService: TaskService, public authService: AuthService, private router: Router, private backgroundService: BackgroundService) { }

  logout() {
    this.authService.logout().subscribe(
      () => {
        console.log('Logged out successfully');
        this.router.navigate(['/login']);  // Redirect to login page
      },
      (error) => {
        console.error('Error during logout', error);
      }
    );
  }

  minimizeAllTasks() {
    this.tasks.forEach(task => task.isMaximized = false);
  }

  // Methods to handle the create task modal
  openCreateTaskModal() {
    $('#createTaskModal').modal('show');
  }

  closeCreateTaskModal() {
    $('#createTaskModal').modal('hide');
  }

  closeCreateForm() {
    $('#createTaskModal').modal('hide');
  }



  ngOnInit(): void {
    console.log('Initializing KanbanBoardComponent'); // Debugging log
    console.log('Calling loadTasks'); // Debugging log
    this.loadTasks();
    this.connectedLists = this.columns.map(column => `cdk-drop-list-${column.title}`);
    this.user.background = this.authService.getbackground() || '';
    console.log('Background:', this.user.background);
  }

  loadTasks(): void {
    console.log('Loading tasks'); // Debugging log
    this.taskService.getTasks().subscribe(
      (response: any) => {
        console.log('Tasks loaded:', response.records); // Debugging log
        this.tasks = response.records;
      },
      (error) => {
        console.error('Error loading tasks', error);
      }
    );
  }

  getTasksByStatus(status: string): Task[] {
    // console.log('getTasksByStatus called with tasks:', this.tasks); // Debugging log
    return this.tasks
      .filter(task => task.status === status)
      .sort((a, b) => a.position - b.position);
  }

  onTaskCreated(task: Task) {
    const userId = this.authService.getUserId();
    if (userId) {
      task.user_id = userId;
      this.taskService.createTask(task).subscribe(() => {
        this.loadTasks();
        this.closeCreateTaskModal(); // Close the modal after task creation
      });
    } else {
      console.error('User ID is not set');
    }
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      // Moving task within the same column
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      event.container.data.forEach((task, index) => {
        task.position = index;
        this.taskService.updateTask(task).subscribe(
          () => { console.log('Task updated:', task); },
          error => console.error('Error updating task position', error)
        );
      });
    } else {
      // Moving task to a different column
      const task = event.previousContainer.data[event.previousIndex];
      const newStatusColumn = this.columns.find(column => column.title === event.container.id.replace('cdk-drop-list-', ''));
      if (newStatusColumn) {
        task.status = newStatusColumn.status;
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        event.container.data.forEach((task, index) => {
          task.position = index;
          this.taskService.updateTask(task).subscribe(
            () => { console.log('Task updated:', task); },
            error => console.error('Error updating task position', error)
          );
        });
      }
    }
  }

  editTask(task: Task) {
    this.taskToEdit = { ...task }; // Use a copy of the task to avoid direct mutation
    this.isUpdateFormOpen = true;
    $('#updateTaskModal').modal('show');
  }

  updateTask(updatedTask: Task) {
    const userId = this.authService.getUserId();
    if (userId) {
      updatedTask.user_id = userId;
      updatedTask.position = this.getTaskPosition(updatedTask); // Get the position from the task
      this.taskService.updateTask(updatedTask).subscribe(() => {
        this.loadTasks();
      });
    } else {
      console.error('User ID is not set');
    }
    this.taskToEdit = null;
    this.isUpdateFormOpen = false;
    $('#updateTaskModal').modal('hide');  // Hide the modal when task is updated
  }

  getTaskPosition(task: Task): number {
    const columnIndex = this.columns.findIndex(column => column.status === task.status);
    const taskIndex = this.getTasksByStatus(task.status).findIndex(t => t.id === task.id);
    return taskIndex;
  }

  deleteTask(taskId: number) {
    const userId = this.authService.getUserId();
    this.taskService.deleteTask(taskId, userId).subscribe(
      () => {
        console.log(`Task with ID ${taskId} deleted successfully`); // Debug log
        this.loadTasks();
      },
      (error: any) => {
        console.error(`Error deleting task with ID ${taskId}`, error); // Debug log
      }
    );
  }

  confirmDeleteTask(taskId: number) {
    console.log(`Attempting to delete task with ID: ${taskId}`);
    this.confirmationTitle = 'Confirm Deletion';
    this.confirmationMessage = 'Are you sure you want to delete this task?';
    this.confirmationAction = () => {
      this.taskService.deleteTask(taskId, this.authService.getUserId()).subscribe(() => {
        console.log(`Task with ID ${taskId} deleted successfully`);
        this.loadTasks();
      }, (error) => {
        console.error(`Error deleting task with ID ${taskId}`, error);
      });
    };
    $('#confirmationModal').modal('show');
  }



  closeUpdateForm() {
    this.isUpdateFormOpen = false;
    $('#updateTaskModal').modal('hide');
  }

  handleConfirmedAction(): void {
    if (this.confirmationAction) {
      this.confirmationAction();
    }
  }

  changeBackground(newBackground: string) {
    const email = this.authService.getEmail(); // Add this method to AuthService if not exists
    this.backgroundService.updateBackground(email, newBackground).subscribe(
      () => {
        this.user.background = newBackground;
        this.authService.setBackground(newBackground);
        $('#changeBackgroundModal').modal('hide');
      },
      error => console.error('Error updating background:', error)
    );
  }

  closeChangeBgForm(): void {
    // Close the modal or perform any necessary cleanup
    $('#changeBackgroundModal').modal('hide');
  }

}
