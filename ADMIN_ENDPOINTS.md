# Admin-Only Endpoints - Complete List

This document lists all backend API endpoints that should be protected with Admin role authorization.

---

## 🔒 Authentication Requirements

All these endpoints should have the `[Authorize(Roles = "Admin")]` attribute in your C# backend.

Example:
```csharp
[Authorize(Roles = "Admin")]
[HttpGet]
public IActionResult GetAllOrders() { ... }
```

---

## 📦 Products Management

### Base URL: `/api/Products`

| Method | Endpoint | Description | Used By |
|--------|----------|-------------|---------|
| POST | `/api/Products` | Create new product | AdminProducts |
| PUT | `/api/Products/{id}` | Update existing product | AdminProducts |
| DELETE | `/api/Products/{id}` | Delete product | AdminProducts |

**Public Endpoints (No Auth Required):**
- GET `/api/Products` - Get products list (with pagination/filters)
- GET `/api/Products/{id}` - Get single product details

---

## 📋 Orders Management

### Base URL: `/api/Orders`

| Method | Endpoint | Description | Used By |
|--------|----------|-------------|---------|
| GET | `/api/Orders` | Get all orders (admin view) | AdminOrders |
| GET | `/api/Orders/statuses` | Get all order statuses | AdminOrders |
| PUT | `/api/Orders` | Update order status | AdminOrders |

