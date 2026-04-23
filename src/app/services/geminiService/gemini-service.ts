import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { GeminiInputModel, GeminiPromptModel } from '../../models/gemini-prompt-model';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  http: HttpClient = inject(HttpClient)
  BASIC_URL: string = `${environment.apiUrl}/Gemini`

  createProductPrompt(subCategoryId: number | null, userRequest: string): Observable<GeminiPromptModel> {
    const payload: GeminiInputModel = {
      subCategoryId,
      userRequest,
    }

    return this.http.post<GeminiPromptModel>(`${this.BASIC_URL}/userProduct`, payload)
  }

  createCategoryPrompt(subCategoryId: number, userRequest: string): Observable<GeminiPromptModel> {
    const payload: GeminiInputModel = {
      subCategoryId,
      userRequest,
    }

    return this.http.post<GeminiPromptModel>(`${this.BASIC_URL}/subCategory`, payload)
  }

  createBasicSitePrompt(userRequest: string): Observable<GeminiPromptModel> {
    return this.http.post<GeminiPromptModel>(`${this.BASIC_URL}/basicSite`, { userRequest })
  }

  getPromptById(promptId: number): Observable<GeminiPromptModel> {
    return this.http.get<GeminiPromptModel>(`${this.BASIC_URL}/${promptId}`)
  }

  updateProductPrompt(promptId: number, userRequest: string): Observable<GeminiPromptModel> {
    return this.http.put<GeminiPromptModel>(`${environment.apiUrl}/userProduct/${promptId}`, { userRequest })
  }

  updateCategoryPrompt(promptId: number, userRequest: string): Observable<GeminiPromptModel> {
    return this.http.put<GeminiPromptModel>(`${environment.apiUrl}/suCategory/${promptId}`, { userRequest })
  }

  updateBasicSitePrompt(promptId: number, userRequest: string): Observable<GeminiPromptModel> {
    return this.http.put<GeminiPromptModel>(`${environment.apiUrl}/basicSite/${promptId}`, { userRequest })
  }

  deletePrompt(promptId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASIC_URL}/${promptId}`)
  }

  addNewProduct(subCategoryId: number, userRequest: string): Observable<GeminiPromptModel> {
    return this.createProductPrompt(subCategoryId, userRequest)
  }
}
