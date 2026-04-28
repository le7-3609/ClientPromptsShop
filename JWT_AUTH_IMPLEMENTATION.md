# JWT-Based Authentication with HttpOnly Cookies - Implementation Guide

## Overview

This implementation replaces the insecure localStorage-based authentication with a professional JWT approach using HttpOnly cookies. The JWT token is stored in an HttpOnly cookie (managed by the backend), making it immune to XSS attacks.

---

## Architecture

### Key Components

1. **AuthService** - Core authentication service managing user state
2. **UserService** - User-related operations (now delegates auth to AuthService)
3. **Guards** - Route protection (authGuard, adminGuard, roleGuard)
4. **App Component** - Initializes auth on startup

### Authentication Flow

```
1. App Startup → App.ngOnInit() → authService.checkAuth()
2. Backend validates JWT from HttpOnly cookie
3. Returns user data (including role) or null
4. AuthService updates currentUser$ BehaviorSubject
5. Guards can now safely check authentication state
```

---

## Backend Requirements

Your C# .NET backend must implement these endpoints:

### 1. POST /api/Auth/login
```csharp
// Request body: { email: string, password: string }
// Response: UserProfileModel with role
// Sets HttpOnly cookie with JWT
[HttpPost("login")]
public IActionResult Login([FromBody] LoginRequest request)
{
    // Validate credentials
    var user = ValidateUser(request.Email, request.Password);
    
    // Generate JWT with role claim
    var token = GenerateJwtToken(user);
    
    // Set HttpOnly cookie
    Response.Cookies.Append("auth_token", token, new CookieOptions
    {
        HttpOnly = true,
        Secure = true, // HTTPS only
        SameSite = SameSiteMode.Strict,
        Expires = DateTimeOffset.UtcNow.AddDays(7)
    });
    
    return Ok(new UserProfileModel
    {
        UserId = user.Id,
        Email = user.Email,
        FirstName = user.FirstName,
        LastName = user.LastName,
        Phone = user.Phone,
        Role = user.Role // "Admin", "User", etc.
    });
}
```

### 2. GET /api/Auth/me
```csharp
// Validates JWT from cookie and returns user data
[HttpGet("me")]
[Authorize] // Requires valid JWT
public IActionResult GetCurrentUser()
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    var user = GetUserById(userId);
    
    return Ok(new UserProfileModel
    {
        UserId = user.Id,
        Email = user.Email,
        FirstName = user.FirstName,
        LastName = user.LastName,
        Phone = user.Phone,
        Role = user.Role
    });
}
```

### 3. POST /api/Auth/logout
```csharp
[HttpPost("logout")]
public IActionResult Logout()
{
    // Clear the HttpOnly cookie
    Response.Cookies.Delete("auth_token");
    return Ok();
}
```

### 4. POST /api/Auth/register
```csharp
// Similar to login - creates user and sets cookie
```

### 5. POST /api/Auth/social-login
```csharp
// Validates Google OAuth token and sets cookie
```

---

## Frontend Implementation

### 1. AuthService (auth-service.ts)

**Key Features:**
- `currentUser$` - Observable stream of user state
- `authInitialized$` - Signals when initial auth check is complete
- `checkAuth()` - Validates JWT on app startup
- `isLoggedIn()` - Synchronous auth check
- `hasRole(role)` - Role-based authorization
- All HTTP calls use `withCredentials: true` to send cookies

**Usage Example:**
```typescript
// In any component
constructor(private authService: AuthService) {}

ngOnInit() {
  this.authService.currentUser$.subscribe(user => {
    if (user) {
      console.log('Logged in as:', user.email, 'Role:', user.role);
    }
  });
}

// Check if admin
isAdmin = computed(() => this.authService.hasRole('Admin'));
```

### 2. Guards

#### authGuard (auth-guard.ts)
Protects routes that require authentication:
```typescript
// In app.routes.ts
{ path: 'orders', component: Orders, canActivate: [authGuard] }
```

#### adminGuard (admin-guard.ts)
Protects admin-only routes:
```typescript
{ path: 'admin', component: AdminPanel, canActivate: [adminGuard] }
```

#### roleGuard (role-guard.ts)
Flexible role-based protection:
```typescript
{ 
  path: 'manager', 
  component: ManagerPanel, 
  canActivate: [roleGuard],
  data: { roles: ['Admin', 'Manager'] } // User needs one of these roles
}
```

**Critical Security Feature:**
All guards wait for `authInitialized$` before checking auth state. This prevents race conditions where the guard runs before the initial JWT validation completes.

### 3. App Component (app.ts)

```typescript
async ngOnInit() {
  // Initialize auth on app startup
  await this.authService.checkAuth();
}
```

This ensures the JWT is validated before any route guards run.

### 4. UserService (user-service.ts)

**Refactored to:**
- Delegate all auth operations to AuthService
- Remove localStorage usage
- Use `withCredentials: true` for all HTTP calls
- Subscribe to AuthService's `currentUser$` as source of truth

**Migration Notes:**
- `userService.currentUser()` still works (now uses AuthService internally)
- `userService.isAdmin()` now checks role from JWT instead of email
- `userService.logout()` calls AuthService.logout()

