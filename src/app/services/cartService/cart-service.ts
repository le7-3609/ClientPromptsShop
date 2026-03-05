import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { CartItemModel, GuestCartItem, CartModel, CreateBasicSiteDto, UpdateBasicSiteDto, BasicSiteInfo } from '../../models/cart-model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private CARTS_URL = environment.apiUrl + '/Carts';
  private BASIC_SITE_URL = environment.apiUrl + '/BasicSite';
  private GUEST_KEY = 'guest_cart';
  private CART_ID_KEY = 'cart_id';
  private BASIC_SITE_ID_KEY = 'basic_site_id';
  private http = inject(HttpClient);

  // --- state ---
  private cartItems = new BehaviorSubject<CartItemModel[]>([]);
  private cartInfo = new BehaviorSubject<CartModel | null>(null);
  private basicSite = new BehaviorSubject<BasicSiteInfo | null>(null);
  private isVisible = new BehaviorSubject<boolean>(false);

  cartItems$ = this.cartItems.asObservable();
  cartInfo$ = this.cartInfo.asObservable();
  basicSite$ = this.basicSite.asObservable();
  isVisible$ = this.isVisible.asObservable();

  /** Resolved cartId for the current session */
  private resolvedCartId: number | null = null;

  constructor() {
    this.initCart();
  }

  // ─── Initialization ────────────────────────────────────────
  private async initCart() {
    const savedUser = localStorage.getItem('user_data');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user?.userId) {
          // Logged-in user: load from server via stored cartId
          const cartId = this.getStoredCartId();
          if (cartId) {
            await this.loadCartItemsFromServer(cartId);
            const bsId = this.getStoredBasicSiteId();
            if (bsId) {
              await this.loadBasicSiteInfo(bsId);
            }
          }
          return;
        }
      } catch {
        // invalid stored data, ignore
      }
    }
    // Guest: load from localStorage
    this.loadFromLocalStorage();
  }

  // ─── Stored IDs (localStorage persistence) ─────────────────
  private getStoredCartId(): number | null {
    const id = localStorage.getItem(this.CART_ID_KEY);
    if (!id) return null;
    const parsed = parseInt(id, 10);
    return isNaN(parsed) ? null : parsed;
  }

  private setStoredCartId(cartId: number) {
    localStorage.setItem(this.CART_ID_KEY, String(cartId));
    this.resolvedCartId = cartId;
  }

  private clearStoredCartId() {
    localStorage.removeItem(this.CART_ID_KEY);
    this.resolvedCartId = null;
  }

  private getStoredBasicSiteId(): number | null {
    const id = localStorage.getItem(this.BASIC_SITE_ID_KEY);
    if (!id) return null;
    const parsed = parseInt(id, 10);
    return isNaN(parsed) ? null : parsed;
  }

  private setStoredBasicSiteId(id: number) {
    localStorage.setItem(this.BASIC_SITE_ID_KEY, String(id));
  }

  private clearStoredBasicSiteId() {
    localStorage.removeItem(this.BASIC_SITE_ID_KEY);
  }

  // ─── CartId helpers ────────────────────────────────────────
  getCartId(): number | null {
    return this.resolvedCartId;
  }

  /** Ensure the server cart is loaded for a logged-in user (handles page refresh) */
  async ensureCartLoaded(userId: number) {
    if (this.resolvedCartId !== null) return;

    const storedCartId = this.getStoredCartId();
    if (storedCartId) {
      await this.loadCartItemsFromServer(storedCartId);
      const bsId = this.getStoredBasicSiteId();
      if (bsId) {
        await this.loadBasicSiteInfo(bsId);
      }
    }
  }

  // ─── Guest cart (localStorage) ─────────────────────────────
  private getGuestCart(): GuestCartItem[] {
    const saved = localStorage.getItem(this.GUEST_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  private saveGuestCart(items: GuestCartItem[]) {
    localStorage.setItem(this.GUEST_KEY, JSON.stringify(items));
  }

  private clearGuestCart() {
    localStorage.removeItem(this.GUEST_KEY);
  }

  private async loadFromLocalStorage() {
    const guestCart = this.getGuestCart();
    if (guestCart.length > 0) {
      const displayItems = await this.enrichGuestCartItems(guestCart);
      this.cartItems.next(displayItems);
    }
  }

  private async enrichGuestCartItems(guestItems: GuestCartItem[]): Promise<CartItemModel[]> {
    const enriched: CartItemModel[] = [];

    for (const item of guestItems) {
      try {
        const product = await firstValueFrom(
          this.http.get<any>(`${environment.apiUrl}/Products/${item.productId}`)
        );

        enriched.push({
          cartItemId: Date.now() + enriched.length,
          cartId: 0,
          productId: item.productId,
          productName: product.productName,
          price: product.price,
          imageUrl: product.imageUrl || '',
          subCategoryName: product.subCategoryName || '',
          platformName: product.platformName || '',
          platformId: item.platformId,
          userDescription: item.userDescription,
          isActive: true,
        });
      } catch (error) {
        console.error(`Failed to load product ${item.productId}:`, error);
      }
    }

    return enriched;
  }

  // ─── Server cart loading ───────────────────────────────────
  /** Load cart items from server via GET /api/Carts/{cartId}/items (returns CartItemDTO[]) */
  async loadCartItemsFromServer(cartId: number) {
    try {
      const items = await firstValueFrom(
        this.http.get<CartItemModel[]>(`${this.CARTS_URL}/${cartId}/items`)
      );
      this.resolvedCartId = cartId;
      this.setStoredCartId(cartId);
      this.cartItems.next(items || []);
    } catch (error) {
      console.error('Failed to load cart items from server:', error);
      // CartId might be stale — clear it
      this.clearStoredCartId();
    }
  }

  /** Load basic site details from server via GET /api/BasicSite/{id} */
  async loadBasicSiteInfo(basicSiteId: number) {
    try {
      const bs = await firstValueFrom(
        this.http.get<any>(`${this.BASIC_SITE_URL}/${basicSiteId}`)
      );
      if (bs) {
        this.basicSite.next({
          basicSiteId: bs.basicSiteId,
          siteName: bs.siteName || '',
          siteTypeName: bs.siteTypeName || '',
          siteTypeId: bs.siteTypeId || 0,
          siteDescription: bs.userDescreption || bs.siteTypeDescreption || '',
          platformId: bs.platformId,
          platformName: bs.platformName || '',
          price: bs.price || 0,
        });
      }
    } catch (error) {
      console.error('Failed to load basic site info:', error);
      this.clearStoredBasicSiteId();
      this.basicSite.next(null);
    }
  }

  /** Link a basic site to the current cart via PUT /api/Carts/{cartId} */
  private async linkBasicSiteToCart(basicSiteId: number): Promise<void> {
    if (!this.resolvedCartId) return;
    try {
      await firstValueFrom(
        this.http.put(`${this.CARTS_URL}/${this.resolvedCartId}`, {
          basicSiteId,
        })
      );
    } catch (error) {
      console.error('Failed to link basic site to cart:', error);
    }
  }

  /** If a basic site was created before a cart existed, link it now */
  private async linkPendingBasicSite(): Promise<void> {
    const bsId = this.getStoredBasicSiteId();
    if (bsId && this.resolvedCartId) {
      await this.linkBasicSiteToCart(bsId);
      await this.loadBasicSiteInfo(bsId);
    }
  }

  // ─── Add product to cart ───────────────────────────────────
  async addToCart(
    productId: number,
    userId: number,
    platformId: number,
    desc: string,
    promptId?: number
  ) {
    // Check for duplicates in current items
    if (this.cartItems.value.some((item) => item.productId === productId)) {
      const error: any = new Error('Product already in cart');
      error.code = 'DUPLICATE';
      throw error;
    }

    if (userId) {
      // ── Registered user: add to server ──
      try {
        const payload = {
          cartId: 0, // Ignored by backend — cart is resolved by userId
          productId,
          platformId,
          ...(promptId && promptId > 0 ? { promptId } : {}),
        };
        const result = await firstValueFrom(
          this.http.post<CartItemModel>(
            `${this.CARTS_URL}/users/${userId}/items`,
            payload
          )
        );

        // Get cartId from the server response
        if (result?.cartId) {
          this.setStoredCartId(result.cartId);
        }

        // Link pending basic site now that a cart exists
        await this.linkPendingBasicSite();

        // Reload all items from server
        if (this.resolvedCartId) {
          await this.loadCartItemsFromServer(this.resolvedCartId);
        }
      } catch (error: any) {
        if (error?.status === 409) {
          const dupError: any = new Error('Product already in cart');
          dupError.code = 'DUPLICATE';
          throw dupError;
        }
        console.error('Failed to add to server cart:', error);
        throw error;
      }
    } else {
      // ── Guest user: save to localStorage ──
      const currentGuest = this.getGuestCart();
      if (currentGuest.some((item) => item.productId === productId)) {
        const error: any = new Error('Product already in cart');
        error.code = 'DUPLICATE';
        throw error;
      }

      currentGuest.push({
        productId,
        platformId,
        promptId: promptId && promptId > 0 ? promptId : undefined,
        userDescription: desc,
      });
      this.saveGuestCart(currentGuest);
      const displayItems = await this.enrichGuestCartItems(currentGuest);
      this.cartItems.next(displayItems);
    }

    this.openSidebar();
  }

  // ─── Remove cart item ──────────────────────────────────────
  async removeCartItem(cartItemId: number, cartId: number) {
    if (cartId && cartId > 0) {
      try {
        await firstValueFrom(this.http.delete(`${this.CARTS_URL}/items/${cartItemId}`));
        await this.loadCartItemsFromServer(cartId);
      } catch (error) {
        console.error('Failed to delete from server:', error);
      }
    } else {
      const currentItems = this.cartItems.value;
      const itemToRemove = currentItems.find((item) => item.cartItemId === cartItemId);

      if (itemToRemove) {
        const guestCart = this.getGuestCart();
        const updatedGuest = guestCart.filter(
          (item) => item.productId !== itemToRemove.productId
        );
        const updatedItems = currentItems.filter(
          (item) => item.cartItemId !== cartItemId
        );

        this.saveGuestCart(updatedGuest);
        this.cartItems.next(updatedItems);
      }
    }
  }

  // ─── Toggle item active ────────────────────────────────────
  async toggleItemActive(cartItemId: number, isActive: boolean, cartId: number) {
    if (cartId && cartId > 0) {
      // Must include platformId — backend sets it to null if omitted
      const item = this.cartItems.value.find((i) => i.cartItemId === cartItemId);
      await firstValueFrom(
        this.http.put(`${this.CARTS_URL}/items`, {
          cartItemId,
          isActive,
          platformId: item?.platformId ?? null,
        })
      );
      await this.loadCartItemsFromServer(cartId);
    } else {
      const currentItems = this.cartItems.value.map((item) =>
        item.cartItemId === cartItemId ? { ...item, isActive } : item
      );
      this.cartItems.next(currentItems);
    }
  }

  // ─── Update platform ──────────────────────────────────────
  async updatePlatform(cartItemId: number, platformId: number, cartId: number) {
    if (cartId && cartId > 0) {
      // Must include isActive — backend sets it to false if omitted
      const item = this.cartItems.value.find((i) => i.cartItemId === cartItemId);
      await firstValueFrom(
        this.http.put(`${this.CARTS_URL}/items`, {
          cartItemId,
          platformId,
          isActive: item?.isActive ?? true,
        })
      );
      await this.loadCartItemsFromServer(cartId);
    } else {
      const currentItems = this.cartItems.value;
      const itemToUpdate = currentItems.find((item) => item.cartItemId === cartItemId);

      if (itemToUpdate) {
        const guestCart = this.getGuestCart();
        const guestItem = guestCart.find(
          (item) => item.productId === itemToUpdate.productId
        );
        if (guestItem) {
          guestItem.platformId = platformId;
          this.saveGuestCart(guestCart);
          await this.loadFromLocalStorage();
        }
      }
    }
  }

  // ─── BasicSite CRUD ────────────────────────────────────────
  /** Create a new basic site via POST /api/BasicSite, then link it to the cart.
   *  If no cart exists yet, the basic site is stored and linked when a cart is created. */
  async createBasicSite(dto: CreateBasicSiteDto): Promise<any> {
    const response = await firstValueFrom(
      this.http.post<any>(this.BASIC_SITE_URL, dto)
    );

    const newBasicSiteId = response?.basicSiteId;
    if (newBasicSiteId) {
      this.setStoredBasicSiteId(newBasicSiteId);

      // Link to cart if one exists
      if (this.resolvedCartId) {
        await this.linkBasicSiteToCart(newBasicSiteId);
      }

      // Load full basic site info into state
      await this.loadBasicSiteInfo(newBasicSiteId);
    }

    return response;
  }

  /** Update an existing basic site via PUT /api/BasicSite/{id} */
  async updateBasicSite(basicSiteId: number, dto: UpdateBasicSiteDto): Promise<any> {
    // Backend expects basicSiteId in the body (UpdateBasicSiteDTO record)
    const payload = {
      basicSiteId,
      siteName: dto.siteName,
      userDescreption: dto.userDescreption,
      siteTypeId: dto.siteTypeId,
      platformId: dto.platformId,
    };

    await firstValueFrom(
      this.http.put<void>(`${this.BASIC_SITE_URL}/${basicSiteId}`, payload)
    );

    // Reload basic site info to reflect changes (price may change with siteType)
    await this.loadBasicSiteInfo(basicSiteId);
  }

  /** Get basic site by id via GET /api/BasicSite/{id} */
  async getBasicSiteById(basicSiteId: number): Promise<any> {
    return firstValueFrom(
      this.http.get<any>(`${this.BASIC_SITE_URL}/${basicSiteId}`)
    );
  }

  getBasicSiteInfo(): BasicSiteInfo | null {
    return this.basicSite.value;
  }

  hasBasicSite(): boolean {
    return this.basicSite.value !== null;
  }

  // ─── Totals ────────────────────────────────────────────────
  getProductsTotal(): number {
    return this.cartItems.value
      .filter((item) => item.isActive)
      .reduce((sum, item) => sum + item.price, 0);
  }

  getBasicSitePrice(): number {
    return this.basicSite.value?.price || 0;
  }

  getCartTotal(): number {
    return this.getProductsTotal() + this.getBasicSitePrice();
  }

  // ─── Import guest cart (login/register) ────────────────────
  async syncCartToServer(userId: number) {
    const guestItems = this.getGuestCart();

    if (guestItems.length > 0) {
      try {
        const cleanedItems = guestItems.map((item) => ({
          productId: item.productId,
          platformId: item.platformId || null,
          promptId: item.promptId && item.promptId > 0 ? item.promptId : null,
          userDescription: item.userDescription || '',
        }));

        const result = await firstValueFrom(
          this.http.post<{ cartId: number; addedCount: number }>(
            `${this.CARTS_URL}/users/${userId}/import-guest`,
            { items: cleanedItems }
          )
        );

        this.setStoredCartId(result.cartId);
        this.clearGuestCart();
        await this.loadCartItemsFromServer(result.cartId);

        // Link pending basic site if one was created before the cart
        await this.linkPendingBasicSite();
      } catch (error) {
        console.error('Failed to sync guest cart:', error);
        // Still try to load existing server cart
        const cartId = this.getStoredCartId();
        if (cartId) {
          await this.loadCartItemsFromServer(cartId);
        }
      }
    } else {
      // No guest items — just load existing server cart if cartId stored
      const cartId = this.getStoredCartId();
      if (cartId) {
        await this.loadCartItemsFromServer(cartId);
        const bsId = this.getStoredBasicSiteId();
        if (bsId) {
          await this.loadBasicSiteInfo(bsId);
        }
      }
    }
  }

  // ─── Clear cart ────────────────────────────────────────────
  async clearCart(cartId: number) {
    if (cartId && cartId > 0) {
      try {
        await firstValueFrom(this.http.delete(`${this.CARTS_URL}/${cartId}/clear`));
      } catch (error) {
        console.error('Failed to clear cart on server:', error);
      }
    }
    this.clearGuestCart();
    this.cartItems.next([]);
    this.cartInfo.next(null);
    this.basicSite.next(null);
    this.clearStoredCartId();
    this.clearStoredBasicSiteId();
  }

  // ─── Sidebar ───────────────────────────────────────────────
  openSidebar() {
    this.isVisible.next(true);
  }
  closeSidebar() {
    this.isVisible.next(false);
  }

  // ─── User & Order validation ───────────────────────────────
  isUserRegistered(): boolean {
    const savedUser = localStorage.getItem('user_data');
    if (!savedUser) return false;
    try {
      const user = JSON.parse(savedUser);
      return !!user?.userId;
    } catch {
      return false;
    }
  }

  getUserId(): number | null {
    const savedUser = localStorage.getItem('user_data');
    if (!savedUser) return null;
    try {
      const user = JSON.parse(savedUser);
      return user?.userId || null;
    } catch {
      return null;
    }
  }

  canPlaceOrder(): { canPlace: boolean; reason?: string } {
    const basicSite = this.basicSite.value;
    if (!basicSite) {
      return { canPlace: false, reason: 'Cart must contain exactly one BASIC SITE' };
    }
    return { canPlace: true };
  }

  // ─── Handle Basic Site Status & Action ─────────────────────
  /** Returns status indicating what action should be taken:
   *  - 'LOGIN_REQUIRED': Guest user, redirect to login
   *  - 'CREATE': No basic site in cart, proceed with creation
   *  - 'UPDATE_CONFIRM': Basic site exists, ask user if they want to update
   */
  async checkBasicSiteStatus(): Promise<'LOGIN_REQUIRED' | 'CREATE' | 'UPDATE_CONFIRM'> {
    if (!this.isUserRegistered()) {
      return 'LOGIN_REQUIRED';
    }

    const userId = this.getUserId();
    if (userId) {
      await this.ensureCartLoaded(userId);
    }

    if (this.hasBasicSite()) {
      return 'UPDATE_CONFIRM';
    }

    return 'CREATE';
  }

  /** Handle basic site creation/update based on user confirmation */
  async handleBasicSiteAction(
    dto: CreateBasicSiteDto,
    shouldUpdate: boolean = false
  ): Promise<any> {
    const basicSite = this.basicSite.value;

    if (shouldUpdate && basicSite) {
      return await this.updateBasicSite(basicSite.basicSiteId, dto as UpdateBasicSiteDto);
    } else {
      return await this.createBasicSite(dto);
    }
  }

  // ─── Convert Cart to Order ─────────────────────────────────
  /** After order is placed, clear cart state and unlink basic site from server cart */
  async afterOrderPlaced() {
    // Unlink basicSiteId from the server cart for a clean slate
    if (this.resolvedCartId) {
      try {
        await firstValueFrom(
          this.http.put(`${this.CARTS_URL}/${this.resolvedCartId}`, {
            basicSiteId: null,
          })
        );
      } catch {
        /* ignore */
      }
    }

    this.cartItems.next([]);
    this.cartInfo.next(null);
    this.basicSite.next(null);
    this.clearStoredCartId();
    this.clearStoredBasicSiteId();
    this.clearGuestCart();
  }
}