import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom, tap, catchError, of } from 'rxjs';
import { UserProfileModel } from '../../models/user-model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private BASIC_URL = `${environment.apiUrl}/Auth`;

  private currentUserSubject = new BehaviorSubject<UserProfileModel | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private authInitializedSubject = new BehaviorSubject<boolean>(false);
  public authInitialized$ = this.authInitializedSubject.asObservable();

  constructor(private http: HttpClient) {}

  async checkAuth(): Promise<void> {
    try {
      const user = await firstValueFrom(
        this.http.get<UserProfileModel>(`${this.BASIC_URL}/me`, { withCredentials: true })
          .pipe(catchError(() => of(null)))
      );
      
      this.currentUserSubject.next(user);
    } catch (error) {
      this.currentUserSubject.next(null);
    } finally {
      this.authInitializedSubject.next(true);
    }
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.role?.toLowerCase() === role.toLowerCase();
  }

  /**
   * Get current user synchronously
   */
  getCurrentUser(): UserProfileModel | null {
    return this.currentUserSubject.value;
  }

  /**
   * Login with credentials - backend sets HttpOnly cookie
   */
  login(credentials: { email: string; password: string }): Observable<UserProfileModel> {
    return this.http.post<UserProfileModel>(`${this.BASIC_URL}/login`, credentials, { withCredentials: true })
      .pipe(tap(user => this.currentUserSubject.next(user)));
  }

  /**
   * Social login - backend sets HttpOnly cookie
   */
  socialLogin(dto: { token: string; provider: string }): Observable<UserProfileModel> {
    return this.http.post<UserProfileModel>(`${this.BASIC_URL}/social-login`, dto, { withCredentials: true })
      .pipe(tap(user => this.currentUserSubject.next(user)));
  }

  /**
   * Register new user - backend sets HttpOnly cookie
   */
  register(registerData: any): Observable<UserProfileModel> {
    return this.http.post<UserProfileModel>(`${this.BASIC_URL}/register`, registerData, { withCredentials: true })
      .pipe(tap(user => this.currentUserSubject.next(user)));
  }

  /**
   * Logout - backend clears HttpOnly cookie
   */
  logout(): Observable<void> {
    return this.http.post<void>(`${this.BASIC_URL}/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => this.currentUserSubject.next(null)),
        catchError(() => {
          this.currentUserSubject.next(null);
          return of(void 0);
        })
      );
  }

  /**
   * Check if auth has been initialized (for guards)
   */
  isAuthInitialized(): boolean {
    return this.authInitializedSubject.value;
  }
}
