import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { SubCategoryModel } from '../../Models/sub-category-model';
import { environment } from '../../../environments/environment.development';
import { HttpParams } from '@angular/common/http';
import { ResponsePageModel } from '../../Models/response-page-model';

interface SubCategoryResponse {
  subCategories: SubCategoryModel[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class SubCategoryService {
  private readonly BASIC_URL = `${environment.apiUrl}/SubCategories`;

  private http = inject(HttpClient);

  async getSubCategoryById(id: number): Promise<SubCategoryModel> {
  try {
    return await firstValueFrom(
      this.http.get<SubCategoryModel>(`${this.BASIC_URL}/${id}`) // שימוש ב-id במקום 21
    );
  } catch (error) {
    console.error(`Error fetching sub-category ${id}:`, error);
    throw error;
  }
}

  async getSubCategories(): Promise<SubCategoryModel[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<SubCategoryResponse>(this.BASIC_URL)
      );

      return response.subCategories || [];
    } catch (error) {
      console.error('An error occurred while fetching sub-categories:', error);
      return [];
    }
  }
  getSubCategoriesFiltered(position: number, skip: number, mainCategoryIds: number[], desc?: string)
    : Observable<HttpResponse<ResponsePageModel<SubCategoryModel>>> {
    let params = new HttpParams()
      .set('position', position.toString())
      .set('skip', skip.toString())
    if (desc)
      params = params.set('desc', desc)
    if (mainCategoryIds && mainCategoryIds.length > 0) {
      mainCategoryIds.forEach(id => {
        params = params.append('mainCategoryIds', id.toString());
      });
    }
    console.log('Sending URL:', params);
    return this.http.get<ResponsePageModel<SubCategoryModel>>(this.BASIC_URL, { observe: 'response', params });
  }

  getCategoryByID(id: number): Observable<HttpResponse<SubCategoryModel>> {
    return this.http.get<SubCategoryModel>(`${this.BASIC_URL}/${id}`, { observe: 'response' })
  }
}