### 5. Template Updates (Modern @if Syntax)

**Before (old *ngIf):**
```html
<ng-container *ngIf="userService.currentUser() as user; else noUser">
  <p-avatar [label]="user.firstName.charAt(0)"></p-avatar>
</ng-container>
<ng-template #noUser>
  <p-avatar icon="pi pi-user"></p-avatar>
</ng-template>
```

**After (modern @if):**
```html
@if (userService.currentUser(); as user) {
  <p-avatar [label]="user.firstName.charAt(0)"></p-avatar>
} @else {
  <p-avatar icon="pi pi-user"></p-avatar>
}
```

**Conditional Admin Menu:**
```html
@if (authService.hasRole('Admin')) {
  <a routerLink="/admin">Admin Dashboard</a>
}
```

**Using computed signals:**
```typescript
// In component
isAdmin = computed(() => this.authService.hasRole('Admin'));
```

```html
@if (isAdmin()) {
  <a routerLink="/admin">Admin Dashboard</a>
}
```

---

## Security Improvements

### Before (Insecure)
❌ JWT stored in localStorage (vulnerable to XSS)
❌ User data stored in localStorage
❌ Email-based admin check (hardcoded)
❌ No auth initialization wait (race conditions)

### After (Secure)
✅ JWT in HttpOnly cookie (immune to XSS)
✅ No sensitive data in localStorage
✅ Role-based authorization from JWT claims
✅ Guards wait for auth initialization
✅ All requests use `withCredentials: true`
✅ Backend validates JWT on every request

---

## Migration Checklist

### Backend Tasks
- [ ] Implement `/api/Auth/me` endpoint
- [ ] Update login/register to set HttpOnly cookie
- [ ] Add role claim to JWT
- [ ] Implement logout endpoint (clear cookie)
- [ ] Configure CORS to allow credentials
- [ ] Set cookie options: HttpOnly, Secure, SameSite

### Frontend Tasks
- [x] Create AuthService with JWT validation
- [x] Update guards to wait for auth initialization
- [x] Refactor UserService to use AuthService
- [x] Update App component to call checkAuth()
- [x] Add role field to UserProfileModel
- [x] Update templates to use @if syntax
- [ ] Remove any remaining localStorage usage
- [ ] Test all protected routes
- [ ] Test role-based access control

---

## Testing

### Test Scenarios

1. **Initial Load**
   - App starts → checkAuth() called → JWT validated → User logged in

2. **Login Flow**
   - User logs in → Backend sets cookie → AuthService updates state → Redirect

3. **Protected Route**
   - User navigates to /orders → authGuard waits for init → Checks auth → Allows/Denies

4. **Admin Route**
   - User navigates to /admin → adminGuard checks role → Allows if Admin

5. **Logout**
   - User logs out → Backend clears cookie → AuthService clears state → Redirect

6. **Session Expiry**
   - JWT expires → Next request fails → Backend returns 401 → Frontend redirects to login

---

## Common Issues & Solutions

### Issue: Guards redirect before auth check completes
**Solution:** Guards now wait for `authInitialized$` to emit true

### Issue: CORS errors with credentials
**Solution:** Backend must set:
```csharp
services.AddCors(options => {
    options.AddPolicy("AllowAngular", builder => {
        builder.WithOrigins("http://localhost:5000")
               .AllowCredentials() // Critical!
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});
```

### Issue: Cookie not sent with requests
**Solution:** All HTTP calls must use `withCredentials: true`

### Issue: Role check fails
**Solution:** Ensure backend includes role claim in JWT and returns it in `/me` endpoint

---

## Best Practices

1. **Never store JWT in localStorage** - Use HttpOnly cookies only
2. **Always use HTTPS in production** - Cookies with Secure flag require HTTPS
3. **Set appropriate cookie expiration** - Balance security vs. UX
4. **Implement refresh token rotation** - For long-lived sessions
5. **Log out on 401 responses** - Handle expired tokens gracefully
6. **Use role-based guards** - Don't hardcode email checks
7. **Wait for auth initialization** - Prevent race conditions in guards

---

## Example: Adding a New Protected Route

```typescript
// 1. In app.routes.ts
import { roleGuard } from './auth/role-guard';

export const routes: Routes = [
  {
    path: 'premium-content',
    component: PremiumContent,
    canActivate: [roleGuard],
    data: { roles: ['Premium', 'Admin'] }
  }
];

// 2. In component template
@if (authService.hasRole('Premium') || authService.hasRole('Admin')) {
  <a routerLink="/premium-content">Premium Content</a>
}

// 3. Backend endpoint
[Authorize(Roles = "Premium,Admin")]
[HttpGet("premium-content")]
public IActionResult GetPremiumContent() { ... }
```

---

## Conclusion

This implementation provides enterprise-grade authentication with:
- XSS protection via HttpOnly cookies
- Role-based authorization
- Race condition prevention
- Clean separation of concerns
- Modern Angular patterns (@if, signals, computed)

All sensitive authentication logic is now handled securely by the backend, with the frontend simply consuming the validated user state.
