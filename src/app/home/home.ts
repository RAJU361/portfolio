import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Projects } from '../projects/projects';
import { Skills } from '../skills/skills';
import { Contact } from '../contact/contact';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: true,
  imports: [CommonModule, Projects, Skills, Contact]
})
export class Home {
  // Calculate years of experience
  yearsOfExperience = this.calculateYearsOfExperience();
  
  constructor() {}
  
  calculateYearsOfExperience(): number {
    const start = new Date('2023-08-01'); // When you started at LSEG
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - start.getTime());
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    return Math.floor(diffYears);
  }
}