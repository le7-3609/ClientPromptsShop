import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ProductModel } from '../../Models/product-model';
import { ProductService } from '../../Services/productService/product-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SubCategoryService } from '../../Services/subCategoryService/sub-category-service';
import { SubCategoryModel } from '../../Models/sub-category-model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-sub-category',
  standalone: true,
  imports: [CommonModule, FormsModule, DataViewModule, TagModule,
    ButtonModule, SelectButtonModule, SelectModule, RadioButtonModule, ToastModule],
  templateUrl: './sub-category.html',
  styleUrl: './sub-category.scss',
  providers: [MessageService]
})
export class SubCategory {
  mainCategoryName: string = 'Our Products';
  products: ProductModel[] = [];
  selectedProduct: ProductModel | null = null;
  currentSubCategory: SubCategoryModel | null = null;

  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private subCategoryService = inject(SubCategoryService);
  private messageService = inject(MessageService);

  addToCart() {
    if (this.selectedProduct) {
      this.messageService.add({ severity: 'success', summary: 'Product added to cart', detail: `The product ${this.selectedProduct.productName} has been added to the cart successfully!`, life: 1500 });
      console.log('Product added to cart:', this.selectedProduct);
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('SubId');
      if (id) {
        this.productService.getProductsBySubCategoryId(+id).then(data => {
          this.products = [...data]; 
          this.cdr.detectChanges(); 
          console.log(this.products)
        });
      }
    });
  }
}
