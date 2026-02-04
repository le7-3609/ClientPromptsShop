import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductModel } from '../../Models/product-model';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private BASIC_URL = `${environment.apiUrl}/products`;

  async getProducts(): Promise<ProductModel[]> {
    return firstValueFrom(this.http.get<ProductModel[]>(this.BASIC_URL));
  }

  async getProductsBySubCategoryId(categoryId: number): Promise<ProductModel[]> {
    const options = {
      params: new HttpParams().set('categoryId', categoryId)
    };

    return firstValueFrom(
      this.http.get<ProductModel[]>(`${this.BASIC_URL}`, options)
    );
  }
}