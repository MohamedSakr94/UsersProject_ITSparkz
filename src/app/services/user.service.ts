import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { inject } from '@angular/core';
import { ChangePasswordDTO, UpdateDTO, UserReadDTO } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  httpClient = inject(HttpClient);
  baseUrl = 'https://localhost:7145/api/User';

  getUsers(
    searchText?: string,
    isAdmin?: boolean,
    isDisabled?: boolean
  ): Observable<UserReadDTO[]> {
    //#region check for search params
    let url = `${this.baseUrl}/Admin?`;
    if (searchText !== null && searchText !== undefined) {
      url += `searchText=${searchText}`;
    }
    if (isAdmin !== null && isAdmin !== undefined) {
      url += `&isAdmin=${isAdmin}`;
    }
    if (isDisabled !== null && isDisabled !== undefined) {
      url += `&isDisabled=${isDisabled}`;
    }
    //#endregion

    return this.httpClient.get<UserReadDTO[]>(url);
  }

  deleteUser(id: string): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.baseUrl}/${id}`);
  }

  getUserById(id: string): Observable<UserReadDTO> {
    return this.httpClient.get<UserReadDTO>(`${this.baseUrl}/${id}`);
  }

  updateUser(data: UpdateDTO) {
    return this.httpClient.put(`${this.baseUrl}/Edit`, data);
  }

  changePassword(userPassword: ChangePasswordDTO) {
    return this.httpClient.post<any>(
      `${this.baseUrl}/Changepassword`,
      userPassword
    );
  }
}
