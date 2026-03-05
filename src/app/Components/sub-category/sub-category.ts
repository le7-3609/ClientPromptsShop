import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ProductModel } from '../../models/product-model';
import { ProductService } from '../../services/productService/product-service';
import { CartService } from '../../services/cartService/cart-service';
import { UserService } from '../../services/userService/user-service';
import { PlatformService, Platform } from '../../services/platformService/platform-service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { SubCategoryService } from '../../services/subCategoryService/sub-category-service';
import { SubCategoryModel } from '../../models/sub-category-model';
import { GeminiPromptModel } from '../../models/gemini-prompt-model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { EmptyProduct } from '../empty-product/empty-product';
import { EmptyCategory } from '../empty-category/empty-category';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CurrencyService } from '../../services/currencyService/currency-service';

@Component({
  selector: 'app-sub-category',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataViewModule,
    TagModule,
    ButtonModule,
    SelectButtonModule,
    SelectModule,
    CheckboxModule,
    ToastModule,
    PaginatorModule,
    EmptyProduct,
    EmptyCategory,
    SliderModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    CurrencyPipe,
  ],
  templateUrl: './sub-category.html',
  styleUrl: './sub-category.scss',
  providers: [MessageService]
})
export class SubCategory implements OnInit {
  products: ProductModel[] = [];
  chosenProducts: boolean[] = [];
  currentSubCategory: SubCategoryModel | null = null;
  selectedPlatform: any = null;
  platforms: any[] = [];
  searchTerm = '';
  priceBounds: [number, number] = [0, 1000];
  selectedPriceRange: [number, number] = [0, 1000];
  sortValue = 'default';
  sortOptions = [
    { label: 'Default', value: 'default' },
    { label: 'Price: Low to High', value: 'priceAsc' },
    { label: 'Price: High to Low', value: 'priceDesc' },
    { label: 'Name: A-Z', value: 'nameAsc' },
    { label: 'Name: Z-A', value: 'nameDesc' },
  ];

  // Empty subcategory / AI Design state
  isEmpty: boolean = false;
  emptyProductId: number | null = null;
  emptyProductPrice: number = 0;
  pendingGeminiPrompt: GeminiPromptModel | null = null;
  geminiPromptConsumed: boolean = false;
  emptyProductResetTick: number = 0;

  totalRecords: number = 0;
  rows: number = 10;
  currentSubId: number | null = null;
  loading: boolean = false;

  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private subCategoryService = inject(SubCategoryService);
  private messageService = inject(MessageService);
  private cartService = inject(CartService);
  private userService = inject(UserService);
  private platformService = inject(PlatformService);
  private currencyService = inject(CurrencyService);

  currencyCode = 'USD';
  currencyRate = 1;

  ngOnInit() {
    this.currencyService.selectedCurrency$.subscribe((currency) => {
      this.currencyCode = currency.code;
    });
    this.currencyService.rate$.subscribe((rate) => {
      this.currencyRate = rate;
    });

    this.loadPlatforms();
    this.route.paramMap.subscribe(params => {
      const id = params.get('SubId');
      if (id) {
        this.currentSubId = +id;
        this.subCategoryService.getCategoryByID(this.currentSubId).subscribe(res => {
          this.currentSubCategory = res.body;
          // Detect "Empty" subcategory — render AI Studio instead of product list
          this.isEmpty = (res.body?.subCategoryName ?? '').startsWith('Empty');
        });
        this.loadProducts(0, this.rows);
      }
    });
  }

  async loadPlatforms() {
    try {
      const platforms = await this.platformService.getPlatforms();
      this.platforms = platforms.map(p => ({
        label: p.platformName,
        value: p.platformId
      }));
    } catch (error) {
      console.error('Failed to load platforms:', error);
    }
  }

