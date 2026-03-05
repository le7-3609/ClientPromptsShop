import { Component, EventEmitter, inject, Input, OnDestroy, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { GeminiPromptModel } from '../../models/gemini-prompt-model';
import { GeminiService } from '../../services/geminiService/gemini-service';
import { UserService } from '../../services/userService/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empty-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './empty-product.html',
  styleUrl: './empty-product.scss',
})
export class EmptyProduct implements OnDestroy {
  @Output() geminiPrompt = new EventEmitter<GeminiPromptModel | null>();

  categoryId!: number;
  price: number = 0;
  promptWasConsumed = false;

  // State machine
  flag = false;          // false = input form, true = loading/result
  generating = false;    // true while waiting for Gemini
  prompt: GeminiPromptModel | null = null;
  editablePrompt = '';
  userInput = '';

  private geminiService = inject(GeminiService);
  private userService = inject(UserService);
  private router = inject(Router);

  @Input() set id(value: number) {
    this.categoryId = value;
  }

  @Input() set priceInput(value: number) {
    this.price = value;
  }

  /** Parent signals that the prompt was consumed by a cart add — skip auto-delete */
  @Input() set promptConsumed(value: boolean) {
    if (value) {
      this.promptWasConsumed = true;
    }
  }

  /** Parent signals reset (after "Add to Cart" clears selection) */
  @Input() set reset(value: number) {
    if (value > 0) {
      this.resetToInit();
    }
  }

  generate() {
    const user = this.userService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/auth']);
      return;
    }
    const input = this.userInput.trim();
    if (!input) return;

    this.flag = true;
    this.generating = true;
    this.prompt = null;

    this.geminiService.createProductPrompt(this.categoryId, input).subscribe({
      next: (data) => {
        this.prompt = data;
        this.editablePrompt = data.prompt;
        this.generating = false;
        this.geminiPrompt.emit(data);
      },
      error: () => {
        this.flag = false;
        this.generating = false;
      },
    });
  }

  update() {
    if (!this.prompt || !this.editablePrompt.trim()) return;
    this.generating = true;
    this.geminiService.updateProductPrompt(this.prompt.promptId, this.editablePrompt).subscribe({
      next: (data) => {
        this.prompt = data;
        this.editablePrompt = data.prompt;
        this.generating = false;
        this.geminiPrompt.emit(data);
      },
      error: () => { this.generating = false; },
    });
  }

  deletePrompt() {
    if (!this.prompt) return;
    this.geminiService.deletePrompt(this.prompt.promptId).subscribe({
      next: () => {
        this.prompt = null;
        this.editablePrompt = '';
        this.flag = false;
        this.userInput = '';
        this.generating = false;
        this.geminiPrompt.emit(null);
      },
    });
  }

  /** Go back to input without deleting the server record */
  backToInput() {
    this.flag = false;
    this.generating = false;
    // Keep prompt and editablePrompt so re-opening shows previous result
  }

  /** Called by parent after prompt was added to cart — resets UI without deleting server record */
  resetToInit() {
    this.promptWasConsumed = true;
    this.flag = false;
    this.prompt = null;
    this.editablePrompt = '';
    this.userInput = '';
    this.generating = false;
  }

  ngOnDestroy() {
    // Auto-cleanup: if a prompt was generated but never used in cart, delete it
    if (this.prompt && !this.promptWasConsumed) {
      this.geminiService.deletePrompt(this.prompt.promptId).subscribe();
    }
  }
}
