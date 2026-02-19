import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PortfolioService } from '../services/portfolio';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class AdminLogin {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private portfolioService: PortfolioService,
    private router: Router
  ) {
    // If already logged in, redirect to admin panel
    const user = this.portfolioService.getCurrentUser();
    if (user) {
      console.log('Already logged in as:', user.email);
      this.router.navigate(['/admin-panel']);
    }
  }

  async onSubmit() {
    this.loading = true;
    this.error = '';
    
    const result = await this.portfolioService.signIn(this.email, this.password);
    
    if (result.success) {
      console.log('Login successful, redirecting to admin panel');
      this.router.navigate(['/admin-panel']);
    } else {
      this.error = 'Invalid email or password';
      console.error('Login failed:', result.error);
    }
    
    this.loading = false;
  }
}