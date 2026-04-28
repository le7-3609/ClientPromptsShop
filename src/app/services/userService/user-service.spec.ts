import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './user-service';
import { UserProfileModel } from '../../models/user-model';
import { LoginModel } from '../../models/login-model';
import { environment } from '../../../environments/environment.development';

const USERS_URL = `${environment.apiUrl}/Users`;

const mockUser: UserProfileModel = {
  userId: 1,
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phone: '',
};

describe('UserService – unit tests', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getCurrentUser() returns null when no user stored', () => {
    expect(service.getCurrentUser()).toBeNull();
  });

  it('loads user from localStorage on init', () => {
    localStorage.setItem('user_data', JSON.stringify(mockUser));
    const s = new (UserService as any)(TestBed.inject(provideHttpClient as any));
    // Verify via a fresh inject cycle
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    localStorage.setItem('user_data', JSON.stringify(mockUser));
    const freshService = TestBed.inject(UserService);
    expect(freshService.getCurrentUser()).toEqual(mockUser);
    TestBed.inject(HttpTestingController).verify();
  });

  it('isAdmin() returns false for a non-admin user', () => {
    localStorage.setItem('user_data', JSON.stringify(mockUser));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const s = TestBed.inject(UserService);
    expect(s.isAdmin()).toBeFalse();
    TestBed.inject(HttpTestingController).verify();
  });

  it('isAdmin() returns true for the admin email', () => {
    const admin = { ...mockUser, email: 'clicksite@gmail.com' };
    localStorage.setItem('user_data', JSON.stringify(admin));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const s = TestBed.inject(UserService);
    expect(s.isAdmin()).toBeTrue();
    TestBed.inject(HttpTestingController).verify();
  });

  it('logout() clears user_data and resets currentUser', () => {
    localStorage.setItem('user_data', JSON.stringify(mockUser));
    service.logout();
    expect(localStorage.getItem('user_data')).toBeNull();
    expect(service.getCurrentUser()).toBeNull();
  });

  it('getSavedEmail() returns stored email', () => {
    localStorage.setItem('last_email', 'test@example.com');
    expect(service.getSavedEmail()).toBe('test@example.com');
  });

  it('getSavedEmail() returns empty string when nothing stored', () => {
    expect(service.getSavedEmail()).toBe('');
  });

  it('login() stores user in localStorage and updates currentUser', () => {
    const credentials = new LoginModel();
    credentials.email = 'test@example.com';
    credentials.password = 'password';
    let result: UserProfileModel | undefined;

    service.login(credentials).subscribe(u => (result = u));

    const req = httpMock.expectOne(`${USERS_URL}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);

    expect(result).toEqual(mockUser);
    expect(JSON.parse(localStorage.getItem('user_data')!)).toEqual(mockUser);
    expect(service.getCurrentUser()).toEqual(mockUser);
  });

  it('register() stores user in localStorage on success', () => {
    const form = { firstName: 'Test', lastName: 'User', email: 'new@example.com', password: 'Pass1!' };
    let called = false;

    service.register(form).subscribe(() => (called = true));

    const req = httpMock.expectOne(`${USERS_URL}/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser, { status: 201, statusText: 'Created' });

    expect(called).toBeTrue();
    expect(JSON.parse(localStorage.getItem('user_data')!)).toEqual(mockUser);
  });

  it('updateUser() PUTs to correct URL', () => {
    service.updateUser(1, { firstName: 'Updated' }).subscribe();

    const req = httpMock.expectOne(`${USERS_URL}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ firstName: 'Updated' });
    req.flush({});
  });

  it('getUsers() GETs from correct URL', () => {
    service.getUsers().subscribe();
    const req = httpMock.expectOne(USERS_URL);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
