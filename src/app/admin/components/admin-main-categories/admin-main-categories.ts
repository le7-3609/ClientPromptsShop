import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MainCategoryService } from '../../../services/mainCategoryService/main-category-service';
import { UserService } from '../../../services/userService/user-service';
import { MainCategoryModel } from '../../../models/main-category-model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-main-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './admin-main-categories.html',
  styleUrl: './admin-main-categories.scss',
})
export class AdminMainCategories implements OnInit {
  private mainCategoryService = inject(MainCategoryService);
  private userService = inject(UserService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  mainCategories: MainCategoryModel[] = [];
  selectedCategory: any = {};
  categoryDialog = false;
  submitted = false;
  loading = true;

  async ngOnInit() {
    await this.checkAdminAccess();
  }

  private async checkAdminAccess() {
    const user = this.userService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/auth']);
      return;
    }
    if (user.email?.toLowerCase() !== 'clicksite@gmail.com') {
      this.router.navigate(['/home']);
      return;
    }
    await this.loadData();
  }

  async loadData() {
    this.loading = true;
    try {
      const response = await firstValueFrom(this.mainCategoryService.getMainCategory());
      this.mainCategories = response.body || [];
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load categories' });
    } finally {
      this.loading = false;
    }
  }

  openNew() {
    this.selectedCategory = { mainCategoryName: '', promptTemplate: '' };
    this.submitted = false;
    this.categoryDialog = true;
  }

  async editCategory(category: MainCategoryModel) {
    this.submitted = false;
    try {
      const categoryId = Number(category.mainCategoryId);
      const response = await firstValueFrom(this.mainCategoryService.getMainCategoryById(categoryId));

      this.selectedCategory = {
        ...category,
        ...response,
        mainCategoryId: response?.mainCategoryId ?? category.mainCategoryId,
        mainCategoryName: response?.mainCategoryName ?? category.mainCategoryName,
        promptTemplate:
          response?.promptTemplate ?? response?.prompt ?? category.promptTemplate ?? ''
      };
    } catch (error) {
      this.selectedCategory = {
        ...category,
        promptTemplate: category.promptTemplate ?? ''
      };
      this.messageService.add({
        severity: 'warn',
        summary: 'Partial Data',
        detail: 'Could not load latest category details. Showing available data.'
      });
    }

    this.categoryDialog = true;
  }

  hideDialog() {
    this.categoryDialog = false;
    this.submitted = false;
  }

  saveCategory() {
    this.submitted = true;
    if (this.selectedCategory.mainCategoryName?.trim()) {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Save functionality to be implemented' });
      this.categoryDialog = false;
    }
  }

  deleteCategory(category: MainCategoryModel) {
    if (confirm(`Delete ${category.mainCategoryName}?`)) {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Delete functionality to be implemented' });
    }
  }
}
