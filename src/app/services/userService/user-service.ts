import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginModel } from '../../models/login-model';
import { UserProfileModel } from '../../models/user-model';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment.development';
import { Injector, inject } from '@angular/core';
import { AuthService } from '../authService/auth-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private BASIC_URL = `${environment.apiUrl}/Users`;
  private injector = inject(Injector);
  private authService = inject(AuthService);

  // Use AuthService's currentUser$ as the source of truth
  public currentUser = toSignal(this.authService.currentUser$, { initialValue: null });

  constructor(private http: HttpClient) {}

  login(credentials: LoginModel): Observable<UserProfileModel> {
    return this.authService.login(credentials).pipe(
      tap(user => {
        if (user) {
          this.syncCartToDB(user.userId);
        }
      })
    );
  }

  register(registerForm: any): Observable<UserProfileModel> {
    return this.authService.register(registerForm).pipe(
      tap(user => {
        if (user) {
          this.syncCartToDB(user.userId);
        }
      })
    );
  }

  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.BASIC_URL}/${id}`, userData, { withCredentials: true }).pipe(
      tap(() => {
        // Refresh user data from server after update
        this.authService.checkAuth();
      })
    );
  }

  getCurrentUser(): UserProfileModel | null {
    return this.authService.getCurrentUser();
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.BASIC_URL, { withCredentials: true });
  }

  getAdminUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.BASIC_URL, { withCredentials: true });
  }

  logout() {
    this.authService.logout().subscribe();
  }

  socialLogin(dto: { token: string; provider: string }): Observable<UserProfileModel> {
    return this.authService.socialLogin(dto).pipe(
      tap(user => {
        if (user) {
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
    return this.authService.hasRole('Admin');
  }
}
