import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { PortfolioService } from './services/portfolio';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private portfolioService: PortfolioService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const user = this.portfolioService.getCurrentUser();
    
    if (user) {
      console.log('AuthGuard: User is authenticated', user.email);
      return true;
    } else {
      console.log('AuthGuard: No authenticated user, redirecting to login');
      this.router.navigate(['/admin-login']);
      return false;
    }
  }
}