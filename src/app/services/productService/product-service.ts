import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductModel } from '../../models/product-model';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private BASIC_URL = `${environment.apiUrl}/products`;

async getProducts(position: number, skip: number, subCategoryIds?: number[]): Promise<any> {
    let params = new HttpParams()
        .set('position', position.toString())
        .set('skip', skip.toString());

    if (subCategoryIds && subCategoryIds.length > 0) {
        subCategoryIds.forEach(id => {
            params = params.append('subCategoryIds', id.toString());
        });
    }

    return firstValueFrom(this.http.get<any>(this.BASIC_URL, { params }));
}



  async getProductsById(productId: number): Promise<ProductModel> {
    return firstValueFrom(
      this.http.get<ProductModel>(`${this.BASIC_URL}/${productId}`)
    );
  }

  addProduct(product: any): Promise<any> {
    return firstValueFrom(this.http.post(this.BASIC_URL, product, { withCredentials: true }));
  }

  updateProduct(id: number, product: any): Promise<any> {
    return firstValueFrom(this.http.put(`${this.BASIC_URL}/${id}`, product, { withCredentials: true }));
  }

  deleteProduct(id: number): Promise<any> {
    return firstValueFrom(this.http.delete(`${this.BASIC_URL}/${id}`, { withCredentials: true }));
  }
}