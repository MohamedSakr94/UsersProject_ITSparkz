import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { LoginDTO } from '../../../models/user';
import { ToastrService } from 'ngx-toastr';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private messageService: MessageService
  ) {}

  HandleUserLogin(e: Event) {
    e.preventDefault();

    //constitute the postobject
    const loginData: LoginDTO = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!,
    };

    // send request to backend
    this.authService.login(loginData).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login successful',
        });
        this.router.navigateByUrl('admin');
      },
      error: (error) => {
        console.error('Calling API failed', error);
        if (error.status === 401) {
          this.messageService.add({
            severity: 'error',
            summary: 'Login failed',
            detail: 'Email or password is wrong',
          });
        } else if (error.status === 403) {
          this.messageService.add({
            severity: 'error',
            summary: 'Login failed',
            detail: 'User might be disabled',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Login failed',
            detail: 'Something went wrong',
          });
        }
      },
    });
  }

  get email() {
    return this.loginForm.controls['email'];
  }
  get password() {
    return this.loginForm.controls['password'];
  }
}
