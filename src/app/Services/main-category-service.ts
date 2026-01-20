import { Injectable, inject} from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainCategoryModel } from '../Models/main-category-model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MainCategoryService {
    private http =inject(HttpClient)
    BASIC_URL:string = `${environment.apiUrl}/MainCategories`
  getMainCategory():Observable<HttpResponse<MainCategoryModel[]>>
  {
        return this.http.get<MainCategoryModel[]>(this.BASIC_URL,{observe:'response'})
  }
}
