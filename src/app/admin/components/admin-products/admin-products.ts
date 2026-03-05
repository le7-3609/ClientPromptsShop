import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProductModel } from '../../../models/product-model';
import { SubCategoryModel } from '../../../models/sub-category-model';
import { ProductService } from '../../../services/productService/product-service';
import { SubCategoryService } from '../../../services/subCategoryService/sub-category-service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  templateUrl: './admin-products.html',
  styleUrls: ['./admin-products.scss'],
  providers: [MessageService],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    ToastModule,
    Select
  ]
})
export class AdminProducts implements OnInit {
  allProducts: ProductModel[] = [];
  selectedProduct: any = {};
  subCategories: SubCategoryModel[] = [];
  productSearchTerm: string = '';

  productDialog: boolean = false;
  submitted: boolean = false;
  loading: boolean = false;

  constructor(
    private productService: ProductService,
    private subCategoryService: SubCategoryService,
    private messageService: MessageService
  ) { }

  async ngOnInit() {
    await Promise.all([this.loadData(), this.loadSubCategories()]);
  }

  async loadSubCategories() {
    try {
      const response = await this.subCategoryService.getSubCategories();
      this.subCategories = response.items || [];
    } catch (error) {
      console.error('Error loading subcategories:', error);
    }
  }

  async loadData() {
    this.loading = true;
    try {
      const response = await this.productService.getProducts(10000, 0);
      if (response) {
        this.allProducts = response.items || [];
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Technical Error',
        detail: 'Failed to load products'
      });
    } finally {
      this.loading = false;
    }
  }

  get filteredProducts(): ProductModel[] {
    const term = this.productSearchTerm.trim().toLowerCase();
    if (!term) return this.allProducts;
    return this.allProducts.filter(p => (p.productName || '').toLowerCase().includes(term));
  }

  openNew() {
    this.selectedProduct = { productName: '', price: 0, subCategoryId: null };
    this.submitted = false;
    this.productDialog = true;
  }

  editProduct(product: ProductModel) {
    this.selectedProduct = { ...product };
    this.productDialog = true;
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  async saveProduct() {
    this.submitted = true;

    if (this.selectedProduct.productName?.trim() && this.selectedProduct.subCategoryId) {
      try {
        if (this.selectedProduct.productId) {
          await this.productService.updateProduct(this.selectedProduct.productId, this.selectedProduct);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated' });
        } else {
          await this.productService.addProduct(this.selectedProduct);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created' });
        }

        this.productDialog = false;
        this.loadData();
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Save failed' });
      }
    }
  }

  async deleteProduct(product: ProductModel) {
    if (confirm(`Delete ${product.productName}?`)) {
      try {
        await this.productService.deleteProduct(Number(product.productId));
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product Deleted' });
        await this.loadData();
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Delete failed' });
      }
    }
  }

}