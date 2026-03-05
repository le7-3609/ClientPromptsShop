import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cartService/cart-service';
import { CartItemModel, BasicSiteInfo } from '../../models/cart-model';
import { CurrencyService } from '../../services/currencyService/currency-service';
import { SubCategoryService } from '../../services/subCategoryService/sub-category-service';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterLink, CurrencyPipe],
  templateUrl: './cart-sidebar.html',
  styleUrl: './cart-sidebar.scss',
})
export class CartSidebar implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);
  private currencyService = inject(CurrencyService);
  private subCategoryService = inject(SubCategoryService);

  cartItems: CartItemModel[] = [];
  basicSite: BasicSiteInfo | null = null;
  isVisible = false;
  totalPrice = 0;
  currencyCode = 'USD';
  currencyRate = 1;

  // images keyed by lower‑cased subcategory name
  subCategoryImages: Map<string,string> = new Map();

  ngOnInit() {
    this.currencyService.selectedCurrency$.subscribe((currency) => {
      this.currencyCode = currency.code;
    });
    this.currencyService.rate$.subscribe((rate) => {
      this.currencyRate = rate;
    });

    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items || [];
      this.calculateTotal();
    });

    this.cartService.basicSite$.subscribe((site) => {
      this.basicSite = site;
      this.calculateTotal();
    });

    this.cartService.isVisible$.subscribe((visible) => {
      this.isVisible = visible;
    });

    // preload subcategory image map once
    this.loadSubCategoryImages();
  }

  calculateTotal() {
    const productsTotal = this.cartItems
      .filter((item) => item.isActive)
      .reduce((sum, item) => sum + item.price, 0);
    const sitePrice = this.basicSite?.price || 0;
    this.totalPrice = productsTotal + sitePrice;
  }

  get itemCount(): number {
    return this.cartItems.length + (this.basicSite ? 1 : 0);
  }

  closeSidebar() {
    this.cartService.closeSidebar();
  }

  removeItem(cartItemId: number) {
    const cartId = this.cartService.getCartId();
    this.cartService.removeCartItem(cartItemId, cartId || 0);
  }

  // mirror cart component logic
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
    } catch (error) {
      console.error('Failed to load subcategory images (sidebar):', error);
    }
  }

  getProductImage(item: CartItemModel): string {
    const key = (item.subCategoryName || '').trim().toLowerCase();
    return this.subCategoryImages.get(key) || item.imageUrl || 'assets/placeholder.png';
  }

  editBasicSite() {
    this.closeSidebar();
    this.router.navigate(['/basicSite']);
  }

  /** Returns true when userDescription is a numeric string (a Gemini promptId) */
  isPromptRef(desc: string): boolean {
    if (!desc) return false;
    const trimmed = desc.trim();
    return trimmed !== '' && !isNaN(Number(trimmed)) && Number(trimmed) > 0;
  }
}
