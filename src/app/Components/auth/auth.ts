import { Component, OnInit ,inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { TabsModule } from 'primeng/tabs';
import { ProgressBar } from 'primeng/progressbar';
import { DividerModule } from 'primeng/divider';
import { Message } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { SocialAuthService, GoogleLoginProvider, MicrosoftLoginProvider } from "@abacritt/angularx-social-login";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule,
    InputTextModule, PasswordModule, CardModule,
    FloatLabel, TabsModule, ProgressBar, DividerModule,
    Message],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
  providers: [MessageService]
})
export class AuthComponent implements OnInit {
  messageService = inject(MessageService);
  formSubmitted: boolean = false;
  loginForm!: FormGroup;
  registerForm!: FormGroup;

  passwordStrengthValue: number = 0;
  strengthColor: string = '#C4B6FD';
  
  //constructor(private authService: SocialAuthService) {}

  ngOnInit() {
    // אתחול טופס לוגין
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    // אתחול טופס רישום
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      phone: new FormControl('', Validators.pattern('^[0-9]{10}$')),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  checkPasswordStrength() {
    // כאן תבצעי בעתיד את הקריאה ל-DB. כרגע זה סימולציה של הערך המוחזר (0-4)
    const mockDbResult = 2; // נניח שהחזיר 2
    this.passwordStrengthValue = mockDbResult * 25;

    if (mockDbResult <= 1) {
      this.strengthColor = '#C64BF1'; 
    } else if (mockDbResult === 2 || mockDbResult === 3) {
      this.strengthColor = '#9D58F5'; 
    } else {
      this.strengthColor = '#8139EB'; 
    }
  }

  isInvalid(controlName: string) {
        const control = this.loginForm.get(controlName);
        return control?.invalid && (control.touched || this.formSubmitted);
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

  onRegisterSubmit() {
    this.formSubmitted = true;
    if (this.registerForm.valid) {
      console.log('Form Data:', this.registerForm.value);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
      this.registerForm.reset();
      this.formSubmitted = false;
      // כאן תשלחי את הנתונים ל-API שלך
    } else {
      console.log('Form is invalid');
    }
  }


  signInWithGoogle(): void {
    //this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(user => {
      console.log("Google User:");
    //});
  }

  signInWithMicrosoft(): void {
   // this.authService.signIn(MicrosoftLoginProvider.PROVIDER_ID).then(user => {
      console.log("Microsoft User:");
   // });
  }
}

  
