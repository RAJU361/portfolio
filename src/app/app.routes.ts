import { Routes } from '@angular/router';
import { Home } from './home/home';
import { AdminLogin } from './admin-login/admin-login';
import { AdminPanel } from './admin-panel/admin-panel';
import { AuthGuard } from './auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'admin-login', component: AdminLogin },
  { path: 'admin-panel', component: AdminPanel, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];