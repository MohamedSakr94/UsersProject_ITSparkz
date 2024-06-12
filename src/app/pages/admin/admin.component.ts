import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { SearchDTO, UserReadDTO } from '../../../models/user';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatPaginator,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  userForm = this.fb.group({
    name: [null as string | null],
    role: [null as boolean | null],
    state: [null as boolean | null],
  });

  // User data and state
  users: UserReadDTO[] = [];
  usersSlice: UserReadDTO[] = [];
  usersLoading: boolean = true;
  showErrorMsg: boolean = false;
  choosenUser!: UserReadDTO;

  //search params
  searchText?: string;
  role?: boolean;
  state?: boolean;

  //constructor
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.userForm = this.fb.group({
      name: [null as string | null],
      role: [null as boolean | null],
      state: [null as boolean | null],
    });
  }

  //#region Load Users function to be used onInit and when search is applied
  loadUsers() {
    //#region check if there are any search params
    const searchParams: SearchDTO = {
      name: this.userForm.value.name!,
      role: this.userForm.value.role!,
      state: this.userForm.value.state!,
    };
    //#endregion

    //#region Load users and populate data
    this.usersLoading = true;
    if (searchParams)
      this.userService
        .getUsers(searchParams.name, searchParams.role, searchParams.state)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.users = res.map((user) => {
              return {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
                isDisabled: user.isDisabled,
              };
            });
            this.usersLoading = false;
            this.showErrorMsg = false;
            this.usersSlice = this.users?.slice(0, 5);
          },
          error: (err) => {
            console.error(err);
            this.usersLoading = false;
            this.showErrorMsg = true;
          },
        });
    //#endregion
  }
  //#endregion

  ngOnInit(): void {
    this.loadUsers();
  }

  //#endregion

  //#region Paginator
  handlePageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.users.length) {
      endIndex = this.users.length;
    }
    this.usersSlice = this.users.slice(startIndex, endIndex);
  }
  //#endregion

  // #region Add, Edit, Delete

  addNewUser() {
    this.router.navigateByUrl('signup');
  }

  sendUserData(user: UserReadDTO) {
    this.choosenUser = user;
  }

  resetUser() {
    this.choosenUser = {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      isAdmin: false,
      isDisabled: false,
    };
  }

  editUser(user: UserReadDTO) {
    this.sendUserData(user);

    console.log('Edit user:', user);
    console.log('choosen user:', this.choosenUser);
    this.router.navigate(['/signup', user.id]);
  }

  deleteUser(e: Event) {
    // const index = this.users.findIndex((u) => u.id === userId);
    // if (index !== -1) {}
    e.preventDefault();
    const user = this.choosenUser;
    console.log('Delete user:', user.id);
    this.userService.deleteUser(user.id).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User deleted successfully',
        });
        location.reload();
      },
      error: (error) => {
        console.error('Calling API failed', error);
        if (error.status === 409) {
          this.messageService.add({
            severity: 'error',
            summary: 'Conflict!',
            detail: 'User cannot delete himself',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: "Something went wrong, user wasn't removed",
          });
        }
      },
    });
    this.resetUser();
  }

  //#endregion

  //#region Search

  roleOptions = [
    { label: 'All', value: null },
    { label: 'Admin', value: true },
    { label: 'User', value: false },
  ];
  stateOptions = [
    { label: 'All', value: null },
    { label: 'Disabled', value: true },
    { label: 'Active', value: false },
  ];

  onSubmit(e: Event): void {
    e.preventDefault();
    if (this.userForm.value.name === '') {
      this.userForm.value.name = null;
    }
    // send data to server
    this.loadUsers();
  }

  resetForm() {
    this.userForm.reset();
    //this.search();
  }

  //#endregion

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
