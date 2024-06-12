import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AdminComponent } from './pages/admin/admin.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { authenticationGuard } from './auth/auth.guard';
import { NotAdminComponent } from './pages/not-admin/not-admin.component';
import { notadminGuard } from './auth/notadmin.guard';
import { loginGuard } from './auth/login.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'signup/:id',
    component: SignupComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authenticationGuard],
  },
  {
    path: 'notAdmin',
    component: NotAdminComponent,
    canActivate: [notadminGuard],
  },
  { path: '**', component: NotfoundComponent },
];
