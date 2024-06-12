import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {
  passwordMatchValidator,
  passwordMatchValidator2,
} from '../../../shared/password-match.directive';
import {
  ChangePasswordDTO,
  RegisterDTO,
  UpdateDTO,
  UserReadDTO,
} from '../../../models/user';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    CheckboxModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  user!: UserReadDTO; // Initialize empty user object
  editMode = false; // Flag to indicate edit mode
  choosenUserId!: string | null; //grab user's id from url
  cardHeader = 'Add new user'; // Initialize card header

  //#region Register form
  registerForm = this.fb.group(
    {
      firstName: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)],
      ],
      lastName: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      isAdmin: [true],
      isDisabled: [false],
    },
    {
      validators: passwordMatchValidator,
    }
  );
  //#endregion

  //#region Update form
  updateForm = this.fb.group({
    firstName_Edit: [
      '',
      [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)],
    ],
    lastName_Edit: [
      '',
      [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)],
    ],
    email_Edit: ['', [Validators.required, Validators.email]],
    isAdmin_Edit: [true],
    isDisabled_Edit: [false],
  });
  //#endregion

  //#region change password form
  changePasswordForm = this.fb.group(
    {
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword2: ['', Validators.required],
    },
    {
      validators: passwordMatchValidator2,
    }
  );
  //#endregion

  // #region Password strength checker
  StrongPasswordRegx: RegExp =
    /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
  passwordScore: number = 3;
  passwordStrength: string = 'weak';

  conditions = {
    uppercase: /(?=.*[A-Z])/, // Regex for uppercase letter
    lowercase: /(?=.*[a-z])/, // Regex for lowercase letter
    number: /(.*[0-9].*)/, // Regex for number
    symbol: /(?=.*[!@#$%^&*])/, // Regex for special symbol
  };
  conditionNames = ['uppercase', 'lowercase', 'number', 'symbol'];
  getColor(strength: string) {
    switch (strength) {
      case 'weak':
        return 'red';
      case 'medium':
        return 'orange';
      case 'strong':
        return 'green';
      default:
        return 'black'; // Or any default color
    }
  }
  //#endregion

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService
  ) {
    // #region Password strength checker

    //Subscribes to the `password` value changes and updates password score and strength.
    this.password.valueChanges.subscribe((password) => {
      // Calculates the password score by iterating through condition regular expressions and adding 1 for each match.
      this.passwordScore = Object.values(this.conditions).reduce(
        (score, regex) => score + (regex.test(password!) ? 1 : 0),
        0
      );

      //Assigns the password strength based on the score using a ternary operator.

      this.passwordStrength =
        this.passwordScore <= 2
          ? 'weak'
          : this.passwordScore === 3
          ? 'medium'
          : 'strong';
    });
    //#endregion
  }

  async ngOnInit(): Promise<void> {
    const userId = this.route.snapshot.paramMap.get('id'); // Get ID from URL

    if (userId) {
      this.editMode = true; // Edit mode
      this.cardHeader = 'Edit user';
      this.choosenUserId = userId;

      const user = await this.userService.getUserById(userId).toPromise();
      this.user = user!;

      this.updateForm.patchValue({
        email_Edit: user!.email,
        firstName_Edit: user!.firstName,
        lastName_Edit: user!.lastName,
        isAdmin_Edit: user!.isAdmin,
        isDisabled_Edit: user!.isDisabled,
      });

      //#region Unused code
      // Fetch user data and populate form after successful retrieval
      // this.userService.getUserById(userId).subscribe((user) => {
      //   this.user = user;
      //   this.updateForm.value.email_Edit = this.user.email;
      //   this.updateForm.value.firstName_Edit = this.user.firstName;
      //   this.updateForm.value.lastName_Edit = this.user.lastName;
      //   this.updateForm.value.isAdmin_Edit = this.user.isAdmin;
      //   this.updateForm.value.isDisabled_Edit = this.user.isDisabled;
      // });
      //#endregion
    }
  }

  //#region singUp function
  handleSignup(e: Event): void {
    e.preventDefault();

    //constitute the postobject
    const postData: RegisterDTO = {
      firstName: this.registerForm.value.firstName!,
      lastName: this.registerForm.value.lastName!,
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!,
      isAdmin: this.registerForm.value.isAdmin!,
      isDisabled: this.registerForm.value.isDisabled!,
    };

    console.log(postData);

    // send request to backend
    this.authService.signup(postData).subscribe({
      next: (res) => {
        console.log(res);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User created successfully',
        });
        this.router.navigateByUrl('/login');
      },
      error: (error) => {
        console.error('Calling API failed', error);
        if (error.status === 409) {
          this.messageService.add({
            severity: 'error',
            summary: 'User cannot be created',
            detail: 'Email is used before',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong',
          });
        }
      },
    });
  }
  //#endregion

  //#region Updateform
  handleUpdate(e: Event) {
    e.preventDefault();

    //constitute the postobject
    const postData: UpdateDTO = {
      id: this.choosenUserId!,
      firstName: this.updateForm.value.firstName_Edit!,
      lastName: this.updateForm.value.lastName_Edit!,
      email: this.updateForm.value.email_Edit!,
      isAdmin: this.updateForm.value.isAdmin_Edit!,
      isDisabled: this.updateForm.value.isDisabled_Edit!,
    };

    console.log(postData);

    // send request to backend

    this.userService.updateUser(postData).subscribe({
      next: (res) => {
        console.log(res);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User updated successfully',
        });
        this.router.navigateByUrl('/login');
      },
      error: (error) => {
        console.error('Calling API failed', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Something went wrong',
          detail: 'User could not be edited',
        });
      },
    });
  }

  //#endregion

  //#region Change password functions

  changePassword(e: Event) {
    e.preventDefault();
    this.route.paramMap.subscribe((params) => {
      this.choosenUserId = params.get('id');
    });
  }

  //post confirm method to backend
  confirmPasswordChange(e: Event) {
    e.preventDefault();

    //constitute the postobject
    const postData: ChangePasswordDTO = {
      id: this.choosenUserId!,
      oldPassword: this.changePasswordForm.value.oldPassword!,
      newPassword: this.changePasswordForm.value.newPassword!,
      confirmPassword: this.changePasswordForm.value.confirmPassword2!,
    };

    console.log(postData);

    // send request to backend
    this.userService.changePassword(postData).subscribe({
      next: (res) => {
        console.log(res);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Password changed successfully',
        });
      },
      error: (error) => {
        console.error('Calling API failed', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Password change wasnot successful',
          detail: 'Something went wrong',
        });
      },
    });
  }

  //#endregion

  //#region All Getters

  // #region supporting functions for SignUp form (Getters)
  get firstName() {
    return this.registerForm.controls['firstName'];
  }
  get lastName() {
    return this.registerForm.controls['lastName'];
  }
  get email() {
    return this.registerForm.controls['email'];
  }
  get password() {
    return this.registerForm.controls['password'];
  }
  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }
  get isAdmin() {
    return this.registerForm.controls['isAdmin'];
  }
  get isDisabled() {
    return this.registerForm.controls['isDisabled'];
  }
  // #endregion

  // #region supporting functions for Update form (Getters)
  get firstName_Edit() {
    return this.updateForm.controls['firstName_Edit'];
  }
  get lastName_Edit() {
    return this.updateForm.controls['lastName_Edit'];
  }
  get email_Edit() {
    return this.updateForm.controls['email_Edit'];
  }
  get isAdmin_Edit() {
    return this.updateForm.controls['isAdmin_Edit'];
  }
  get isDisabled_Edit() {
    return this.updateForm.controls['isDisabled_Edit'];
  }
  // #endregion

  //#region Supporting functions for password change (Getters)
  resetPasswordChange() {
    this.choosenUserId = '';
  }

  get oldPassword() {
    return this.changePasswordForm.controls['oldPassword'];
  }
  get newPassword() {
    return this.changePasswordForm.controls['newPassword'];
  }
  get confirmPassword2() {
    return this.changePasswordForm.controls['confirmPassword2'];
  }
  //#endregion

  //#endregion
}
