# דוגמאות קוד לשימוש בסל הקניות

## 1. הוספת מוצר לסל מכל מקום בקוד

```typescript
import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cartService/cart-service';
import { UserService } from '../../services/userService/user-service';
import { MessageService } from 'primeng/api';

export class YourComponent {
  private cartService = inject(CartService);
  private userService = inject(UserService);
  private messageService = inject(MessageService);

  async addProductToCart(productId: number) {
    const user = this.userService.getCurrentUser();
    
    if (!user) {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Login Required', 
        detail: 'Please login first' 
      });
      return;
    }

    try {
      await this.cartService.addToCart(
        productId,
        user.userId,  // cartId
        1,            // platformId - adjust as needed
        ''            // optional description
      );
      
      // הסל הצף ייפתח אוטומטית!
      
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Product added to cart!' 
      });
    } catch (error) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Failed to add product' 
      });
    }
  }
}
```

## 2. הצגת מספר פריטים בסל

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../services/cartService/cart-service';

export class YourComponent implements OnInit {
  private cartService = inject(CartService);
  cartItemCount = 0;

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = items?.length || 0;
    });
  }
}
```

```html
<span class="badge">{{ cartItemCount }}</span>
```

## 3. פתיחה ידנית של הסל הצף

```typescript
openCart() {
  this.cartService.openSidebar();
}
```

```html
<button (click)="openCart()">
  <i class="pi pi-shopping-cart"></i>
  View Cart
</button>
```

## 4. חישוב סכום כולל

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../services/cartService/cart-service';

export class YourComponent implements OnInit {
  private cartService = inject(CartService);
  totalPrice = 0;

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.totalPrice = items
        ?.filter(item => item.isActive)
        .reduce((sum, item) => sum + item.price, 0) || 0;
    });
  }
}
```

## 5. הוספת כפתור "Quick Add" בכרטיס מוצר

```html
<!-- בתבנית HTML -->
<div class="product-card">
  <h3>{{ product.productName }}</h3>
  <p>{{ product.price }} ₪</p>
  
  <button 
    pButton 
    icon="pi pi-shopping-cart" 
    label="Quick Add"
    (click)="quickAdd(product.productId)"
    class="p-button-sm">
  </button>
</div>
```

```typescript
// בקומפוננט
async quickAdd(productId: number) {
  const user = this.userService.getCurrentUser();
  if (!user) {
    this.router.navigate(['/auth']);
    return;
  }

  await this.cartService.addToCart(productId, user.userId, 1, '');
}
```

## 6. בדיקה אם מוצר כבר בסל

```typescript
isInCart(productId: number): boolean {
  const items = this.cartService.cartItems.value;
  return items?.some(item => item.productId === productId) || false;
}
```

```html
<button 
  [disabled]="isInCart(product.productId)"
  [label]="isInCart(product.productId) ? 'In Cart' : 'Add to Cart'">
</button>
```

## 7. מחיקת פריט מהסל

```typescript
async removeFromCart(cartItemId: number) {
  const user = this.userService.getCurrentUser();
  if (!user) return;

  try {
    await this.cartService.removeCartItem(cartItemId, user.userId);
    this.messageService.add({ 
      severity: 'success', 
      summary: 'Removed', 
      detail: 'Item removed from cart' 
    });
  } catch (error) {
    this.messageService.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: 'Failed to remove item' 
    });
  }
}
```

## 8. סימון/ביטול סימון פריט

```typescript
async toggleItem(cartItemId: number, currentStatus: boolean) {
  const user = this.userService.getCurrentUser();
  if (!user) return;

  await this.cartService.toggleItemActive(
    cartItemId, 
    !currentStatus, 
    user.userId
  );
}
```

## 9. ניקוי הסל (Clear Cart)

```typescript
async clearCart() {
  const user = this.userService.getCurrentUser();
  if (!user) return;

  const items = this.cartService.cartItems.value;
  
  for (const item of items) {
    await this.cartService.removeCartItem(item.cartItemId, user.userId);
  }
  
  this.messageService.add({ 
    severity: 'success', 
    summary: 'Cart Cleared', 
    detail: 'All items removed' 
  });
}
```

## 10. טעינת הסל בעת התחברות

```typescript
// ב-UserService, בפונקציה login()
login(credentials: LoginModel): Observable<UserProfileModel> {
  return this.http.post<UserProfileModel>(`${this.BASIC_URL}/login`, credentials).pipe(
    tap(user => {
      if (user) {
        localStorage.setItem('user_data', JSON.stringify(user));
        this.currentUserSubject.next(user);
        
        // טען את הסל!
        this.loadUserCart(user.userId);
      }
    })
  );
}

private loadUserCart(userId: number) {
  // Inject CartService and load cart
  import('../cartService/cart-service').then(m => {
    const cartService = inject(m.CartService);
    cartService.loadCart(userId);
  });
}
```

## 11. הוספה עם דיאלוג אישור

```typescript
async addWithConfirmation(productId: number, productName: string) {
  const confirmed = confirm(`Add ${productName} to cart?`);
  
  if (confirmed) {
    await this.addProductToCart(productId);
  }
}
```

## 12. הוספה עם אנימציה

```html
<button 
  pButton 
  icon="pi pi-shopping-cart"
  [loading]="isAdding"
  (click)="addWithAnimation(product.productId)">
</button>
```

```typescript
isAdding = false;

async addWithAnimation(productId: number) {
  this.isAdding = true;
  
  try {
    await this.addProductToCart(productId);
    // אנימציה של הצלחה
  } finally {
    this.isAdding = false;
  }
}
```

## עצות שימושיות

1. **תמיד בדוק התחברות** לפני הוספה לסל
2. **השתמש ב-try-catch** לטיפול בשגיאות
3. **הצג הודעות למשתמש** (Toast messages)
4. **עדכן את ה-UI** אחרי כל פעולה
5. **שמור את הסל** גם ב-localStorage לגיבוי
