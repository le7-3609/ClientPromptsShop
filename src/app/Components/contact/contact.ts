import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule, FormsModule, FloatLabelModule, InputTextModule, TextareaModule, ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  formData = {
    name: '',
    email: '',
    phone: '', 
    subject: '',
    message: ''
  };
  isSubmitting = false;

  constructor(private messageService: MessageService) { }

  async handleSubmit() {
  this.isSubmitting = true;

  try {
    const templateParams = {
      from_name: this.formData.name,
      from_email: this.formData.email,
      from_phone: this.formData.phone,
      subject: this.formData.subject,
      message: this.formData.message,
      to_email: '3609eli7@gmail.com' 
    };

    await emailjs.send(
      'gmail_service', 
      'template_5ypz4em', 
      templateParams, 
      'Jxe0Vhystdvy0tqUk'
    );

    this.messageService.add({ severity: 'success', summary: 'Sent!', detail: 'Your message has been sent successfully' , life: 3000 });
    this.formData = { name: '', email: '', phone: '', subject: '', message: '' };
  } catch (error) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong while sending the message' , life: 3000 });
  } finally {
    this.isSubmitting = false;
  }
}
}