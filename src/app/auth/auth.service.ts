import { Inject, Injectable, afterNextRender } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { LoginDTO, RegisterDTO } from '../../models/user';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  _isAdmin = false;

  constructor(@Inject(DOCUMENT) private document: Document) {
    const localStorage = document.defaultView?.localStorage;
    if (localStorage) {
      const token = localStorage.getItem('userAuth');
      this._isLoggedIn$.next(!!token);
      const userData = this.getCurrentUserData();
      this._isAdmin = userData.isAdmin;
    }
    //#region unused code
    // const token = localStorage.getItem('userAuth');
    // this._isLoggedIn$.next(!!token);
    // const userData = this.getCurrentUserData();
    // this._isAdmin = userData.isAdmin;
    // afterNextRender(() => {
    //   const token = localStorage.getItem('userAuth');
    //   if (token) {
    //     try {
    //       this._isLoggedIn$.next(!!token);
    //       const userData = this.getCurrentUserData();
    //       this._isAdmin = userData.isAdmin;
    //     } catch (err) {
    //       console.log(err);
    //     }
    //   }
    // });
    //#endregion
  }

  httpClient = inject(HttpClient);
  baseUrl = 'https://localhost:7145/api/User';

  // #region Login function
  login(credentials: LoginDTO) {
    // change datatype into 'application/x-www-form-urlencoded' to be accepted as a form in backend
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded;'
    );
    let postData = new URLSearchParams();
    postData.set('Email', credentials.email!);
    postData.set('Password', credentials.password!);
    // send post request
    return this.httpClient
      .post(`${this.baseUrl}/Login`, postData, {
        headers: headers,
      })
      .pipe(
        tap((response: any) => {
          this._isLoggedIn$.next(true);
          localStorage.setItem('userAuth', response.token);
          localStorage.setItem('userData', JSON.stringify(response.user));
          this._isAdmin = response.user.isAdmin;
        })
      );
  }
  //#endregion

  // #region Addnew user
  signup(data: RegisterDTO) {
    return this.httpClient.post(`${this.baseUrl}/Register`, data);
  }
  //#endregion

  // #region Logout
  logout() {
    this._isLoggedIn$.next(false);
    this._isAdmin = false;
    localStorage.removeItem('userAuth');
    localStorage.removeItem('userData');
  }
  //#endregion

  // #region Get current user
  getCurrentUser() {
    let token = localStorage.getItem('userAuth');
    if (!token) return null;
    return new JwtHelperService().decodeToken(token);
  }

  getCurrentUserData() {
    if (localStorage.getItem('userData') == null) {
      return false;
    } else {
      const value = localStorage.getItem('userData');
      return value ? JSON.parse(value) : null;
    }
  }
  //#endregion
}
