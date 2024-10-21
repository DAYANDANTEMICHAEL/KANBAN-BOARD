import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-kanban-update-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './kanban-update-task-form.component.html',
  styleUrls: ['./kanban-update-task-form.component.css']
})
export class KanbanUpdateTaskFormComponent implements OnInit, OnChanges {
  @Input() task: Task = {} as Task;
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() closeUpdateFormEvent = new EventEmitter<void>();

  taskForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {
    this.updateForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      this.updateForm();
    }
  }

  private initForm(): void {
    this.taskForm = this.fb.group({
      taskName: [''],
      description: [''],
      createdDate: [''],
      dueDate: [''],
      assignee: [''],
      status: ['']
    });
  }

  private updateForm(): void {
    if (this.task) {
      this.taskForm.patchValue({
        taskName: this.task.taskName,
        description: this.task.description,
        createdDate: this.task.createdDate,
        dueDate: this.task.dueDate,
        assignee: this.task.assignee,
        status: this.task.status
      });
    }
  }

  saveTask() {
    const taskData = { ...this.task, ...this.taskForm.value };
    this.taskUpdated.emit(taskData);
  }

  closeUpdateForm() {
    this.closeUpdateFormEvent.emit();
  }

}