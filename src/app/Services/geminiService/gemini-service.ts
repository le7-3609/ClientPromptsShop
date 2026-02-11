import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, switchMap } from 'rxjs';
import { geminiPromptModel } from '../../Models/gemini-prompt-model';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  http: HttpClient = inject(HttpClient)
  BASIC_URL: string = `${environment.apiUrl}/Gemini`

  addNewProduct(productId: number, userRequest: string): Observable<HttpResponse<geminiPromptModel>> {
    let params = new HttpParams()
      .set('productId', String(productId))
      .set('userRequest', userRequest)

    return this.http.get<geminiPromptModel>(`${this.BASIC_URL}/getUserProduct`, { params: params, observe: 'response' })

  }

  updateProductPrompt(promptId: number, userRequest: string): Observable<HttpResponse<geminiPromptModel>> {
    return this.http.put<void>(`${this.BASIC_URL}/${promptId}`, userRequest, { observe: 'response' })
      .pipe(switchMap(() => {
        return this.http.get<geminiPromptModel>(`${this.BASIC_URL}/${promptId}`, { observe: 'response' })
      }
      ))
  }
}
