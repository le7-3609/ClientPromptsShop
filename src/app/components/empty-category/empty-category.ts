import { Component, inject, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { GeminiPromptModel } from '../../models/gemini-prompt-model';
import { GeminiService } from '../../services/geminiService/gemini-service';
import { CartService } from '../../services/cartService/cart-service';
import { UserService } from '../../services/userService/user-service';
import { ProductService } from '../../services/productService/product-service';
import { PlatformService } from '../../services/platformService/platform-service';
import { Router } from '@angular/router';

/**
 * Two-phase prompt generation for "Empty" subcategories:
 *
 * Phase 1 — Category prompt  (POST /subCategory)
 *   User describes the category customization → Gemini generates a category-level prompt
 *   User can review/edit, then proceed to phase 2.
 *
 * Phase 2 — Product prompt   (POST /userProduct)
 *   User describes the specific product → Gemini generates a product-level prompt
 *   The productPrompt.promptId is what gets stored in the cart item.
 *
 * On ngOnDestroy: both prompts are deleted if the item was never added to cart.
 */
type Phase =
  | 'cat-input'     // waiting for category description
  | 'cat-gen'       // calling Gemini for category
  | 'cat-done'      // category prompt ready, user reviews
  | 'prod-input'    // waiting for product description
  | 'prod-gen'      // calling Gemini for product
  | 'prod-done'     // product prompt ready — can add to cart
  | 'adding';       // waiting for cart response

@Component({
  selector: 'app-empty-category',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonModule, SelectModule, ToastModule],
  providers: [MessageService],
  templateUrl: './empty-category.html',
  styleUrl: './empty-category.scss',
})
export class EmptyCategory implements OnDestroy {
  phase: Phase = 'cat-input';
  subCategoryId!: number;

  // Phase 1
  categoryInput = '';
  categoryPrompt: GeminiPromptModel | null = null;
  editableCategoryText = '';

  // Phase 2
  productInput = '';
  productPrompt: GeminiPromptModel | null = null;
  editableProductText = '';

  emptyProductId: number | null = null;
  emptyProductPrice: number = 0;
  selectedPlatform: any = null;
  platforms: any[] = [];
  addedToCart = false;

