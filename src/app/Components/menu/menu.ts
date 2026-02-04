import { Component, inject, computed} from '@angular/core';
import { MegaMenuModule } from 'primeng/megamenu';
import { OnInit } from '@angular/core';
import { ConfirmationService, MegaMenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MainCategoryModel } from '../../Models/main-category-model';
import { MainCategoryService } from '../../Services/mainCategoryService/main-category-service';
import { UserService } from '../../Services/UserService/user-service';
import { RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-menu',
  imports: [ConfirmDialogModule, ToastModule, MenubarModule, ButtonModule, CommonModule, AvatarModule, MegaMenuModule, MenuModule, RouterLink],
  providers: [ConfirmationService, MessageService],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})

export class Menu implements OnInit {
  items: MegaMenuItem[] = [
    { label: 'Home', root: true, routerLink: '/' },
    { label: 'BasicSite', root: true },
    { label: 'Catalog', root: true, items: [[{ items: [] }]] },
    { label: 'Contact', root: true }
  ]

  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  userService = inject(UserService);
  private mainCategoryService = inject(MainCategoryService)

  mainCategories: MainCategoryModel[] | null = []
  itemsForProfile = computed(() => {
    const user = this.userService.currentUser(); 
    console.log('Menu computed recalculating with user:', user);

    if (user) {
      return [
        {
          label: user.firstName + ' ' + user.lastName+'\n'+ user.email,
          items: [
            { label: 'My Account', icon: 'pi pi-user', routerLink: '/settings' },
            { label: 'My Orders', icon: 'pi pi-box', routerLink: '/orders' },
            { 
              label: 'Logout', 
              icon: 'pi pi-sign-out', 
              styleClass: 'text-red-500', 
              command: (event: any) => this.logout(event.originalEvent)            }
          ]
        }
      ];
    } else {
      return [
        {
          label: 'Guest',
          items: [
            { label: 'Login', icon: 'pi pi-sign-in', routerLink: '/login' },
            { label: 'Register', icon: 'pi pi-user-plus', routerLink: '/register' }
          ]
        }
      ];
    }
  });

  ngOnInit() {
  this.mainCategoryService.getMainCategory().subscribe({
    next: (response) => {
      const categories = response.body ?? [];

      const categoryItems = categories.map(cat => ({
        label: cat.mainCategoryName,
        icon: 'pi pi-tag',
        routerLink: ['/main-category', cat.mainCategoryId]
      }));

      this.items = [
        { label: 'Home', root: true, routerLink: '/' },
        { label: 'BasicSite', root: true },

        {
          label: 'Catalog',
          root: true,
          items: [
            [
              {
                label: 'Categories',
                items: categoryItems
              }
            ]
          ]
        },

        { label: 'Contact', root: true }
      ];
    },
    error: (error) => console.error('Error fetching categories:', error)
  });
}


 logout(event: Event) {
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
            summary: 'You have been logged out successfully', 
            detail: 'Goodbye!', 
            life: 3000 
        });
      }
    });
  }
}