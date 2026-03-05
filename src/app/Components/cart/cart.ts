import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Router, RouterLink } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CartService } from '../../services/cartService/cart-service';
import { UserService } from '../../services/userService/user-service';
import { PlatformService, Platform } from '../../services/platformService/platform-service';
import { SubCategoryService } from '../../services/subCategoryService/sub-category-service';
import { GeminiService } from '../../services/geminiService/gemini-service';
import { CartItemModel, BasicSiteInfo } from '../../models/cart-model';
import { UserProfileModel } from '../../models/user-model';
import { firstValueFrom } from 'rxjs';
import { CurrencyService } from '../../services/currencyService/currency-service';

interface PromptEditState { editing: boolean; editText: string; saving: boolean; }

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    RouterLink,
    ToastModule,
    RippleModule,
    CardModule,
    ConfirmDialogModule,
    CurrencyPipe,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit {
  cartItems: CartItemModel[] = [];
  platforms: Platform[] = [];
  basicSite: BasicSiteInfo | null = null;
  subCategoryImages: Map<string, string> = new Map();
  /** Cache of full prompt texts keyed by cartItemId */
  promptTexts: Map<number, string> = new Map();
  promptEditStates: Map<number, PromptEditState> = new Map();
  private cartService = inject(CartService);
  private userService = inject(UserService);
  private platformService = inject(PlatformService);
  private subCategoryService = inject(SubCategoryService);
  private geminiService = inject(GeminiService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);
  private currencyService = inject(CurrencyService);

  user: UserProfileModel | null = null;
  error: string = '';
  noItems: string = '';
  totalPrice: number = 0;
  currencyCode = 'USD';
  currencyRate = 1;

  ngOnInit() {
    this.currencyService.selectedCurrency$.subscribe((currency) => {
      this.currencyCode = currency.code;
    });
    this.currencyService.rate$.subscribe((rate) => {
      this.currencyRate = rate;
    });

    this.user = this.userService.getCurrentUser();
    this.loadCart();
    this.loadPlatforms();

    // Ensure server cart is loaded for logged-in users (handles page refresh)
    if (this.user) {
      this.cartService.ensureCartLoaded(this.user.userId);
    }
  }

  async loadPlatforms() {
    try {
      this.platforms = await this.platformService.getPlatforms();
    } catch (error) {
      console.error('Failed to load platforms:', error);
    }
  }

  async loadCart() {
    try {
      this.cartService.cartItems$.subscribe({
        next: async (items) => {
          if (items && items.length > 0) {
            this.cartItems = items;
            await this.loadSubCategoryImages();
            await this.loadPromptTexts();
            this.noItems = '';
          } else {
            this.cartItems = [];
          }
          this.calculateTotal();
        },
        error: (err) => {
          this.error = 'An error occurred while trying to load the cart. Please try again later';
          this.showError();
        },
      });

      this.cartService.basicSite$.subscribe({
        next: (site) => {
          this.basicSite = site;
          this.calculateTotal();
        },
      });
    } catch (error) {
      this.error = 'An error occurred while trying to load the cart. Please try again later';
      this.showError();
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
    } catch (error) {
      console.error('Failed to load subcategory images:', error);
    }
  }

  /** Fetches full Gemini prompt text for AI-designed cart items */
  async loadPromptTexts() {
    for (const item of this.cartItems) {
      if (this.isPromptRef(item.userDescription)) {
        const promptId = Number(item.userDescription);
        if (!this.promptTexts.has(item.cartItemId)) {
          try {
            const promptModel = await firstValueFrom(this.geminiService.getPromptById(promptId));
            this.promptTexts.set(item.cartItemId, promptModel.prompt ?? 'AI-generated design');
          } catch {
            this.promptTexts.set(item.cartItemId, 'AI-generated design');
          }
        }
      }
    }
  }

  /** Returns true when userDescription is a numeric string (i.e. a Gemini promptId) */
  isPromptRef(desc: string): boolean {
    if (!desc) return false;
    const trimmed = desc.trim();
    return trimmed !== '' && !isNaN(Number(trimmed)) && Number(trimmed) > 0;
  }

  getPromptFull(item: CartItemModel): string {
    return this.promptTexts.get(item.cartItemId) ?? 'AI-generated design';
  }

  getPromptExcerpt(item: CartItemModel): string {
    const full = this.getPromptFull(item);
    return full.length > 140 ? full.slice(0, 140) + '…' : full;
  }

  // ── Inline prompt editing ────────────────────────────────────

  isEditing(item: CartItemModel): boolean {
    return this.promptEditStates.get(item.cartItemId)?.editing ?? false;
  }

  getEditState(cartItemId: number): PromptEditState {
    if (!this.promptEditStates.has(cartItemId)) {
      this.promptEditStates.set(cartItemId, { editing: false, editText: '', saving: false });
    }
    return this.promptEditStates.get(cartItemId)!;
  }

  startEditPrompt(item: CartItemModel): void {
    this.promptEditStates.set(item.cartItemId, {
      editing: true,
      editText: this.getPromptFull(item),
      saving: false,
    });
  }

  async saveEditPrompt(item: CartItemModel): Promise<void> {
    const state = this.promptEditStates.get(item.cartItemId);
    if (!state || !state.editText.trim() || !this.isPromptRef(item.userDescription)) return;
    state.saving = true;
    const promptId = Number(item.userDescription);
    try {
      const updated = await firstValueFrom(this.geminiService.updateProductPrompt(promptId, state.editText.trim()));
      this.promptTexts.set(item.cartItemId, updated.prompt ?? state.editText.trim());
      state.editing = false;
      state.saving = false;
      this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Prompt updated.', life: 2500 });
    } catch {
      state.saving = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not save prompt. Please try again.', life: 3000 });
    }
  }

  cancelEditPrompt(cartItemId: number): void {
    const state = this.promptEditStates.get(cartItemId);
    if (state) { state.editing = false; }
  }

  getProductImage(item: CartItemModel): string {
    const key = (item.subCategoryName || '').trim().toLowerCase();
    return this.subCategoryImages.get(key) || item.imageUrl || 'assets/placeholder.png';
  }

  calculateTotal() {
    const productsTotal = this.cartItems
      .filter((item) => item.isActive)
      .reduce((sum, item) => sum + item.price, 0);
    const sitePrice = this.basicSite?.price || 0;
    this.totalPrice = productsTotal + sitePrice;
  }

  getProductsTotal(): number {
    return this.cartItems
      .filter((item) => item.isActive)
      .reduce((sum, item) => sum + item.price, 0);
  }

  get hasContent(): boolean {
    return this.cartItems.length > 0 || this.basicSite !== null;
  }

  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: this.error,
    });
  }

  async toggleItemActive(item: CartItemModel) {
    const previousIsActive = item.isActive;
    const newIsActive = !previousIsActive;

    item.isActive = newIsActive;
    this.calculateTotal();

    try {
      let cartId = this.cartService.getCartId() ?? item.cartId ?? null;

      if (!cartId && this.user?.userId) {
        await this.cartService.ensureCartLoaded(this.user.userId);
        cartId = this.cartService.getCartId() ?? item.cartId ?? null;
      }

      await this.cartService.toggleItemActive(item.cartItemId, newIsActive, cartId || 0);
    } catch (error) {
      item.isActive = previousIsActive;
      this.calculateTotal();
      this.messageService.add({
        severity: 'error',
        summary: 'Update Failed',
        detail: 'Could not update item selection. Please try again.',
      });
    }
  }

  async removeProduct(cartItemId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this item?',
      header: 'Confirm Removal',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes, Remove',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-secondary',
      rejectButtonStyleClass: 'p-button-help',

      accept: async () => {
        const cartId = this.cartService.getCartId();
        await this.cartService.removeCartItem(cartItemId, cartId || 0);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Item removed from cart',
          life: 3000,
        });
      },
    });
  }

  async onPlatformChange(item: CartItemModel, platformName: string) {
    const platform = this.platforms.find((p) => p.platformName === platformName);
    if (platform) {
      const cartId = this.cartService.getCartId();
      await this.cartService.updatePlatform(item.cartItemId, platform.platformId, cartId || 0);
    }
  }

  editBasicSite() {
    this.router.navigate(['/basicSite']);
  }

  goToPayment() {
    const user = this.userService.getCurrentUser();
    if (!user) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Login Required',
        detail: 'Please login to complete your purchase',
      });
      this.router.navigate(['/auth'], { queryParams: { returnUrl: '/cart' } });
      return;
    }

    // Must have exactly one basic site to proceed
    if (!this.basicSite) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Basic Site Required',
        detail: 'Please create a Basic Site before completing your purchase',
      });
      return;
    }

    this.router.navigate(['/checkout']);
  }
}
