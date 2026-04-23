import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { CartService } from '../../services/cartService/cart-service';
import { UserService } from '../../services/userService/user-service';
import { PaymentService } from '../../services/paymentService/payment-service';
import { CurrencyService } from '../../services/currencyService/currency-service';
import { SubCategoryService } from '../../services/subCategoryService/sub-category-service';
import { OrderService } from '../../services/orderService/order-service';
import { EmailService } from '../../services/emailService/email-service';
import { CartItemModel, BasicSiteInfo } from '../../models/cart-model';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.development';

declare const paypal: any;

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
  private paymentService = inject(PaymentService);
  private currencyService = inject(CurrencyService);
  private subCategoryService = inject(SubCategoryService);
  private orderService = inject(OrderService);
  private emailService = inject(EmailService);
  private router = inject(Router);

  cartItems: CartItemModel[] = [];
  basicSite: BasicSiteInfo | null = null;
  totalPrice: number = 0;
  showPayPalModal = false;
  isProcessing = false;
  paymentSuccess = false;
  paypalReady = false;
  paypalError: string | null = null;
  checkoutError: string | null = null;
  currencyCode = 'USD';
  currencyRate = 1;
  subCategoryImages: Map<string, string> = new Map();
  private isPayPalScriptLoaded = false;
  private loadedPayPalCurrency = 'USD';

  ngOnInit() {
    const user = this.userService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/auth'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    this.cartService.ensureCartLoaded(user.userId);

    this.currencyService.selectedCurrency$.subscribe((currency) => {
      this.currencyCode = currency.code;
    });

    this.currencyService.rate$.subscribe((rate) => {
      this.currencyRate = rate;
    });

    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items.filter((item) => item.isActive);
      this.calculateTotal();
      void this.loadSubCategoryImages();
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

    this.checkoutError = null;

    const cartId = this.cartService.getCartId();
    if (!cartId) {
      this.checkoutError = 'Could not find an active cart. Please refresh and try again.';
      return;
    }

    if (!environment.paypalClientId) {
      this.checkoutError = 'PayPal is not configured. Please set paypalClientId in environment.';
      return;
    }

    this.paypalError = null;
    this.paymentSuccess = false;
    this.paypalReady = false;
    this.showPayPalModal = true;
    void this.initializePayPalButtons();
  }

  private async initializePayPalButtons() {
    try {
      await this.loadPayPalScript();

      const containerId = 'paypal-button-container';
      let container = document.getElementById(containerId);

      // If PayPal or the dialog removed the container (PayPal Buttons may
      // replace/remove nodes when a popup is opened/closed), recreate it so
      // subsequent renders succeed without requiring a full page refresh.
      if (!container) {
        // Wait for the PrimeNG dialog and its content to be attached to the
        // DOM. The dialog is rendered asynchronously so attempting to query
        // it immediately can fail intermittently (especially after the
        // PayPal popup is opened/closed). Poll for the element for a short
        // period before giving up.
        const modalRoot = (await this.waitForSelector('.paypal-modal', 2000)) as HTMLElement | null;
        if (modalRoot) {
          const contentRoot = (await this.waitForSelector('.paypal-modal .paypal-content', 2000)) as HTMLElement | null || modalRoot;
          container = document.createElement('div');
          container.id = containerId;
          (container as HTMLElement).style.marginTop = '1rem';
          contentRoot.appendChild(container);
        }
      }

      if (!container) {
        this.paypalError = 'PayPal container was not found.';
        return;
      }

      container.innerHTML = '';
      this.renderPayPalButtons();
      this.paypalReady = true;
    } catch (error) {
      console.error('Failed to initialize PayPal:', error);
      this.paypalError = 'Failed to load PayPal. Please try again.';
      this.paypalReady = false;
    }
  }

  // Utility: poll for a selector to appear in the DOM. Returns the element
  // or null if not found within the timeout (ms).
  private waitForSelector(selector: string, timeout = 2000): Promise<Element | null> {
    const interval = 50;
    const maxTries = Math.ceil(timeout / interval);
    let tries = 0;

    return new Promise((resolve) => {
      const check = () => {
        const el = document.querySelector(selector);
        if (el) {
          resolve(el);
          return;
        }
        tries++;
        if (tries >= maxTries) {
          resolve(null);
          return;
        }
        setTimeout(check, interval);
      };
      check();
    });
  }

  private loadPayPalScript(): Promise<void> {
    const targetCurrency = this.currencyCode || 'USD';
    const existingScript = document.getElementById('paypal-sdk-script');

    if (existingScript && this.loadedPayPalCurrency !== targetCurrency) {
      existingScript.remove();
      this.isPayPalScriptLoaded = false;
      (window as any).paypal = undefined;
    }

    if (this.isPayPalScriptLoaded && (window as any).paypal && this.loadedPayPalCurrency === targetCurrency) {
      this.isPayPalScriptLoaded = true;
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.id = 'paypal-sdk-script';
      script.src = `https://www.paypal.com/sdk/js?client-id=${environment.paypalClientId}&currency=${targetCurrency}`;
      script.async = true;
      script.onload = () => {
        this.isPayPalScriptLoaded = true;
        this.loadedPayPalCurrency = targetCurrency;
        resolve();
      };
      script.onerror = () => reject(new Error('PayPal SDK failed to load'));
      document.head.appendChild(script);
    });
  }

  private renderPayPalButtons() {
    paypal
      .Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'pill',
          label: 'paypal',
        },
        createOrder: async () => {
          const cartId = this.cartService.getCartId();
          if (!cartId) {
            throw new Error('Missing cart id for payment');
          }

          // The backend currently validates the amount against the *product*
          // subtotal only.  The basic site price is handled separately by the
          // server after the payment is captured, so including it here causes
          // a mismatch (e.g. product sum 804.50 + basic site 20.00 = 824.50).
          //
          // To satisfy the API we therefore send just the products total in
          // `clientAmount` and provide the basic site's id for later linkage.
          // If the server changes to expect the full total later, this code
          // can be updated accordingly.
          const productTotal = this.cartItems.reduce((s, i) => s + i.price, 0);
          const payload = {
            cartId,
            clientAmount: productTotal.toFixed(2),
            currency: this.currencyCode,
            productIds: this.cartItems.map((item) => item.productId),
            basicSiteId: this.basicSite?.basicSiteId ?? null,
          };

          const response = await firstValueFrom(this.paymentService.createOrder(payload));
          return response.id;
        },
        onApprove: async (data: any) => {
          const cartId = this.cartService.getCartId();
          if (!cartId) {
            this.paypalError = 'Cart not found while capturing payment.';
            return;
          }

          this.isProcessing = true;
          this.paypalError = null;

          try {
            await firstValueFrom(this.paymentService.captureOrder(data.orderID, cartId));

            // Snapshot prompt data BEFORE clearing the cart so we have the
            // information needed to build the confirmation email.
            const itemsSnapshot = [...this.cartItems];
            const siteSnapshot = this.basicSite;

            await this.cartService.afterOrderPlaced();

            // Send confirmation email in the background — don't block navigation.
            void this.sendOrderEmail(itemsSnapshot, siteSnapshot);

            this.paymentSuccess = true;
            setTimeout(() => {
              this.showPayPalModal = false;
              this.router.navigate(['/payment-success']);
            }, 1200);
          } catch (error) {
            console.error('Payment capture failed:', error);
            this.paypalError = 'Payment failed to complete. Please try again.';
          } finally {
            this.isProcessing = false;
          }
        },
        onError: (error: any) => {
          console.error('PayPal error:', error);
          this.paypalError = 'PayPal reported an error. Please try again.';
        },
        onCancel: () => {
          this.isProcessing = false;
        },
      })
      .render('#paypal-button-container');
  }

  cancelPayment() {
    this.showPayPalModal = false;
    this.isProcessing = false;
    this.paymentSuccess = false;
    this.paypalReady = false;
    this.paypalError = null;
    // Clean up any leftover PayPal button container so reopening the modal
    // creates a fresh container and avoids "container not found" errors.
    try {
      const el = document.getElementById('paypal-button-container');
      if (el && el.parentElement) {
        el.remove();
      }
    } catch {
      // ignore cleanup errors
    }
  }

  /**
   * Fetch the latest order details (to obtain generated prompts) and send
   * a "Thank you for purchasing" confirmation email to the customer.
   * Called after a successful PayPal capture — errors are swallowed so that
   * a broken email never interrupts the checkout flow.
   */
  private async sendOrderEmail(
    cartItems: CartItemModel[],
    basicSite: BasicSiteInfo | null,
  ): Promise<void> {
    try {
      const user = this.userService.getCurrentUser();
      if (!user?.email) {
        return;
      }

      // Fetch the customer's orders to find the one just placed, and load
      // its items so we can include the generated prompt text in the email.
      const orders = await firstValueFrom(this.orderService.getUserOrders(user.userId));
      if (!orders || orders.length === 0) {
        return;
      }

      const latestOrder = orders[orders.length - 1];
      const orderDetails = await firstValueFrom(
        this.orderService.getOrderDetails(latestOrder.orderId),
      );

      const promptItems = (orderDetails.items ?? []).map((item) => ({
        productName: item.productName ?? 'Product',
        platformName: item.platformName,
        prompt: item.prompt,
        price: item.price,
      }));

      // Fall back to cart item names if the order returned no items.
      const emailItems =
        promptItems.length > 0
          ? promptItems
          : cartItems.map((ci) => ({
              productName: ci.productName,
              platformName: ci.platformName,
              prompt: ci.userDescription || null,
              price: ci.price,
            }));

      await this.emailService.sendOrderConfirmation({
        customerEmail: user.email,
        customerName: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email,
        orderId: latestOrder.orderId,
        orderDate: latestOrder.orderDate ?? new Date().toLocaleDateString(),
        orderTotal: this.totalPrice,
        currencyCode: this.currencyCode,
        items: emailItems,
      });
    } catch (err) {
      // Log but never surface email errors to the customer.
      console.warn('Order confirmation email could not be sent:', err);
    }
  }

  async loadSubCategoryImages() {
    try {
      const response = await this.subCategoryService.getSubCategories();
      const items = response.items || [];
      this.subCategoryImages.clear();
      for (const category of items) {
        if (category.subCategoryName && category.imageUrl) {
          this.subCategoryImages.set(category.subCategoryName.trim().toLowerCase(), category.imageUrl);
        }
      }
    } catch {
      this.subCategoryImages.clear();
    }
  }

  getProductImage(item: CartItemModel): string {
    const key = (item.subCategoryName || '').trim().toLowerCase();
    const mapped = this.subCategoryImages.get(key);
    const raw = mapped || item.imageUrl || '';

    if (!raw) {
      return 'assets/placeholder.png';
    }

    if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('assets/')) {
      return raw;
    }

    const hostBase = environment.apiUrl.replace('/api', '');
    const normalized = raw.startsWith('/') ? raw : `/${raw}`;
    return `${hostBase}${normalized}`;
  }
}
