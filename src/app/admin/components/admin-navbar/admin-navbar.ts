import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/userService/user-service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmDialogModule, ToastModule],
  templateUrl: './admin-navbar.html',
  styleUrls: ['./admin-navbar.scss']
})
export class AdminNavbar {
  public userService = inject(UserService);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  public mobileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  onLogout(event: Event) {
    this.confirmationService.confirm({
      key: 'logoutConfirm',
      target: event.target as EventTarget,
       message: 'Do you really want to logout?',
      header: 'Logout Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes, Logout',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-secondary',
      rejectButtonStyleClass: 'p-button-help',


      accept: () => {
        this.userService.logout();
        this.messageService.add({
          severity: 'success',
          summary:'You have been logged out',
          detail: 'See you later!',
          life: 3000
        });

        this.router.navigate(['/']);
      },
      reject: () => {
      }
    });
  }

}