  private geminiService = inject(GeminiService);
  private cartService = inject(CartService);
  private userService = inject(UserService);
  private productService = inject(ProductService);
  private platformService = inject(PlatformService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  @Input() set categoryId(value: number) {
    this.subCategoryId = value;
    this.loadEmptyProductId();
    this.loadPlatforms();
  }

  get user() { return this.userService.getCurrentUser(); }

  // ── loaders ─────────────────────────────────────────────────

  private async loadEmptyProductId() {
    if (!this.subCategoryId) return;
    try {
      const response = await this.productService.getProducts(1000, 0, [this.subCategoryId]);
      const products = response.items || response.products || [];
      const ep = products.find((p: any) => (p.productName ?? p.ProductsName) === 'Empty');
      if (ep) {
        this.emptyProductId = Number(ep.productId ?? ep.ProductsID);
        this.emptyProductPrice = Number(ep.price ?? 0);
      }
    } catch (e) { console.error('Failed to find Empty product:', e); }
  }

  private async loadPlatforms() {
    try {
      const platforms = await this.platformService.getPlatforms();
      this.platforms = platforms.map(p => ({ label: p.platformName, value: p.platformId }));
    } catch {}
  }

  // ── Phase 1: Category prompt ─────────────────────────────────

  generateCategoryPrompt() {
    if (!this.user) { this.router.navigate(['/auth']); return; }
    const input = this.categoryInput.trim();
    if (!input) return;
    this.phase = 'cat-gen';

    const call = this.categoryPrompt
      ? this.geminiService.updateCategoryPrompt(this.categoryPrompt.promptId, input)
      : this.geminiService.createCategoryPrompt(this.subCategoryId, input);

    call.subscribe({
      next: (data) => {
        this.categoryPrompt = data;
        this.editableCategoryText = data.prompt;
        this.phase = 'cat-done';
      },
      error: () => {
        this.phase = 'cat-input';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate category prompt. Please try again.', life: 3000 });
      },
    });
  }

  regenerateCategoryPrompt() {
    if (!this.categoryPrompt) return;
    this.phase = 'cat-gen';
    this.geminiService.updateCategoryPrompt(this.categoryPrompt.promptId, this.editableCategoryText).subscribe({
      next: (data) => {
        this.categoryPrompt = data;
        this.editableCategoryText = data.prompt;
        this.phase = 'cat-done';
      },
      error: () => {
        this.phase = 'cat-done';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to regenerate. Please try again.', life: 3000 });
      },
    });
  }

  proceedToProductStep() {
    this.phase = 'prod-input';
  }

  // ── Phase 2: Product prompt ──────────────────────────────────

  generateProductPrompt() {
    if (!this.user) { this.router.navigate(['/auth']); return; }
    const input = this.productInput.trim();
    if (!input) return;
    this.phase = 'prod-gen';

    const call = this.productPrompt
      ? this.geminiService.updateProductPrompt(this.productPrompt.promptId, input)
      : this.geminiService.createProductPrompt(this.subCategoryId, input);

    call.subscribe({
      next: (data) => {
        this.productPrompt = data;
        this.editableProductText = data.prompt;
        this.phase = 'prod-done';
      },
      error: () => {
        this.phase = 'prod-input';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate product prompt. Please try again.', life: 3000 });
      },
    });
  }

  regenerateProductPrompt() {
    if (!this.productPrompt) return;
    this.phase = 'prod-gen';
    this.geminiService.updateProductPrompt(this.productPrompt.promptId, this.editableProductText).subscribe({
      next: (data) => {
        this.productPrompt = data;
        this.editableProductText = data.prompt;
        this.phase = 'prod-done';
      },
      error: () => {
        this.phase = 'prod-done';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to regenerate. Please try again.', life: 3000 });
      },
    });
  }

  backToCategoryStep() {
    this.phase = 'cat-done';
  }

  // ── Cart ─────────────────────────────────────────────────────

  async addToCart() {
    if (!this.productPrompt || !this.emptyProductId || !this.user) return;
    this.phase = 'adding';
    try {
      await this.cartService.addToCart(
        this.emptyProductId,
        this.user.userId,
        this.selectedPlatform?.value || 1,
        '',
        this.productPrompt.promptId
      );
      this.addedToCart = true;
      this.messageService.add({ severity: 'success', summary: 'Added to Cart', detail: 'Your AI-generated design was added to the cart!', life: 2500 });
      this.resetAll();
    } catch (error: any) {
      if (error.code === 'DUPLICATE' || error.status === 409) {
        this.messageService.add({ severity: 'warn', summary: 'Already in Cart', detail: 'This product is already in your cart.', life: 3000 });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add to cart. Please try again.', life: 3000 });
      }
      this.phase = 'prod-done';
    }
  }

  deleteAllAndReset() {
    const deleteCategory = () => {
      if (this.categoryPrompt) {
        this.geminiService.deletePrompt(this.categoryPrompt.promptId).subscribe();
        this.categoryPrompt = null;
      }
    };
    if (this.productPrompt) {
      this.geminiService.deletePrompt(this.productPrompt.promptId).subscribe({
        next: deleteCategory, error: deleteCategory,
      });
      this.productPrompt = null;
    } else {
      deleteCategory();
    }
    this.resetAll();
  }

  private resetAll() {
    this.phase = 'cat-input';
    this.categoryInput = '';
    this.productInput = '';
    this.editableCategoryText = '';
    this.editableProductText = '';
    this.selectedPlatform = null;
    // Keep prompts null so they get cleaned up (set by callers)
  }

  ngOnDestroy() {
    if (!this.addedToCart) {
      if (this.productPrompt) this.geminiService.deletePrompt(this.productPrompt.promptId).subscribe();
      if (this.categoryPrompt) this.geminiService.deletePrompt(this.categoryPrompt.promptId).subscribe();
    }
  }
}
