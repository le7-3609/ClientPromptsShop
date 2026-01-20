import { Injectable } from '@angular/core';
import { ProductModel } from '../Models/product-model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // נתוני דמה לבדיקת התצוגה והבחירה
  private mockData: ProductModel[] = [
    {
      productId: 101,
      subCategoryId: 1,
      productName: 'מכונת אספרסו ביתית - דגם בסיסי',
      categoryName: 'מכונות קפה',
      price: 450
    },
    {
      productId: 102,
      subCategoryId: 1,
      productName: 'מכונה אוטומטית DeLonghi',
      categoryName: 'מכונות קפה',
      price: 1200
    },
    {
      productId: 103,
      subCategoryId: 1,
      productName: 'מכונת קפסולות קטנה',
      categoryName: 'מכונות קפה',
      price: 299
    },
    {
      productId: 104,
      subCategoryId: 1,
      productName: 'מכונת קפה ידנית מקצועית',
      categoryName: 'מכונות קפה',
      price: 2100
    }
  ];

  async getProducts(): Promise<ProductModel[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.mockData), 500);
    });
  }
}