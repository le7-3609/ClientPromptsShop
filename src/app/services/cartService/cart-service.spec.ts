import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CartService } from './cart-service';
import { CartItemModel, GuestCartItem } from '../../models/cart-model';
import { environment } from '../../../environments/environment.development';

const CARTS_URL = `${environment.apiUrl}/Carts`;
const BASIC_SITE_URL = `${environment.apiUrl}/BasicSite`;

const mockCartItem: CartItemModel = {
  cartItemId: 10,
  cartId: 5,
  productId: 99,
  productName: 'Prompt Pack',
  price: 19.99,
  imageUrl: '',
  subCategoryName: 'SEO',
  platformName: 'ChatGPT',
  platformId: 1,
  userDescription: 'test desc',
  isActive: true,
};

describe('CartService – unit tests', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('initial cartItems$ emits empty array', (done) => {
    service.cartItems$.subscribe(items => {
      expect(items).toEqual([]);
      done();
    });
  });

  it('initial isVisible$ emits false', (done) => {
    service.isVisible$.subscribe(v => {
      expect(v).toBeFalse();
      done();
    });
  });

  it('openSidebar() sets isVisible$ to true', (done) => {
    let count = 0;
    service.isVisible$.subscribe(v => {
      count++;
      if (count === 2) {
        expect(v).toBeTrue();
        done();
      }
    });
    service.openSidebar();
  });

  it('closeSidebar() sets isVisible$ to false after opening', (done) => {
    service.openSidebar();
    let count = 0;
    service.isVisible$.subscribe(v => {
      count++;
      if (count === 2) {
        expect(v).toBeFalse();
        done();
      }
    });
    service.closeSidebar();
  });

  it('getCartId() returns null when no cart loaded', () => {
    expect(service.getCartId()).toBeNull();
  });

  it('isUserRegistered() returns false when no user in localStorage', () => {
    expect(service.isUserRegistered()).toBeFalse();
  });

  it('isUserRegistered() returns true when valid user in localStorage', () => {
    localStorage.setItem('user_data', JSON.stringify({ userId: 1, email: 'test@example.com' }));
    expect(service.isUserRegistered()).toBeTrue();
  });

  it('getUserId() returns null when no user stored', () => {
    expect(service.getUserId()).toBeNull();
  });

  it('getUserId() returns userId when user stored', () => {
    localStorage.setItem('user_data', JSON.stringify({ userId: 42 }));
    expect(service.getUserId()).toBe(42);
  });

  it('canPlaceOrder() returns false when no basicSite', () => {
    const result = service.canPlaceOrder();
    expect(result.canPlace).toBeFalse();
    expect(result.reason).toBeTruthy();
  });

  it('removeCartItem() for guest removes item from state', fakeAsync(() => {
    // Set up guest cart state manually
    const guestItems: GuestCartItem[] = [{ productId: 99, platformId: 1, userDescription: 'desc' }];
    localStorage.setItem('guest_cart', JSON.stringify(guestItems));
    // Directly set internal state
    (service as any).cartItems.next([mockCartItem]);

    service.removeCartItem(10, 0);
    tick();

    service.cartItems$.subscribe(items => {
      expect(items.find(i => i.cartItemId === 10)).toBeUndefined();
    });
  }));

  it('toggleItemActive() for guest updates item state locally', fakeAsync(() => {
    (service as any).cartItems.next([mockCartItem]);

    service.toggleItemActive(10, false, 0);
    tick();

    service.cartItems$.subscribe(items => {
      const item = items.find(i => i.cartItemId === 10);
      expect(item?.isActive).toBeFalse();
    });
  }));

  it('loadCartItemsFromServer() GETs cart items and updates state', async () => {
    const items = [mockCartItem];
    const promise = service.loadCartItemsFromServer(5);
    const req = httpMock.expectOne(`${CARTS_URL}/5/items`);
    req.flush(items);
    await promise;

    service.cartItems$.subscribe(result => expect(result).toEqual(items));
    expect(service.getCartId()).toBe(5);
  });

  it('loadCartItemsFromServer() clears stored cartId on error', async () => {
    localStorage.setItem('cart_id', '5');
    const promise = service.loadCartItemsFromServer(5);
    const req = httpMock.expectOne(`${CARTS_URL}/5/items`);
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    await promise;

    expect(localStorage.getItem('cart_id')).toBeNull();
  });

  it('clearCart() for guest clears all state and localStorage', async () => {
    localStorage.setItem('guest_cart', JSON.stringify([{ productId: 1, userDescription: 'x' }]));
    (service as any).cartItems.next([mockCartItem]);

    // clearCart(0) – guest path (no HTTP call)
    await service.clearCart(0);

    service.cartItems$.subscribe(items => expect(items).toEqual([]));
    expect(localStorage.getItem('guest_cart')).toBeNull();
  });

  it('clearCart() for server cart calls DELETE then clears state', async () => {
    (service as any).resolvedCartId = 5;
    (service as any).cartItems.next([mockCartItem]);

    const promise = service.clearCart(5);
    const req = httpMock.expectOne(`${CARTS_URL}/5/clear`);
    req.flush(null);
    await promise;

    service.cartItems$.subscribe(items => expect(items).toEqual([]));
  });

  it('addToCart() throws DUPLICATE error when product already in cart', async () => {
    (service as any).cartItems.next([mockCartItem]);
    let thrownError: any;
    try {
      await service.addToCart(99, 0, 1, 'desc');
    } catch (e: any) {
      thrownError = e;
    }
    expect(thrownError?.code).toBe('DUPLICATE');
  });

  it('removeCartItem() for server cart calls DELETE and reloads', async () => {
    (service as any).resolvedCartId = 5;

    const promise = service.removeCartItem(10, 5);
    const deleteReq = httpMock.expectOne(`${CARTS_URL}/items/10`);
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush(null);

    const getReq = httpMock.expectOne(`${CARTS_URL}/5/items`);
    getReq.flush([]);
    await promise;
  });

  it('createBasicSite() POSTs and stores basicSiteId', async () => {
    const dto = { siteName: 'My Site', siteTypeId: 1, platformId: 2, userDescreption: 'desc' };
    const promise = service.createBasicSite(dto as any);

    const req = httpMock.expectOne(BASIC_SITE_URL);
    expect(req.request.method).toBe('POST');
    req.flush({ basicSiteId: 7 });
    await promise;

    expect(localStorage.getItem('basic_site_id')).toBe('7');
  });
});
