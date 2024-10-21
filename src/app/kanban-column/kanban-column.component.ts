import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { KanbanTaskCardComponent } from '../kanban-task-card/kanban-task-card.component';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-kanban-column',
  standalone: true,
  imports: [CommonModule, DragDropModule, KanbanTaskCardComponent],
  templateUrl: './kanban-column.component.html',
  styleUrls: ['./kanban-column.component.css']
})
export class KanbanColumnComponent {
  @Input() title: string = '';
  @Input() tasks: Task[] = [];
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();
  @Output() taskDropped = new EventEmitter<{ event: CdkDragDrop<Task[]>, title: string }>();

  drop(event: CdkDragDrop<Task[]>) {
    this.taskDropped.emit({ event, title: this.title });
  }

  editTask(task: Task) {
    this.edit.emit(task);
  }

  deleteTask(taskId: number) {
    this.delete.emit(taskId);
  }
}
