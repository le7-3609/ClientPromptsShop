import { Injectable } from '@angular/core';
import { SubCategoryModel } from '../Models/sub-category-model';

@Injectable({
  providedIn: 'root',
})
export class SubCategoryService {

  // נתונים זמניים לבדיקה - עד שתחברי ל-API
  private mockData: SubCategoryModel[] = [
    {
      SubCategoryId: 1,
      MainCategoryId: 10,
      SubCategoryName: 'מכונות קפה אספרסו',
      SubCategoryDescription: 'מכונות מקצועיות לבית ולמשרד',
      ImageUrl: 'https://primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg'
    },
    {
      SubCategoryId: 2,
      MainCategoryId: 10,
      SubCategoryName: 'מקציפי חלב',
      SubCategoryDescription: 'כל סוגי המקציפים החשמליים',
      ImageUrl: 'https://primefaces.org/cdn/primeng/images/demo/product/black-watch.jpg'
    },
     {
      SubCategoryId: 2,
      MainCategoryId: 10,
      SubCategoryName: 'מקציפי חלב',
      SubCategoryDescription: 'כל סוגי המקציפים החשמליים',
      ImageUrl: 'https://primefaces.org/cdn/primeng/images/demo/product/black-watch.jpg'
    },
     {
      SubCategoryId: 2,
      MainCategoryId: 10,
      SubCategoryName: 'מקציפי חלב',
      SubCategoryDescription: 'כל סוגי המקציפים החשמליים',
      ImageUrl: 'https://primefaces.org/cdn/primeng/images/demo/product/black-watch.jpg'
    },
     {
      SubCategoryId: 2,
      MainCategoryId: 10,
      SubCategoryName: 'מקציפי חלב',
      SubCategoryDescription: 'כל סוגי המקציפים החשמליים',
      ImageUrl: 'https://primefaces.org/cdn/primeng/images/demo/product/black-watch.jpg'
    }
  ];

  async getSubCategories(): Promise<SubCategoryModel[]> {
    // בבוא העת, כאן תבוא קריאת ה-HttpClient:
    ///return firstValueFrom(this.http.get<SubCategoryModel[]>(URL));
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.mockData), 500); // סימולציה של טעינה
    });
  }
}