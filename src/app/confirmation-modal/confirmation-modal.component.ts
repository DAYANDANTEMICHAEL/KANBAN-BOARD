import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

declare var $: any;  // Import jQuery to use Bootstrap's JS features

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css'],
  standalone: true, // Add this line
  imports: [CommonModule, DragDropModule]
})
export class ConfirmationModalComponent {
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to perform this action?';
  @Output() confirmed = new EventEmitter<void>();

  confirm() {
    this.confirmed.emit();
    $('#confirmationModal').modal('hide');
  }
}