  async loadProducts(skip: number, rows: number) {
    if (!this.currentSubId) return;
    
    this.loading = true;
    try {
      // position = skip + rows (הגבול העליון)
      // skip = skip (ההתחלה)
      const response = await this.productService.getProducts(skip + rows, skip, [this.currentSubId]);
      this.products = response.items || response.products || [];
      this.chosenProducts = this.products.map(() => false);
      this.totalRecords = response.totalCount || 0;
      this.recalculatePriceRange();

      // Find the "Empty" product for AI Design flow
      const emptyProduct = this.products.find(
        (p: any) => (p.productName ?? p.ProductsName) === 'Empty'
      );
      if (emptyProduct) {
        this.emptyProductId = Number(emptyProduct.productId ?? (emptyProduct as any).ProductsID);
        this.emptyProductPrice = Number(emptyProduct.price ?? 0);
      }

      this.cdr.detectChanges();
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'There was an error', detail: 'Failed to load products' });
    } finally {
      this.loading = false;
    }
  }

  onPageChange(event: any) {
    this.loadProducts(event.first, event.rows);
    window.scrollTo(0, 0); 
  }

  private recalculatePriceRange() {
    const visibleProducts = this.products.filter((p) => (p.productName ?? '') !== 'Empty');
    if (!visibleProducts.length) {
      this.priceBounds = [0, 1000];
      this.selectedPriceRange = [0, 1000];
      return;
    }
    const prices = visibleProducts.map((p) => Number(p.price ?? 0));
    const minPrice = Math.floor(Math.min(...prices));
    const maxPrice = Math.ceil(Math.max(...prices));
    this.priceBounds = [minPrice, maxPrice || minPrice + 1];
    this.selectedPriceRange = [...this.priceBounds] as [number, number];
  }

  get filteredProducts(): ProductModel[] {
    const searchLower = this.searchTerm.trim().toLowerCase();
    const [minPrice, maxPrice] = this.selectedPriceRange;

    const filtered = this.products.filter((item) => {
      if ((item.productName ?? '') === 'Empty') {
        return false;
      }
      const nameMatch = (item.productName ?? '').toLowerCase().includes(searchLower);
      const price = Number(item.price ?? 0);
      return nameMatch && price >= minPrice && price <= maxPrice;
    });

    const sorted = [...filtered];
    switch (this.sortValue) {
      case 'priceAsc':
        sorted.sort((a, b) => Number(a.price ?? 0) - Number(b.price ?? 0));
        break;
      case 'priceDesc':
        sorted.sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0));
        break;
      case 'nameAsc':
        sorted.sort((a, b) => (a.productName ?? '').localeCompare(b.productName ?? ''));
        break;
      case 'nameDesc':
        sorted.sort((a, b) => (b.productName ?? '').localeCompare(a.productName ?? ''));
        break;
      default:
        break;
    }

    return sorted;
  }

  get hasPromptProduct(): boolean {
    return !!this.emptyProductId;
  }

  resetActive = false; // true briefly when user hits reset


  get hasPendingPrompt(): boolean {
    return !!this.pendingGeminiPrompt && !!this.emptyProductId;
  }

  get canShowAddButton(): boolean {
    return (this.chosenCount > 0 || this.hasPendingPrompt) && !!this.selectedPlatform?.value;
  }

  get chosenCount(): number {
    return this.chosenProducts.filter(Boolean).length;
  }

  isChosen(product: ProductModel): boolean {
    const index = this.products.findIndex((p) => p.productId === product.productId);
    return index >= 0 ? !!this.chosenProducts[index] : false;
  }

  setChosen(product: ProductModel, value: boolean) {
    const index = this.products.findIndex((p) => p.productId === product.productId);
    if (index >= 0) {
      this.chosenProducts[index] = value;
    }
  }

  /** toggle selection state when clicking the row */
  toggleChosen(product: ProductModel) {
    const currently = this.isChosen(product);
    this.setChosen(product, !currently);
  }

  /** Receives the Gemini prompt emitted by the EmptyProduct widget */
  handleGeminiPrompt(prompt: GeminiPromptModel | null) {
    this.pendingGeminiPrompt = prompt;
  }

  async addToCart() {
    const selectedProducts = this.products.filter((_, index) => this.chosenProducts[index]);
    const hasPrompt = this.hasPendingPrompt;
    if ((!selectedProducts.length && !hasPrompt) || !this.selectedPlatform?.value) return;

    const user = this.userService.getCurrentUser();
    const platformId = this.selectedPlatform.value;

    try {
      let addedCount = 0;

      if (selectedProducts.length) {
        for (const product of selectedProducts) {
          try {
            await this.cartService.addToCart(
              Number(product.productId),
              user?.userId || 0,
              platformId,
              ''
            );
            addedCount++;
          } catch (error: any) {
            if (error.code !== 'DUPLICATE' && error.status !== 409) {
              throw error;
            }
          }
        }

        if (addedCount > 0) {
          this.messageService.add({
            severity: 'success',
            summary: 'Added to Cart',
            detail: `${addedCount} product${addedCount > 1 ? 's were' : ' was'} added successfully!`,
            life: 1500,
          });
        }
      }

      // Add empty/AI product if a prompt exists (even if no normal items were selected)
      if (hasPrompt) {
        try {
          await this.cartService.addToCart(
            this.emptyProductId!,
            user?.userId || 0,
            platformId,
            '',
            this.pendingGeminiPrompt!.promptId
          );
          this.messageService.add({
            severity: 'success',
            summary: 'AI Design Added',
            detail: 'Your custom AI design was added to the cart!',
            life: 1500,
          });
          addedCount++;
        } catch (err: any) {
          if (err.code !== 'DUPLICATE' && err.status !== 409) {
            console.error('Failed to add AI product:', err);
          }
        } finally {
          this.geminiPromptConsumed = true;
          setTimeout(() => { this.geminiPromptConsumed = false; }, 0);
          this.emptyProductResetTick++;
          this.pendingGeminiPrompt = null;
        }
      }

      // reset selection state regardless
      this.chosenProducts = this.products.map(() => false);
      this.selectedPlatform = null;
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to add item to cart',
      });
    }
  }

  resetSelection() {
    this.chosenProducts = this.products.map(() => false);
    this.selectedPlatform = null;
    this.resetActive = true;
    // clear highlight after a short animation interval
    setTimeout(() => { this.resetActive = false; }, 2000);
  }
}