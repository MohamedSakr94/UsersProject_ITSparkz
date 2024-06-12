import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-admin',
  standalone: true,
  imports: [],
  templateUrl: './not-admin.component.html',
  styleUrl: './not-admin.component.css',
})
export class NotAdminComponent {
  authService = inject(AuthService);
  router = inject(Router);
  public logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
