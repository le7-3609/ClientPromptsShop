# Shopping Cart Implementation - הוראות שימוש

## מה נוסף לפרויקט?

### 1. **Cart Component** - עמוד הסל המלא
- נמצא ב: `src/app/components/cart/`
- נגיש דרך: `/cart`
- מציג את כל הפריטים בסל
- אפשרות לסמן/לבטל סימון פריטים (isActive)
- אפשרות למחוק פריטים
- סיכום מחירים
- כפתורים למעבר לתשלום ולעדכון פרטים

### 2. **CartSidebar Component** - סל צף
- נמצא ב: `src/app/components/cart-sidebar/`
- נפתח אוטומטית כשמוסיפים מוצר לסל
- מציג תצוגה מקוצרת של הסל
- כפתור למעבר לעמוד הסל המלא

### 3. **עדכונים ל-CartService**
נוספו פונקציות:
- `removeCartItem()` - מחיקת פריט מהסל
- `toggleItemActive()` - סימון/ביטול סימון פריט
- `getCartTotal()` - חישוב סכום כולל
- `openSidebar()` / `closeSidebar()` - פתיחה/סגירה של הסל הצף

### 4. **עדכון Menu Component**
- נוסף כפתור סל קניות עם badge שמציג כמות פריטים
- הכפתור מוביל לעמוד הסל

### 5. **עדכון SubCategory Component**
- כפתור "Add to Cart" מחובר לשירות הסל
- בדיקת התחברות לפני הוספה לסל
- פתיחת הסל הצף אחרי הוספה מוצלחת

## איך להשתמש?

### הוספת מוצר לסל:
```typescript
await this.cartService.addToCart(
  productId,    // מזהה המוצר
  cartId,       // מזהה הסל (בדרך כלל userId)
  platformId,   // מזהה הפלטפורמה
  description   // תיאור אופציונלי
);
```

### פתיחת הסל הצף:
```typescript
this.cartService.openSidebar();
```

### טעינת הסל:
```typescript
await this.cartService.loadCart(cartId);
```

## מה צריך להשלים?

### 1. **חיבור ל-API**
עדכן את `CartService` עם ה-endpoints הנכונים:
```typescript
// בקובץ: src/app/services/cartService/cart-service.ts

async removeCartItem(cartItemId: number, cartId: number) {
  await firstValueFrom(this.http.delete(`${this.BASIC_URL}/items/${cartItemId}`));
  await this.loadCart(cartId);
}

async toggleItemActive(cartItemId: number, isActive: boolean, cartId: number) {
  await firstValueFrom(this.http.put(`${this.BASIC_URL}/items/${cartItemId}/active`, { isActive }));
  await this.loadCart(cartId);
}
```

### 2. **מודל BasicSite** (אופציונלי)
אם יש לך מודל BasicSite כמו בפרויקט המקורי, תוכל להוסיף:
- הצגת פרטי האתר הבסיסי בעמוד הסל
- בדיקה אם המשתמש הגדיר את האתר הבסיסי
- חסימת תשלום אם לא הוגדר

### 3. **עמוד Checkout**
צור עמוד תשלום ב: `src/app/components/checkout/`
והוסף route:
```typescript
{ path: 'checkout', component: Checkout }
```

### 4. **שמירת הסל ב-localStorage** (אופציונלי)
לשמירת הסל גם כשהמשתמש לא מחובר:
```typescript
// ב-CartService
private saveToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
}

private loadFromLocalStorage() {
  const saved = localStorage.getItem('cart');
  if (saved) {
    this.cartItems.next(JSON.parse(saved));
  }
}
```

## עיצוב

כל העיצוב מותאם לעיצוב הקיים שלך:
- צבעים: סגול (#8139eb) ורקע בהיר (#F6E8FE)
- אנימציות חלקות
- Responsive design
- Glass morphism effects

## בעיות נפוצות

### הסל לא נטען?
ודא ש:
1. המשתמש מחובר
2. ה-API מחזיר את המבנה הנכון של CartItemModel
3. ה-cartId נשלח נכון

### הכפתור בתפריט לא מציג מספר?
ודא שה-CartService טוען את הסל בעת התחברות:
```typescript
// ב-UserService, בפונקציה login()
this.cartService.loadCart(user.userId);
```

## הערות חשובות

1. **המודלים מותאמים למבנה שלך** - CartItemModel משתמש ב:
   - `cartItemId`, `productId`, `productName`
   - `price`, `imageUrl`, `subCategoryName`
   - `platformName`, `userDescription`, `isActive`

2. **ה-routes מעודכנים** - נוסף route ל-`/cart`

3. **הכל standalone components** - תואם ל-Angular 17+

4. **PrimeNG modules** - משתמש ב:
   - Sidebar, Button, Card, Toast, Badge

## תמיכה נוספת

אם יש שאלות או בעיות, בדוק:
1. Console errors בדפדפן
2. Network tab - בדוק את התגובות מה-API
3. ודא שכל ה-imports נכונים
