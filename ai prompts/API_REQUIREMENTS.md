# דרישות API לסל הקניות

## Endpoints נדרשים

### 1. קבלת פריטי הסל
```
GET /api/cart/{cartId}/items
```

**Response:**
```json
[
  {
    "cartItemId": 1,
    "cartId": 123,
    "productId": 456,
    "productName": "Premium Website Template",
    "price": 299,
    "imageUrl": "https://example.com/image.jpg",
    "subCategoryName": "E-commerce Templates",
    "platformName": "WordPress",
    "userDescription": "Custom description",
    "isActive": true
  }
]
```

### 2. הוספת פריט לסל
```
POST /api/cart/items
```

**Request Body:**
```json
{
  "cartId": 123,
  "productId": 456,
  "basicSitesPlatformId": 1,
  "userDescription": "Optional custom description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to cart",
  "cartItemId": 789
}
```

### 3. מחיקת פריט מהסל
```
DELETE /api/cart/items/{cartItemId}
```

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

### 4. עדכון סטטוס פריט (Active/Inactive)
```
PUT /api/cart/items/{cartItemId}/active
```

**Request Body:**
```json
{
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item status updated"
}
```

### 5. קבלת סיכום הסל (אופציונלי)
```
GET /api/cart/{cartId}/summary
```

**Response:**
```json
{
  "cartId": 123,
  "totalItems": 5,
  "activeItems": 3,
  "totalPrice": 897,
  "activeTotalPrice": 597
}
```

### 6. ניקוי הסל (אופציונלי)
```
DELETE /api/cart/{cartId}/clear
```

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared"
}
```

## מבנה הנתונים

### CartItemModel (Frontend)
```typescript
export interface CartItemModel {
    cartItemId: number;
    cartId: number;
    productId: number;
    productName: string;
    price: number;
    imageUrl: string;
    subCategoryName: string;
    platformName: string;
    userDescription: string;
    isActive: boolean;
}
```

### AddCartItemDto (Frontend)
```typescript
export interface AddCartItemDto {
    cartId: number;
    productId: number;
    basicSitesPlatformId: number;
    userDescription: string;
}
```

## טבלאות Database (דוגמה)

### Carts Table
```sql
CREATE TABLE Carts (
    CartId INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
```

### CartItems Table
```sql
CREATE TABLE CartItems (
    CartItemId INT PRIMARY KEY IDENTITY(1,1),
    CartId INT NOT NULL,
    ProductId INT NOT NULL,
    BasicSitesPlatformId INT,
    UserDescription NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (CartId) REFERENCES Carts(CartId),
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId),
    FOREIGN KEY (BasicSitesPlatformId) REFERENCES BasicSitesPlatforms(Id)
);
```

## Logic בצד השרת

### יצירת סל אוטומטית
כאשר משתמש נרשם, צור לו סל אוטומטית:
```csharp
// C# Example
public async Task<int> CreateCartForUser(int userId)
{
    var cart = new Cart
    {
        UserId = userId,
        CreatedAt = DateTime.Now
    };
    
    _context.Carts.Add(cart);
    await _context.SaveChangesAsync();
    
    return cart.CartId;
}
```

### בדיקת בעלות על סל
ודא שהמשתמש יכול לגשת רק לסל שלו:
```csharp
public async Task<bool> ValidateCartOwnership(int cartId, int userId)
{
    var cart = await _context.Carts
        .FirstOrDefaultAsync(c => c.CartId == cartId && c.UserId == userId);
    
    return cart != null;
}
```

### חישוב מחיר כולל
```csharp
public async Task<decimal> CalculateCartTotal(int cartId, bool activeOnly = true)
{
    var query = _context.CartItems
        .Include(ci => ci.Product)
        .Where(ci => ci.CartId == cartId);
    
    if (activeOnly)
        query = query.Where(ci => ci.IsActive);
    
    return await query.SumAsync(ci => ci.Product.Price);
}
```

### מניעת כפילויות
בדוק אם מוצר כבר בסל לפני הוספה:
```csharp
public async Task<bool> IsProductInCart(int cartId, int productId)
{
    return await _context.CartItems
        .AnyAsync(ci => ci.CartId == cartId && ci.ProductId == productId);
}
```

## טיפול בשגיאות

### שגיאות נפוצות שיש להחזיר:

1. **404 - Cart Not Found**
```json
{
  "error": "Cart not found",
  "code": "CART_NOT_FOUND"
}
```

2. **404 - Product Not Found**
```json
{
  "error": "Product not found",
  "code": "PRODUCT_NOT_FOUND"
}
```

3. **403 - Unauthorized**
```json
{
  "error": "You don't have permission to access this cart",
  "code": "UNAUTHORIZED_CART_ACCESS"
}
```

4. **409 - Product Already in Cart**
```json
{
  "error": "Product already exists in cart",
  "code": "DUPLICATE_CART_ITEM"
}
```

5. **400 - Invalid Data**
```json
{
  "error": "Invalid cart data",
  "code": "INVALID_CART_DATA",
  "details": ["ProductId is required", "Price must be positive"]
}
```

## אבטחה

### בדיקות שיש לבצע:
1. ✅ אימות שהמשתמש מחובר
2. ✅ בדיקה שהסל שייך למשתמש
3. ✅ ולידציה של נתונים נכנסים
4. ✅ הגבלת כמות פריטים בסל (למשל מקסימום 50)
5. ✅ בדיקת זמינות מוצר לפני הוספה

### דוגמה ל-Authorization:
```csharp
[Authorize]
[HttpPost("cart/items")]
public async Task<IActionResult> AddToCart([FromBody] AddCartItemDto dto)
{
    var userId = GetCurrentUserId(); // מתוך JWT token
    
    // בדוק שהסל שייך למשתמש
    if (!await ValidateCartOwnership(dto.CartId, userId))
        return Forbid();
    
    // המשך הלוגיקה...
}
```

## Performance

### אופטימיזציות מומלצות:

1. **Caching** - שמור את הסל ב-cache:
```csharp
var cacheKey = $"cart_{cartId}";
var cart = await _cache.GetOrCreateAsync(cacheKey, async entry =>
{
    entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30);
    return await GetCartItems(cartId);
});
```

2. **Eager Loading** - טען את כל הנתונים הנדרשים בשאילתה אחת:
```csharp
var items = await _context.CartItems
    .Include(ci => ci.Product)
        .ThenInclude(p => p.SubCategory)
    .Include(ci => ci.BasicSitesPlatform)
        .ThenInclude(bsp => bsp.Platform)
    .Where(ci => ci.CartId == cartId)
    .ToListAsync();
```

3. **Pagination** - אם יש הרבה פריטים:
```csharp
var items = await _context.CartItems
    .Where(ci => ci.CartId == cartId)
    .Skip(skip)
    .Take(take)
    .ToListAsync();
```

## Testing

### בדיקות שיש לבצע:
- ✅ הוספת פריט לסל
- ✅ מחיקת פריט מהסל
- ✅ עדכון סטטוס פריט
- ✅ חישוב סכום כולל
- ✅ בדיקת הרשאות
- ✅ טיפול בשגיאות
- ✅ מניעת כפילויות
