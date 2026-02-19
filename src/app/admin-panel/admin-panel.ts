import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PortfolioService } from '../services/portfolio';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.html',
  styleUrls: ['./admin-panel.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminPanel implements OnInit {
  // Tabs
  activeTab: string = 'projects';
  
  // Projects
  projects: any[] = [];
  newProject: any = {
    title: '',
    description: '',
    technologies: '',
    category: 'Web',
    link: '',
    isAIProject: false,
    order: 0
  };
  editingProject: any = null;
  
  // Skills
  skills: any[] = [];
  newSkill: any = {
    name: '',
    category: 'Frontend',
    proficiency: 50
  };
  editingSkill: any = null;
  
  // UI States
  loading = false;
  successMessage = '';
  errorMessage = '';

  categories = ['Web', 'AI', 'Mobile', 'Desktop', 'Other'];
  skillCategories = ['Frontend', 'Backend', 'Database', 'AI', 'DevOps', 'Tools', 'Other','Problem Solving'];

  constructor(
    private portfolioService: PortfolioService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    // Check if user is authenticated
    const user = this.portfolioService.getCurrentUser();
    console.log('AdminPanel: Current user:', user?.email);
    
    if (!user) {
      console.log('AdminPanel: No user, redirecting to login');
      this.router.navigate(['/admin-login']);
      return;
    }
    
    // Load data
    await this.loadProjects();
    await this.loadSkills();
  }

  // ============ PROJECTS ============
  async loadProjects() {
    try {
      this.projects = await this.portfolioService.getProjects();
      console.log('Projects loaded:', this.projects.length);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }

  async addProject() {
    if (!this.newProject.title || !this.newProject.description) {
      this.showError('Title and description are required');
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();
    
    try {
      // Process technologies
      let technologies = [];
      if (this.newProject.technologies) {
        technologies = this.newProject.technologies
          .split(',')
          .map((t: string) => t.trim())
          .filter((t: string) => t);
      }

      const project = {
        title: this.newProject.title.trim(),
        description: this.newProject.description.trim(),
        technologies: technologies,
        category: this.newProject.category || 'Web',
        link: this.newProject.link?.trim() || '',
        isAIProject: this.newProject.isAIProject || false,
        order: this.projects.length,
        createdAt: new Date().toISOString()
      };

      await this.portfolioService.addProject(project);
      await this.loadProjects();
      this.resetProjectForm();
      this.showSuccess('Project added successfully');
    } catch (error: any) {
      console.error('Failed to add project:', error);
      this.showError(error.message || 'Failed to add project');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  editProject(project: any) {
    this.editingProject = { 
      ...project,
      technologies: project.technologies ? project.technologies.join(', ') : ''
    };
  }

  async updateProject() {
    if (!this.editingProject.title || !this.editingProject.description) {
      this.showError('Title and description are required');
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();
    
    try {
      let technologies = [];
      if (this.editingProject.technologies) {
        technologies = this.editingProject.technologies
          .split(',')
          .map((t: string) => t.trim())
          .filter((t: string) => t);
      }

      const project = {
        title: this.editingProject.title.trim(),
        description: this.editingProject.description.trim(),
        technologies: technologies,
        category: this.editingProject.category || 'Web',
        link: this.editingProject.link?.trim() || '',
        isAIProject: this.editingProject.isAIProject || false,
        order: this.editingProject.order || 0,
        updatedAt: new Date().toISOString()
      };

      await this.portfolioService.updateProject(this.editingProject.id, project);
      await this.loadProjects();
      this.cancelEdit();
      this.showSuccess('Project updated successfully');
    } catch (error: any) {
      console.error('Failed to update project:', error);
      this.showError(error.message || 'Failed to update project');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async deleteProject(id: string) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.loading = true;
      this.cdr.detectChanges();
      
      try {
        await this.portfolioService.deleteProject(id);
        await this.loadProjects();
        this.showSuccess('Project deleted successfully');
      } catch (error: any) {
        console.error('Failed to delete project:', error);
        this.showError(error.message || 'Failed to delete project');
      } finally {
        this.loading = false;
        this.cdr.detectChanges();
      }
    }
  }

  resetProjectForm() {
    this.newProject = {
      title: '',
      description: '',
      technologies: '',
      category: 'Web',
      link: '',
      isAIProject: false,
      order: 0
    };
  }

  cancelEdit() {
    this.editingProject = null;
  }

  // ============ SKILLS ============
  async loadSkills() {
    try {
      this.skills = await this.portfolioService.getSkills();
      console.log('Skills loaded:', this.skills.length);
    } catch (error) {
      console.error('Error loading skills:', error);
    }
  }

  async addSkill() {
    if (!this.newSkill.name) {
      this.showError('Skill name is required');
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();
    
    try {
      const skill = {
        name: this.newSkill.name.trim(),
        category: this.newSkill.category || 'Frontend',
        proficiency: Number(this.newSkill.proficiency) || 50,
        icon: this.newSkill.icon || '📘',
        createdAt: new Date().toISOString()
      };

      await this.portfolioService.addSkill(skill);
      await this.loadSkills();
      this.resetSkillForm();
      this.showSuccess('Skill added successfully');
    } catch (error: any) {
      console.error('Failed to add skill:', error);
      this.showError(error.message || 'Failed to add skill');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  editSkill(skill: any) {
    this.editingSkill = { ...skill };
  }

  async updateSkill() {
    if (!this.editingSkill.name) {
      this.showError('Skill name is required');
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();
    
    try {
      const skill = {
        name: this.editingSkill.name.trim(),
        category: this.editingSkill.category || 'Frontend',
        // proficiency: Number(this.editingSkill.proficiency) || 50,
        icon: this.editingSkill.icon || '📘',
        updatedAt: new Date().toISOString()
      };

      await this.portfolioService.updateSkill(this.editingSkill.id, skill);
      await this.loadSkills();
      this.cancelSkillEdit();
      this.showSuccess('Skill updated successfully');
    } catch (error: any) {
      console.error('Failed to update skill:', error);
      this.showError(error.message || 'Failed to update skill');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async deleteSkill(id: string) {
    if (confirm('Are you sure you want to delete this skill?')) {
      this.loading = true;
      this.cdr.detectChanges();
      
      try {
        await this.portfolioService.deleteSkill(id);
        await this.loadSkills();
        this.showSuccess('Skill deleted successfully');
      } catch (error: any) {
        console.error('Failed to delete skill:', error);
        this.showError(error.message || 'Failed to delete skill');
      } finally {
        this.loading = false;
        this.cdr.detectChanges();
      }
    }
  }

  resetSkillForm() {
    this.newSkill = {
      name: '',
      category: 'Frontend',
      proficiency: 50,
      icon: '📘'
    };
  }

  cancelSkillEdit() {
    this.editingSkill = null;
  }

  // ============ UTILITIES ============
  async logout() {
    const result = await this.portfolioService.signOut();
    if (result.success) {
      this.router.navigate(['/admin-login']);
    }
  }

  showSuccess(message: string) {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.cancelEdit();
    this.cancelSkillEdit();
    this.cdr.detectChanges();
  }
}