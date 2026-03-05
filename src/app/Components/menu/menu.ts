import { Component, inject, computed } from '@angular/core';
import { MegaMenuModule } from 'primeng/megamenu';
import { OnInit } from '@angular/core';
import { ConfirmationService, MegaMenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { MainCategoryModel } from '../../models/main-category-model';
import { MainCategoryService } from '../../services/mainCategoryService/main-category-service';
import { UserService } from '../../services/userService/user-service';
import { CartService } from '../../services/cartService/cart-service';
import { RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuItem } from 'primeng/api';
import { toSignal } from '@angular/core/rxjs-interop';
import { SelectModule } from 'primeng/select';
import { CurrencyOption, CurrencyService } from '../../services/currencyService/currency-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu',
  imports: [ConfirmDialogModule, ToastModule, MenubarModule, ButtonModule, CommonModule, AvatarModule, MegaMenuModule, MenuModule, RouterLink, BadgeModule, SelectModule, FormsModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})

export class Menu implements OnInit {
  items: MegaMenuItem[] = [
    { label: 'Home', root: true, routerLink: '/' },
    { label: 'BasicSite', root: true , routerLink: '/basicSite' },
    { label: 'Catalog', root: true, items: [[{ items: [] }]] },
    { label: 'Reviews', root: true, routerLink: '/all-reviews' },
    { label: 'Contact', root: true, routerLink: '/contact' }
  ]

  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  userService = inject(UserService);
  private mainCategoryService = inject(MainCategoryService);
  private cartService = inject(CartService);
  currencyService = inject(CurrencyService);

  private cartItems = toSignal(this.cartService.cartItems$, { initialValue: [] });
  private basicSite = toSignal(this.cartService.basicSite$, { initialValue: null });
  cartItemCount = computed(() => this.cartItems().length + (this.basicSite() ? 1 : 0));

  mainCategories: MainCategoryModel[] | null = [];
  currencies: CurrencyOption[] = [{ code: 'USD', name: 'United States Dollar' }];
  selectedCurrencyCode = 'USD';

  itemsForProfile = computed(() => {
    const user = this.userService.currentUser();
    console.log('Menu computed recalculating with user:', user);

    if (user) {
    const userItems: MenuItem[] = [
      { label: 'UserHeader' }, 
      { separator: true }, 
      { label: 'My Account', icon: 'pi pi-user', routerLink: '/settings' },
      { label: 'My Orders', icon: 'pi pi-box', routerLink: '/orders' },
    ];

    if (this.userService.isAdmin()) {
      userItems.push({ separator: true }); 
      userItems.push({ label: 'Admin Dashboard', icon: 'pi pi-cog', routerLink: '/admin' });
    }

    userItems.push({ separator: true }); 
    userItems.push({
      label: 'Logout', 
      icon: 'pi pi-sign-out', 
      command: (event: any) => this.logout(event.originalEvent)
    });

    return userItems; 
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
    this.currencyService.loadCurrencies();
    this.currencyService.currencies$.subscribe((currencies) => {
      this.currencies = currencies;
    });
    this.currencyService.selectedCurrency$.subscribe((currency) => {
      this.selectedCurrencyCode = currency.code;
    });

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
          { label: 'BasicSite', root: true, routerLink: '/basicSite' },

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

          { label: 'Reviews', root: true, routerLink: '/all-reviews' },

          { label: 'Contact', root: true, routerLink: '/contact' }
        ];
      },
      error: (error) => console.error('Error fetching categories:', error)
    });
  }

  onCurrencyChange(code: string) {
    if (!code) {
      return;
    }
    const selected = this.currencies.find((c) => c.code === code);
    if (selected) {
      this.currencyService.selectCurrency(selected);
    }
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