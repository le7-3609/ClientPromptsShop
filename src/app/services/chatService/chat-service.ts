import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../../environments/environment.development'
import { ChatMessageModel, ChatRequestModel } from '../../models/chat-model'

const SESSION_KEY = 'chat_session'

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private http = inject(HttpClient)
  private BASIC_URL = `${environment.apiUrl}/Chat`

  sendMessage(history: ChatMessageModel[], newMessage: string): Observable<string> {
    const request: ChatRequestModel = {
      history,
      newMessage,
    }

    return this.http.post<string>(this.BASIC_URL, request, { responseType: 'text' as 'json' })
  }

  loadSession(): ChatMessageModel[] {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY)
      return raw ? (JSON.parse(raw) as ChatMessageModel[]) : []
    } catch {
      return []
    }
  }

  saveSession(messages: ChatMessageModel[]): void {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages))
    } catch {}
  }

  clearSession(): void {
    sessionStorage.removeItem(SESSION_KEY)
  }
}
