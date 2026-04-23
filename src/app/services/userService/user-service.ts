import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginModel } from '../../models/login-model';
import { UserProfileModel } from '../../models/user-model';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment.development';
import { Injector, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private BASIC_URL = `${environment.apiUrl}/Users`;
  private injector = inject(Injector);

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
          this.syncCartToDB(user.userId); 
        }
      })
    );
  }

  register(registerForm: any): Observable<HttpResponse<UserProfileModel>> {
    return this.http.post<UserProfileModel>(`${this.BASIC_URL}/register`, registerForm, { observe: 'response' }).pipe(
      tap(response => {
        const user = response.body as UserProfileModel | null;
        if (user) {
          localStorage.setItem('user_data', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.syncCartToDB(user.userId);
        }
      })
    );
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

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.BASIC_URL);
  }

  getAdminUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.BASIC_URL);
  }

  getSavedEmail(): string {
    return localStorage.getItem('last_email') || '';
  }

  logout() {
    localStorage.removeItem('user_data');
    this.currentUserSubject.next(null);
  }

  socialLogin(dto: { token: string; provider: string }): Observable<UserProfileModel> {
    return this.http.post<UserProfileModel>(`${this.BASIC_URL}/social-login`, dto).pipe(
      tap(user => {
        if (user) {
          localStorage.setItem('user_data', JSON.stringify(user));
          localStorage.setItem('last_email', user.email);
          this.currentUserSubject.next(user);
          this.syncCartToDB(user.userId);
        }
      })
    );
  }

  checkStrength(pwd: string): Observable<any> {
    const url = `${environment.apiUrl}/PasswordValidity/passwordStrength`;
    return this.http.post<any>(url, JSON.stringify(pwd), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  syncCartToDB(userId: number) {
    import('../cartService/cart-service').then(({ CartService }) => {
      const cartService = this.injector.get(CartService);
      cartService.syncCartToServer(userId).catch(error => {
        console.error('Cart sync failed after login/register, but auth was successful:', error);
      });
    });
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return user ? user.email.toLocaleLowerCase() === 'clicksite@gmail.com' : false;
  }
}
