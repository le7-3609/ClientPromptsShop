import { Component ,inject} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { Message } from 'primeng/message';
import { TabsModule } from 'primeng/tabs';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { ProgressBar } from "primeng/progressbar";
import { UserService } from '../../Services/user-service';

@Component({
  selector: 'app-account-settings',
imports: [
    CommonModule, ReactiveFormsModule, ButtonModule,
    InputTextModule, PasswordModule, CardModule,
    FloatLabel, TabsModule, DividerModule,
    Message,
    ProgressBar
],  templateUrl: './account-settings.html',
  styleUrl: './account-settings.scss',
  standalone: true,
  providers: [MessageService]
})
export class AccountSettings {
  userService = inject(UserService);
  messageService = inject(MessageService);
  formSubmitted: boolean = false;
  settingsForm!: FormGroup;

  passwordStrengthValue: number = 0;
  strengthColor: string = '#C4B6FD';

  checkPasswordStrength() {
    const pwd = this.settingsForm.get('password')?.value;
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

  ngOnInit() {
    const user = this.userService.currentUser();

    this.settingsForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      password: new FormControl('', [Validators.minLength(6)]) // סיסמה אינה חובה בעדכון אלא אם רוצים לשנות
    });

    if (user) {
      this.settingsForm.patchValue({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone
      });
    }
  }
  isInvalid(controlName: string) {
        const control = this.settingsForm.get(controlName);
        return control?.invalid && (control.touched || this.formSubmitted);
  }
  onRegisterSubmit() {
    this.formSubmitted = true;
    const user = this.userService.currentUser();

    if (this.settingsForm.valid && user) {
      console.log('Form Data:', this.settingsForm.value);
     this.userService.updateUser(user.userId, this.settingsForm.value).subscribe({
        next: (updatedUser) => {
          this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Profile updated successfully' });
          this.formSubmitted = false;
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Update failed' });
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
