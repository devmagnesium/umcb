import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { UsersComponent } from './users/users.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', canActivate: [authGuard], component: LoginComponent }, // só o guard vai redirecionar
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'users', component: UsersComponent, canActivate: [authGuard] },
  { path: '*', redirectTo: 'login'},
];
