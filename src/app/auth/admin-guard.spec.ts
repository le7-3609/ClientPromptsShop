import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { adminGuard } from './admin-guard';
import { UserService } from '../services/userService/user-service';

describe('adminGuard – unit tests', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => adminGuard(...guardParameters));

  let userService: UserService;
  let router: Router;
  let httpMock: HttpTestingController;

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('allows access when isAdmin() returns true', () => {
    spyOn(userService, 'isAdmin').and.returnValue(true);
    const result = executeGuard(mockRoute, mockState);
    expect(result).toBeTrue();
  });

  it('redirects to "/" when isAdmin() returns false', () => {
    spyOn(userService, 'isAdmin').and.returnValue(false);
    const navigateSpy = spyOn(router, 'navigate');
    const result = executeGuard(mockRoute, mockState);
    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/']);
  });
});
