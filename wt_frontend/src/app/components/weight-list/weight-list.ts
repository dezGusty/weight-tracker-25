import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeightService } from '../../services/weight.service';
import { WeightEntry } from '../../models/weight-entry.model';

@Component({
  selector: 'app-weight-list',
  imports: [CommonModule],
  templateUrl: './weight-list.html',
  styleUrl: './weight-list.css',
})
export class WeightList implements OnInit {
  weights: WeightEntry[] = [];
  loading = false;
  error = '';
  
  @Output() edit = new EventEmitter<WeightEntry>();

  constructor(private weightService: WeightService) {}

  ngOnInit(): void {
    this.loadWeights();
  }

  loadWeights(): void {
    this.loading = true;
    this.error = '';
    this.weightService.getAllWeights().subscribe({
      next: (data) => {
        this.weights = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load weights. Please try again.';
        this.loading = false;
        console.error('Error loading weights:', err);
      }
    });
  }

  editWeight(weight: WeightEntry): void {
    this.edit.emit(weight);
  }

  deleteWeight(id: number): void {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.weightService.deleteWeight(id).subscribe({
        next: () => this.loadWeights(),
        error: (err) => {
          this.error = 'Failed to delete weight. Please try again.';
          console.error('Error deleting weight:', err);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
}
