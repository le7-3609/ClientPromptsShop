import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SubCategoryModel } from '../../Models/sub-category-model';
import { environment } from '../../../environments/environment.development';
import { HttpParams } from '@angular/common/http';

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
        this.http.get<SubCategoryModel>(`${this.BASIC_URL}/${21}`)
      );
    } catch (error) {
      console.error(`An error occurred while fetching sub-category number ${21}:`, error);
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
getSubCategoriesFiltered(position: number, skip: number, desc: string, mainCategoryIds: number[]) {
    // let params = new HttpParams()
    //     .set('position', position.toString())
    //     .set('skip', skip.toString())
    //     .set('desc', desc);

    let url = `${this.BASIC_URL}?position=${position}&skip=${skip}&desc=${desc}`;

    if (mainCategoryIds && mainCategoryIds.length > 0) {
        mainCategoryIds.forEach(id => {
            url += `&mainCategoryIds=${id}`;
        });
    }
    console.log('Sending URL:', url);
    return firstValueFrom(this.http.get<any>(url));
}
}