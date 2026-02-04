import { Injectable ,inject} from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AddCartItemDto, CartItemModel } from '../../Models/cart-model';


@Injectable({ providedIn: 'root' })
export class CartService {
  private BASIC_URL = environment.apiUrl + '/cart';
  private http = inject(HttpClient);

  private cartItems = new BehaviorSubject<CartItemModel[]>([]);
  private isVisible = new BehaviorSubject<boolean>(false);

  cartItems$ = this.cartItems.asObservable();
  isVisible$ = this.isVisible.asObservable();

 async addToCart(productId: number, cartId: number, platformId: number, desc: string) {
  const payload: AddCartItemDto = { 
    cartId: cartId, 
    productId: productId, 
    basicSitesPlatformId: platformId, 
    userDescription: desc 
  };
  
  await firstValueFrom(this.http.post(`${this.BASIC_URL}/items`, payload));
  await this.loadCart(cartId);
  this.openSidebar();
}
  async loadCart(cartId: number) {
    const items = await firstValueFrom(this.http.get<CartItemModel[]>(`${this.BASIC_URL}/${cartId}/items`));
    this.cartItems.next(items);
  }

  openSidebar() { this.isVisible.next(true); }
  closeSidebar() { this.isVisible.next(false); }
}