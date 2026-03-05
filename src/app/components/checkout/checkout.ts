import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { CartService } from '../../services/cartService/cart-service';
import { UserService } from '../../services/userService/user-service';
import { OrderService } from '../../services/orderService/order-service';
import { CartItemModel, BasicSiteInfo } from '../../models/cart-model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, DialogModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout implements OnInit {
  private cartService = inject(CartService);
  private userService = inject(UserService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  cartItems: CartItemModel[] = [];
  basicSite: BasicSiteInfo | null = null;
  totalPrice: number = 0;
  showPayPalModal = false;
  isProcessing = false;
  paymentSuccess = false;

  ngOnInit() {
    const user = this.userService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/auth'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    this.cartService.ensureCartLoaded(user.userId);

    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items.filter((item) => item.isActive);
      this.calculateTotal();
    });

    this.cartService.basicSite$.subscribe((site) => {
      this.basicSite = site;
      this.calculateTotal();
    });
  }

  calculateTotal() {
    const productsTotal = this.cartItems.reduce((sum, item) => sum + item.price, 0);
    const sitePrice = this.basicSite?.price || 0;
    this.totalPrice = productsTotal + sitePrice;
  }

  get canCheckout(): boolean {
    return this.basicSite !== null;
  }

  openPayPalModal() {
    if (!this.canCheckout) {
      return;
    }
    this.showPayPalModal = true;
  }

  async processPayment() {
    this.isProcessing = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const cartId = this.cartService.getCartId();
      if (cartId) {
        await firstValueFrom(this.orderService.createOrderFromCart(cartId));

        await this.cartService.afterOrderPlaced();
      }

      this.isProcessing = false;
      this.paymentSuccess = true;

      setTimeout(() => {
        this.showPayPalModal = false;
        this.router.navigate(['/payment-success']);
      }, 1500);
    } catch (error) {
      console.error('Payment failed:', error);
      this.isProcessing = false;
      this.cancelPayment();
    }
  }

  cancelPayment() {
    this.showPayPalModal = false;
    this.isProcessing = false;
    this.paymentSuccess = false;
  }
}
