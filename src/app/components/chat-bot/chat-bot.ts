import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ChatService } from '../../services/chatService/chat-service'
import { ChatMessageModel } from '../../models/chat-model'

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-bot.html',
  styleUrl: './chat-bot.scss',
})
export class ChatBot implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef

  isOpen = false
  messages: ChatMessageModel[] = []
  newMessage = ''
  isLoading = false
  private shouldAutoScroll = true

  private chatService = inject(ChatService)

  ngOnInit(): void {
    const savedMessages = this.chatService.loadSession()
    if (savedMessages.length > 0) {
      this.messages = savedMessages
    }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen

    if (this.isOpen && this.messages.length === 0) {
      const greeting: ChatMessageModel = {
        role: 'model',
        text: "Hi! I'm your Click-Site assistant 👋 How can I help you today?",
      }
      this.messages.push(greeting)
      this.chatService.saveSession(this.messages)
      this.shouldAutoScroll = true
    }

    if (this.isOpen) {
      this.shouldAutoScroll = true
    }
  }

  sendMessage(): void {
    const text = this.newMessage.trim()
    if (!text || this.isLoading) {
      return
    }

    this.messages.push({ role: 'user', text })
    this.newMessage = ''
    this.isLoading = true
    this.shouldAutoScroll = true

    const history = this.messages.slice(0, -1)

    this.chatService.sendMessage(history, text).subscribe({
      next: (response) => {
        this.messages.push({ role: 'model', text: response })
        this.chatService.saveSession(this.messages)
        this.isLoading = false
        this.shouldAutoScroll = true
      },
      error: () => {
        this.messages.push({ role: 'model', text: 'Sorry, something went wrong. Please try again.' })
        this.chatService.saveSession(this.messages)
        this.isLoading = false
        this.shouldAutoScroll = true
      },
    })
  }

  onMessagesScroll(): void {
    if (!this.messagesContainer) {
      return
    }

    const container = this.messagesContainer.nativeElement as HTMLElement
    const threshold = 24
    const distanceFromBottom = container.scrollHeight - (container.scrollTop + container.clientHeight)

    this.shouldAutoScroll = distanceFromBottom <= threshold
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      this.sendMessage()
    }
  }

  ngAfterViewChecked(): void {
    try {
      if (this.messagesContainer && this.shouldAutoScroll) {
        const container = this.messagesContainer.nativeElement as HTMLElement
        container.scrollTop = container.scrollHeight
      }
    } catch {}
  }
}
