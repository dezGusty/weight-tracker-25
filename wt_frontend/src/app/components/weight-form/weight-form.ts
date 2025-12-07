import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeightService } from '../../services/weight.service';
import { WeightEntry } from '../../models/weight-entry.model';

@Component({
  selector: 'app-weight-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './weight-form.html',
  styleUrl: './weight-form.css',
})
export class WeightForm implements OnChanges {
  @Input() editingWeight: WeightEntry | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  weight: WeightEntry = {
    date: this.getTodayDate(),
    weight: 0,
    notes: ''
  };
  
  error = '';
  isEditing = false;

  constructor(private weightService: WeightService) {}

  ngOnChanges(): void {
    if (this.editingWeight) {
      this.weight = { ...this.editingWeight };
      this.isEditing = true;
    } else {
      this.resetForm();
    }
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  onSubmit(): void {
    console.log('***Submitting weight entry:', this.weight);
    this.error = '';
    
    if (!this.weight.weight || this.weight.weight <= 0) {
      this.error = 'Please enter a valid weight.';
      return;
    }

    if (this.isEditing && this.weight.id) {
      this.weightService.updateWeight(this.weight.id, this.weight).subscribe({
        next: () => {
          this.saved.emit();
          this.resetForm();
        },
        error: (err) => {
          this.error = 'Failed to update weight. Please try again.';
          console.error('Error updating weight:', err);
        }
      });
    } else {
      this.weightService.createWeight(this.weight).subscribe({
        next: () => {
          this.saved.emit();
          this.resetForm();
        },
        error: (err) => {
          if (err.status === 409) {
            this.error = 'An entry already exists for this date.';
          } else {
            this.error = 'Failed to save weight. Please try again.';
          }
          console.error('Error creating weight:', err);
        }
      });
    }
  }

  onCancel(): void {
    this.resetForm();
    this.cancelled.emit();
  }

  resetForm(): void {
    this.weight = {
      date: this.getTodayDate(),
      weight: 0,
      notes: ''
    };
    this.isEditing = false;
    this.error = '';
  }
}