**User-Specific Endpoints (Require Auth, Not Admin):**
- GET `/api/Users/{userId}/orders` - Get user's own orders
- GET `/api/Orders/{orderId}` - Get order details (if user owns it)
- GET `/api/Orders/{orderId}/orderItems` - Get order items (if user owns it)
- POST `/api/Orders/carts/{cartId}` - Create order from cart (user's own cart)
- GET `/api/Orders/{orderId}/prompt` - Get order prompt (if user owns it)

---

## ⭐ Reviews Management

### Base URL: `/api/Reviews`

| Method | Endpoint | Description | Used By |
|--------|----------|-------------|---------|
| GET | `/api/Reviews` | Get all reviews (admin view) | AdminOrders |

**User-Specific Endpoints (Require Auth, Not Admin):**
- GET `/api/Reviews/{orderId}` - Get review for order (if user owns order)
- POST `/api/Reviews/{orderId}` - Create review (if user owns order)
- PUT `/api/Reviews` - Update review (if user owns review)

---

## 👥 Users Management

### Base URL: `/api/Users`

| Method | Endpoint | Description | Used By |
|--------|----------|-------------|---------|
| GET | `/api/Users` | Get all users list | AdminUsers |

**User-Specific Endpoints (Require Auth, Not Admin):**
- PUT `/api/Users/{id}` - Update user profile (own profile only)

**Public Endpoints (No Auth Required):**
- POST `/api/Users/login` - User login
- POST `/api/Users/register` - User registration
- POST `/api/Users/social-login` - Social login

---

## 🏷️ Main Categories Management

### Base URL: `/api/MainCategories`

| Method | Endpoint | Description | Used By |
|--------|----------|-------------|---------|
| POST | `/api/MainCategories` | Create main category | AdminMainCategories |
| PUT | `/api/MainCategories/{id}` | Update main category | AdminMainCategories |
| DELETE | `/api/MainCategories/{id}` | Delete main category | AdminMainCategories |

**Public Endpoints (No Auth Required):**
- GET `/api/MainCategories` - Get all main categories
- GET `/api/MainCategories/{id}` - Get main category by ID

**Note:** Currently, the AdminMainCategories component shows "Save/Delete functionality to be implemented" - these endpoints may need to be created in the backend.

---

## 📂 Sub Categories Management

### Base URL: `/api/SubCategories`

| Method | Endpoint | Description | Used By |
|--------|----------|-------------|---------|
| POST | `/api/SubCategories` | Create sub-category | AdminSubCategories |
| PUT | `/api/SubCategories/{id}` | Update sub-category | AdminSubCategories |
| DELETE | `/api/SubCategories/{id}` | Delete sub-category | AdminSubCategories |
| POST | `/api/SubCategories/upload-image` | Upload sub-category image | AdminSubCategories |

**Public Endpoints (No Auth Required):**
- GET `/api/SubCategories` - Get all sub-categories (with pagination/filters)
- GET `/api/SubCategories/{id}` - Get sub-category by ID

**Note:** The save/delete/upload endpoints are commented out in the frontend service with "TODO: Add when backend is ready" - these need to be implemented in the backend.

---

## 🌐 Site Types Management

### Base URL: `/api/SiteType`

| Method | Endpoint | Description | Used By |
|--------|----------|-------------|---------|
| POST | `/api/SiteType` | Create site type | AdminSiteTypes |
| PUT | `/api/SiteType/{id}` | Update site type | AdminSiteTypes |
| DELETE | `/api/SiteType/{id}` | Delete site type | AdminSiteTypes |

**Public Endpoints (No Auth Required):**
- GET `/api/SiteType` - Get all site types
- GET `/api/SiteType/{id}` - Get site type by ID

---

## 📊 Admin Dashboard

### Base URL: Various

The AdminDashboard component may use aggregated data from multiple endpoints. Consider creating dedicated admin analytics endpoints:

**Suggested Admin Analytics Endpoints:**
- GET `/api/Admin/dashboard/stats` - Get dashboard statistics
- GET `/api/Admin/dashboard/recent-orders` - Get recent orders
- GET `/api/Admin/dashboard/revenue` - Get revenue data

---

## 🔐 Backend Implementation Checklist

### For Each Admin Endpoint:

```csharp
[Authorize(Roles = "Admin")]
[HttpPost]
public IActionResult CreateProduct([FromBody] ProductModel product)
{
    // Verify user has Admin role (handled by [Authorize] attribute)
    // Implement business logic
    return Ok(result);
}
```

### CORS Configuration

Ensure your backend allows credentials:

```csharp
services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", builder =>
    {
        builder.WithOrigins("http://localhost:5000")
               .AllowCredentials() // Required for HttpOnly cookies
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});
```

### JWT Configuration

Ensure role claims are included in JWT:

```csharp
var claims = new[]
{
    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
    new Claim(ClaimTypes.Email, user.Email),
    new Claim(ClaimTypes.Role, user.Role), // Critical for role-based auth
    new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}")
};

var token = new JwtSecurityToken(
    issuer: _configuration["Jwt:Issuer"],
    audience: _configuration["Jwt:Audience"],
    claims: claims,
    expires: DateTime.UtcNow.AddDays(7),
    signingCredentials: credentials
);
```

---

## 🛡️ Security Best Practices

### 1. Always Validate User Role
Even with `[Authorize(Roles = "Admin")]`, validate in business logic:

```csharp
var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
if (userRole != "Admin")
{
    return Forbid();
}
```

### 2. Audit Admin Actions
Log all admin operations:

```csharp
_logger.LogInformation(
    "Admin {AdminEmail} deleted product {ProductId} at {Timestamp}",
    User.FindFirst(ClaimTypes.Email)?.Value,
    productId,
    DateTime.UtcNow
);
```

### 3. Rate Limiting
Implement rate limiting for admin endpoints to prevent abuse.

### 4. Input Validation
Always validate and sanitize input data:

```csharp
if (string.IsNullOrWhiteSpace(product.ProductName))
{
    return BadRequest("Product name is required");
}
```

### 5. Soft Deletes
Consider soft deletes instead of hard deletes:

```csharp
product.IsDeleted = true;
product.DeletedAt = DateTime.UtcNow;
product.DeletedBy = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
await _context.SaveChangesAsync();
```

---

## 🧪 Testing Admin Endpoints

### Using Postman/Thunder Client

1. **Login as Admin:**
```http
POST /api/Auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "AdminPassword123"
}
```

2. **Verify Cookie is Set:**
Check response headers for `Set-Cookie: auth_token=...`

3. **Test Admin Endpoint:**
```http
GET /api/Orders
Cookie: auth_token=<token_from_login>
```

4. **Test Non-Admin User:**
Login with regular user and try admin endpoint - should get 403 Forbidden.

---

## 📝 Frontend Guard Usage

All admin routes are protected by `adminGuard`:

```typescript
// In app.routes.ts
{
  path: 'admin',
  canActivate: [adminGuard],
  loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
}
```

The `adminGuard` checks:
1. User is logged in
2. User has "Admin" role (from JWT claims)
3. Auth has been initialized (prevents race conditions)

---

## 🚨 Common Issues

### Issue: Admin endpoints return 401 Unauthorized
**Solution:** Ensure `withCredentials: true` is set on all HTTP requests in services.

### Issue: Admin endpoints return 403 Forbidden
**Solution:** 
- Verify JWT includes role claim
- Check backend `[Authorize(Roles = "Admin")]` attribute
- Ensure user's role in database is "Admin" (case-sensitive)

### Issue: Admin check uses hardcoded email
**Solution:** Replace email checks with role-based checks:

```typescript
// ❌ Bad (hardcoded email)
if (user.email?.toLowerCase() === 'clicksite@gmail.com')

// ✅ Good (role-based)
if (authService.hasRole('Admin'))
```

---

## 🔄 Migration Steps

### 1. Update Backend Endpoints
Add `[Authorize(Roles = "Admin")]` to all admin endpoints listed above.

### 2. Update Frontend Services
Add `withCredentials: true` to all admin HTTP calls:

```typescript
// Before
this.http.post(url, data)

// After
this.http.post(url, data, { withCredentials: true })
```

### 3. Replace Email Checks
Find and replace all hardcoded email checks in admin components:

```typescript
// In admin-orders.ts, admin-users.ts, admin-main-categories.ts, etc.
// Replace:
if (user.email?.toLowerCase() !== 'clicksite@gmail.com')

// With:
if (!this.authService.hasRole('Admin'))
```

### 4. Test All Admin Features
- Login as admin → Access admin panel ✓
- Login as regular user → Blocked from admin panel ✓
- Try admin API calls as regular user → 403 Forbidden ✓

---

## 📋 Summary

**Total Admin-Only Endpoints:**

| Category | Create | Update | Delete | List/View |
|----------|--------|--------|--------|-----------|
| Products | ✓ | ✓ | ✓ | Public |
| Orders | - | ✓ (status) | - | ✓ |
| Reviews | - | - | - | ✓ (all) |
| Users | - | - | - | ✓ (all) |
| Main Categories | ✓* | ✓* | ✓* | Public |
| Sub Categories | ✓* | ✓* | ✓* | Public |
| Site Types | ✓ | ✓ | ✓ | Public |

*Note: Endpoints marked with * may need backend implementation (currently commented out or showing "to be implemented" in frontend).

**Total Endpoints Requiring Admin Role: ~20-25**

All these endpoints should be protected with JWT-based role authorization using the `[Authorize(Roles = "Admin")]` attribute in your C# backend.
