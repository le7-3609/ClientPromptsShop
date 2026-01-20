import { Component ,inject} from '@angular/core';
import { Router } from '@angular/router';
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
import { UserService } from '../../Services/user-service';

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
export class Auth{
  userService = inject(UserService);
  router = inject(Router);
  messageService = inject(MessageService);
  formSubmitted: boolean = false;
  loginForm!: FormGroup;
  registerForm!: FormGroup;

  passwordStrengthValue: number = 0;
  strengthColor: string = '#C4B6FD';
  

  ngOnInit() {
    const savedEmail = this.userService.getSavedEmail();
    this.loginForm = new FormGroup({
      email: new FormControl(savedEmail, [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

    checkPasswordStrength() {
    const pwd = this.registerForm.get('password')?.value;
    if (!pwd) return;

    this.userService.checkStrength(pwd).subscribe({
      next: (result) => {
        console.log('Result:', result);
        const score = result.strength;
        this.passwordStrengthValue = score * 25;
        this.updateStrengthColor(score);
      },
      error: (err) => {
        console.error('Error checking password strength:', err);
      }
    });
  }

  updateStrengthColor(score: number) {
    if (score <= 1) {
      this.strengthColor = '#C64BF1'; 
    } else if (score === 2 || score === 3) {
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
      this.userService.login(this.loginForm.value).subscribe({
        next: (user) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `Welcome back ${user.firstName}!` });
          this.router.navigate(['/home']); // ניתוב לדף הבית לאחר כניסה
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid email or password' });
        }
      });
    }
  }

  onRegisterSubmit() {
    this.formSubmitted = true;
    if (this.registerForm.valid) {
      this.userService.register(this.registerForm.value).subscribe({
        next: (newUser) => {
          this.messageService.add({ severity: 'success', summary: 'Registered', detail: 'Account created successfully!' });
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Registration failed. Email might be in use.' });
        }
      });
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

  
