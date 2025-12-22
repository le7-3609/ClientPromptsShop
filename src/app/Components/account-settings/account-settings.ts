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
  messageService = inject(MessageService);
  formSubmitted: boolean = false;
  settingsForm!: FormGroup;

  passwordStrengthValue: number = 0;
  strengthColor: string = '#C4B6FD';

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

  ngOnInit() {
    this.settingsForm = new FormGroup({
      email: new FormControl('', [Validators.email]),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      phone: new FormControl('', Validators.pattern('^[0-9]{10}$')),
      password: new FormControl('', [Validators.minLength(6)])
    });
  }
  isInvalid(controlName: string) {
        const control = this.settingsForm.get(controlName);
        return control?.invalid && (control.touched || this.formSubmitted);
  }
  onRegisterSubmit() {
    this.formSubmitted = true;
    if (this.settingsForm.valid) {
      console.log('Form Data:', this.settingsForm.value);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Form is submitted', life: 3000 });
      this.settingsForm.reset();
      this.formSubmitted = false;
      // כאן תשלחי את הנתונים ל-API שלך
    } else {
      console.log('Form is invalid');
    }
  }
}
