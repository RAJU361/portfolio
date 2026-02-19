import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../services/portfolio';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.html',
  styleUrls: ['./projects.css'],
  standalone: true,
  imports: [CommonModule]
})
export class Projects implements OnInit {
  projects: any[] = [];
  loading = true;
  error = '';
  window = window; // Add this line

  constructor(
    private portfolioService: PortfolioService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.loadProjects();
  }

  async loadProjects() {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();
    
    try {
      console.log('Fetching projects...');
      this.projects = await this.portfolioService.getProjects();
      console.log('Projects loaded:', this.projects);
      
      if (!this.projects) {
        this.projects = [];
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      this.error = 'Failed to load projects';
      this.projects = [];
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
      console.log('Projects loading set to false');
    }
  }
}