import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginModel } from '../Models/login-model';
import { UserProfileModel } from '../Models/user-model';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private BASIC_URL = `${environment.apiUrl}/Users`;

  private currentUserSubject = new BehaviorSubject<UserProfileModel | null>(null);
  public currentUser = toSignal(this.currentUserSubject.asObservable(), { initialValue: null });
  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const savedUser = localStorage.getItem('user_data');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(credentials: LoginModel): Observable<UserProfileModel> {
    return this.http.post<UserProfileModel>(`${this.BASIC_URL}/login`, credentials).pipe(
      tap(user => {
        if (user) {
          localStorage.setItem('user_data', JSON.stringify(user));
          localStorage.setItem('last_email', user.email);
          this.currentUserSubject.next(user);
          this.syncCartToDB(); // פונקציה שנממש בהמשך לסנכרון הסל
        }
      })
    );
  }

  register(registerForm: any): Observable<UserProfileModel> {
    return this.http.post<UserProfileModel>(`${this.BASIC_URL}/register`, registerForm);
  }

  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.BASIC_URL}/${id}`, userData).pipe(
      tap(updatedData => {
        const currentUser = this.currentUser();
        if (currentUser) {
          const newUser = { ...currentUser, ...userData };
          localStorage.setItem('user_data', JSON.stringify(newUser));
          this.currentUserSubject.next(newUser);
        }
      })
    );
  }

  getCurrentUser(): UserProfileModel | null {
    return this.currentUserSubject.value;
  }

  getSavedEmail(): string {
    return localStorage.getItem('last_email') || '';
  }

  logout() {
    localStorage.removeItem('user_data');
    this.currentUserSubject.next(null);
  }

  checkStrength(pwd: string): Observable<any> {
    const url = `${environment.apiUrl}/PasswordValidity/passwordStrength`;
    return this.http.post<any>(url, JSON.stringify(pwd), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  syncCartToDB() { }
}
