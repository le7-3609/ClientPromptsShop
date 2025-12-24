import { Injectable } from '@angular/core';
import { ProductModel } from '../Models/product-model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // נתוני דמה לבדיקת התצוגה והבחירה
  private mockData: ProductModel[] = [
    {
      ProductId: 101,
      SubCategoryId: 1,
      ProductName: 'מכונת אספרסו ביתית - דגם בסיסי',
      CategoryName: 'מכונות קפה',
      Price: 450
    },
    {
      ProductId: 102,
      SubCategoryId: 1,
      ProductName: 'מכונה אוטומטית DeLonghi',
      CategoryName: 'מכונות קפה',
      Price: 1200
    },
    {
      ProductId: 103,
      SubCategoryId: 1,
      ProductName: 'מכונת קפסולות קטנה',
      CategoryName: 'מכונות קפה',
      Price: 299
    },
    {
      ProductId: 104,
      SubCategoryId: 1,
      ProductName: 'מכונת קפה ידנית מקצועית',
      CategoryName: 'מכונות קפה',
      Price: 2100
    }
  ];

  async getProducts(): Promise<ProductModel[]> {
    // דימוי של זמן טעינה מהשרת (חצי שנייה)
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.mockData), 500);
    });
  }
}