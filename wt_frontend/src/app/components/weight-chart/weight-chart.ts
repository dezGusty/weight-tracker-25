import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { WeightService } from '../../services/weight.service';
import { WeightEntry } from '../../models/weight-entry.model';

@Component({
  selector: 'app-weight-chart',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './weight-chart.html',
  styleUrl: './weight-chart.css',
})
export class WeightChart implements OnInit {
  loading = false;
  error = '';
  dataLimit = 10;

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Weight (kg)',
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Weight (kg)'
        },
        beginAtZero: false
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        enabled: true
      }
    }
  };

  constructor(private weightService: WeightService) {}

  ngOnInit(): void {
    this.updateDataLimit();
    this.loadChartData();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateDataLimit();
    this.loadChartData();
  }

  updateDataLimit(): void {
    const width = window.innerWidth;
    if (width < 768) {
      this.dataLimit = 10; // Mobile
    } else if (width < 1200) {
      this.dataLimit = 20; // Tablet
    } else {
      this.dataLimit = 40; // Desktop
    }
  }

  loadChartData(): void {
    this.loading = true;
    this.error = '';
    this.weightService.getRecentWeights(this.dataLimit).subscribe({
      next: (data) => {
        // Reverse the data to show oldest to newest
        const reversedData = [...data].reverse();
        
        this.lineChartData.labels = reversedData.map(w => 
          new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        );
        
        this.lineChartData.datasets[0].data = reversedData.map(w => w.weight);
        
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load chart data.';
        this.loading = false;
        console.error('Error loading chart data:', err);
      }
    });
  }

  refresh(): void {
    this.loadChartData();
  }
}
