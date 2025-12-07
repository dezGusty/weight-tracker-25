import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeightForm } from './components/weight-form/weight-form';
import { WeightList } from './components/weight-list/weight-list';
import { WeightChart } from './components/weight-chart/weight-chart';
import { WeightEntry } from './models/weight-entry.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WeightForm, WeightList, WeightChart],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Weight Tracker';
  editingWeight: WeightEntry | null = null;

  onWeightSaved(): void {
    this.editingWeight = null;
    // Components will auto-refresh via their own methods
  }

  onEditWeight(weight: WeightEntry): void {
    this.editingWeight = weight;
    // Scroll to top to show the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onCancelEdit(): void {
    this.editingWeight = null;
  }
}
