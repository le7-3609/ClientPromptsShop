import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { geminiPromptModel } from '../../Models/gemini-prompt-model';
import { GeminiService } from '../../Services/geminiService/gemini-service';

@Component({
  selector: 'app-empty-product',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './empty-product.html',
  styleUrl: './empty-product.scss',
})
export class EmptyProduct {
  @Output() geminiPrompt = new EventEmitter<geminiPromptModel | null>
  prompt?: geminiPromptModel | null
  flag: boolean = false
  input?: string
  ctategoryId!: number
  geminiService: GeminiService = inject(GeminiService)
  @Input() set id(value: number) {
    this.ctategoryId = value
  }
  sentGemini() {
  
    if (this.input !== undefined)
    {
      if(this.prompt===undefined)
      {
     this.geminiService.addNewProduct(this.ctategoryId, this.input).subscribe({
        next: (data) => {
          if (data !== null && data !== undefined) {
            this.prompt = data.body
          }
          else {
            console.log("error accuard try again")
          }

        },
        error: (err) => {
          console.log("error accuard try again")
        }
      }
      )
      }
else{
       this.geminiService.updateProductPrompt(this.prompt!.promptId, this.input).subscribe({
        next: (data) => {
          if (data !== null && data !== undefined) {
           
            this.prompt!.prompt = data.body!.prompt
          }
          else {
            console.log("error accuard try again")
          }

        },
        error: (err) => {
          console.log("error accuard try again")
        }
      }
      )
}
    }
 
  }

  tryAgain(){
this.input=this.prompt?.prompt
  }

  sentFather(){
 this.geminiPrompt.emit(this.prompt)
  }
}
