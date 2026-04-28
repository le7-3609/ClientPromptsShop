import { Component, inject, AfterViewInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
import { UserService } from '../../services/userService/user-service';
import { environment } from '../../../environments/environment.development';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { RouterLink } from '@angular/router';

declare var google: any;
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule,
    InputTextModule, PasswordModule, CardModule,
    FloatLabel, TabsModule, ProgressBar, DividerModule, ToastModule,
    Message, CheckboxModule, RouterLink],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
  providers: [MessageService]
})
export class Auth implements AfterViewInit {
  userService = inject(UserService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  messageService = inject(MessageService);
  private ngZone = inject(NgZone);
  formSubmitted: boolean = false;
  private returnUrl: string = '/home';
  loginForm!: FormGroup;
  registerForm!: FormGroup;

  passwordStrengthValue: number = 0;
  strengthColor: string = '#C4B6FD';

  public googleClientId = environment.googleClientId;



  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      acceptTerms: new FormControl(false, [Validators.requiredTrue])
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
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `Welcome back ${user.firstName}!` ,life: 3000 });
          this.router.navigateByUrl(this.returnUrl); 
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid email or password' ,life: 3000 });
        }
      });
    }
  }

  onRegisterSubmit() {
    this.formSubmitted = true;
    if (this.registerForm.valid) {
      const registrationPayload = {
        ...this.registerForm.value,
        provider: "local"
      };
      this.userService.register(registrationPayload).subscribe({
        next: (newUser) => {
          if (newUser) {
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Registration Successful', 
              detail: `Welcome ${newUser.firstName}! Your account has been created successfully.`,
              life: 1500 
            });
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Registration Failed',
              detail: 'Registration did not complete. Please try again.',
              life: 5000
            });
          }
        },
        error: (err) => {
          console.error('Registration error:', err);
          let errorMessage = 'Registration failed. Please try again.';
          if (err?.status === 400) {
            errorMessage = 'Invalid registration data. Please check your information.';
          } else if (err?.status === 409 || err?.error?.message?.includes('email')) {
            errorMessage = 'This email is already registered. Please use a different email or try logging in.';
          } else if (err?.status === 500) {
            errorMessage = 'Server error occurred. Please try again later.';
          }
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Registration Failed', 
            detail: errorMessage,
            life: 5000 
          });
        }
      });
    }
  }

  ngAfterViewInit() {
    this.renderGoogleButtons();
  }

  renderGoogleButtons() {
    if (typeof google !== 'undefined' && google?.accounts) {
      google.accounts.id.initialize({
        client_id: this.googleClientId,
        callback: (response: any) => {
          this.ngZone.run(() => this.onGoogleCredential(response));
        },
        ux_mode: 'popup',
        use_fedcm_for_prompt: true
      });

      const loginBtn = document.getElementById('googleBtnLogin');
      if (loginBtn) {
        google.accounts.id.renderButton(loginBtn, { theme: 'outline', size: 'large', width: 280 });
      }
      const registerBtn = document.getElementById('googleBtnRegister');
      if (registerBtn) {
        google.accounts.id.renderButton(registerBtn, { theme: 'outline', size: 'large', width: 280 });
      }
    } else {
      setTimeout(() => this.renderGoogleButtons(), 100);
    }
  }

  onGoogleCredential(response: any) {
    this.userService.socialLogin({ token: response.credential, provider: 'Google' }).subscribe({
      next: (user) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Welcome!',
          detail: `Welcome ${user.firstName}!`,
          life: 3000
        });
        setTimeout(() => this.router.navigateByUrl(this.returnUrl), 1500);
      },
      error: (err: any) => {
        if (err?.status === 409) {
          const serverMsg = err?.error?.message || '';
          const detail = serverMsg.includes('provider') || serverMsg.includes('registered')
            ? 'This email is already registered with another provider. Please sign in using that provider.'
            : 'This email is already registered. Please sign in using the original provider.';
          this.messageService.add({
            severity: 'error',
            summary: 'Sign-In Conflict',
            detail,
            life: 5000
          });
          return;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Sign-In Failed',
          detail: 'Google sign-in failed. Please try again.',
          life: 4000
        });
      }
    });
  }

  signInWithMicrosoft(): void {
    console.log('Microsoft Sign In - not yet implemented');
  }
}
