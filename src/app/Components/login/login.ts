import { Component,inject} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { Message } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [ButtonModule, FormsModule, InputTextModule, FloatLabel, PasswordModule, CardModule, ReactiveFormsModule, Message],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  providers: [MessageService],
  standalone: true, 
})
export class Login {
  messageService = inject(MessageService);
  formSubmitted: boolean = false;
  loginForm!: FormGroup;

  ngOnInit() {
    // אתחול טופס לוגין
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  onLoginSubmit() {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      console.log('Login Data:', this.loginForm.value);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
      this.loginForm.reset();
      this.formSubmitted = false;
      // כאן תשלחי את הנתונים ל-API שלך
    } else {
      console.log('Form is invalid');
    }
  }

  isInvalid(controlName: string) {
        const control = this.loginForm.get(controlName);
        return control?.invalid && (control.touched || this.onLoginSubmit);
  }
}

