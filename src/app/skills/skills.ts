import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../services/portfolio';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.html',
  styleUrls: ['./skills.css'],
  standalone: true,
  imports: [CommonModule]
})
export class Skills implements OnInit {
  skills: any[] = [];
  loading = true;
  error = '';

  constructor(
    private portfolioService: PortfolioService,
    private cdr: ChangeDetectorRef  // Add this
  ) {}

  async ngOnInit() {
    await this.loadSkills();
  }

  async loadSkills() {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges(); // Force update
    
    try {
      // Get skills from Firebase
      const firebaseSkills = await this.portfolioService.getSkills();
      console.log('Firebase skills:', firebaseSkills);
      
      // Use Firebase skills if available, otherwise use sample
      if (firebaseSkills && firebaseSkills.length > 0) {
        this.skills = firebaseSkills;
        console.log('Using Firebase skills:', this.skills.length);
      } else {
        this.skills = this.getSampleSkills();
        console.log('Using sample skills:', this.skills.length);
      }
      
    } catch (error) {
      console.error('Error loading skills, using sample data:', error);
      this.skills = this.getSampleSkills();
    } finally {
      this.loading = false;
      this.cdr.detectChanges(); // Force update
      console.log('Skills loading set to false, skills count:', this.skills.length);
    }
  }

  getSampleSkills() {
    return [
      // Frontend
      { name: 'Angular', category: 'Frontend', proficiency: 90, icon: '🅰️' },
      { name: 'TypeScript', category: 'Frontend', proficiency: 85, icon: '📘' },
      { name: 'React', category: 'Frontend', proficiency: 80, icon: '⚛️' },
      { name: 'HTML5/CSS3', category: 'Frontend', proficiency: 90, icon: '🌐' },
      { name: 'Tailwind CSS', category: 'Frontend', proficiency: 85, icon: '🎨' },
      
      // Backend
      { name: 'Node.js', category: 'Backend', proficiency: 85, icon: '🟢' },
      { name: 'Python', category: 'Backend', proficiency: 80, icon: '🐍' },
      { name: 'Firebase', category: 'Backend', proficiency: 85, icon: '🔥' },
      { name: 'Express.js', category: 'Backend', proficiency: 75, icon: '🚂' },
      
      // Database
      { name: 'MongoDB', category: 'Database', proficiency: 80, icon: '🍃' },
      { name: 'Firestore', category: 'Database', proficiency: 85, icon: '🔥' },
      { name: 'MySQL', category: 'Database', proficiency: 70, icon: '🗄️' },
      
      // DevOps
      { name: 'Git', category: 'DevOps', proficiency: 90, icon: '📦' },
      { name: 'Docker', category: 'DevOps', proficiency: 70, icon: '🐳' },
      { name: 'Vercel', category: 'DevOps', proficiency: 85, icon: '▲' },
      { name: 'VS Code', category: 'Tools', proficiency: 95, icon: '💻' },
      
      // AI
      { name: 'OpenAI API', category: 'AI', proficiency: 75, icon: '🤖' },
      { name: 'LangChain', category: 'AI', proficiency: 70, icon: '⛓️' },
      { name: 'Prompt Engineering', category: 'AI', proficiency: 85, icon: '💬' },
      
      // Other
      { name: 'Problem Solving', category: 'Other', proficiency: 90, icon: '🧩' },
      { name: 'Team Collaboration', category: 'Other', proficiency: 85, icon: '👥' },
      { name: 'Agile/Scrum', category: 'Other', proficiency: 80, icon: '📋' }
    ];
  }

  getSkillsByCategory(category: string) {
    return this.skills.filter(skill => skill.category === category);
  }
}