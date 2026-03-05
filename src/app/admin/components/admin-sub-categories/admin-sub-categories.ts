import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { SubCategoryService } from '../../../services/subCategoryService/sub-category-service';
import { MainCategoryService } from '../../../services/mainCategoryService/main-category-service';
import { UserService } from '../../../services/userService/user-service';
import { SubCategoryModel } from '../../../models/sub-category-model';
import { MainCategoryModel } from '../../../models/main-category-model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-sub-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    ToastModule,
    TableModule
  ],
  providers: [MessageService],
  templateUrl: './admin-sub-categories.html',
  styleUrl: './admin-sub-categories.scss',
})
export class AdminSubCategories implements OnInit {
  private subCategoryService = inject(SubCategoryService);
  private mainCategoryService = inject(MainCategoryService);
  private userService = inject(UserService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  subCategories: SubCategoryModel[] = [];
  mainCategories: MainCategoryModel[] = [];
  selectedSubCategory: any = {};
  subCategoryDialog = false;
  submitted = false;
  loading = true;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  subCategorySearchTerm: string = '';

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
      const [subCatsResponse, mainCats] = await Promise.all([
        this.subCategoryService.getSubCategories(),
        firstValueFrom(this.mainCategoryService.getMainCategory())
      ]);
      console.log('Sub Categories Response:', subCatsResponse);
      console.log('Main Categories Response:', mainCats);
      this.subCategories = subCatsResponse.items;
      this.mainCategories = mainCats.body || [];
      console.log('Total Sub Categories:', subCatsResponse.totalCount);
    } catch (error) {
      console.error('Categories Error:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data' });
    } finally {
      this.loading = false;
    }
  }

  openNew() {
    this.selectedSubCategory = { subCategoryName: '', mainCategoryId: null, categoryDescription: '', imageUrl: '' };
    this.submitted = false;
    this.selectedFile = null;
    this.imagePreview = null;
    this.subCategoryDialog = true;
  }

  editSubCategory(subCategory: SubCategoryModel) {
    this.selectedSubCategory = { ...subCategory };
    this.selectedFile = null;
    this.imagePreview = subCategory.imageUrl || null;
    this.subCategoryDialog = true;
  }

  hideDialog() {
    this.subCategoryDialog = false;
    this.submitted = false;
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.selectedSubCategory.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.selectedSubCategory.imageUrl = '';
  }

  async saveSubCategory() {
    this.submitted = true;
    if (this.selectedSubCategory.subCategoryName?.trim() && this.selectedSubCategory.mainCategoryId) {
      try {
        // TODO: Upload image to server when backend is ready
        // if (this.selectedFile) {
        //   const formData = new FormData();
        //   formData.append('image', this.selectedFile);
        //   const uploadResponse = await this.subCategoryService.uploadImage(formData);
        //   this.selectedSubCategory.imageUrl = uploadResponse.imageUrl;
        // }

        // For now, use the preview as imageUrl (base64)
        if (this.selectedFile && this.imagePreview) {
          this.selectedSubCategory.imageUrl = this.imagePreview;
        }

        // Save sub-category
        // await this.subCategoryService.saveSubCategory(this.selectedSubCategory);
        
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Sub-category saved (API integration pending)' 
        });
        this.subCategoryDialog = false;
        await this.loadData();
      } catch (error) {
        console.error('Save error:', error);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Failed to save sub-category' 
        });
      }
    }
  }

  async deleteSubCategory(subCategory: SubCategoryModel) {
    if (confirm(`Delete ${subCategory.subCategoryName}?`)) {
      try {
        // TODO: Implement delete API call
        // await this.subCategoryService.deleteSubCategory(subCategory.subCategoryId);
        
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Success', 
          detail: 'Sub-category deleted (API integration pending)' 
        });
        await this.loadData();
      } catch (error) {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Error', 
          detail: 'Failed to delete sub-category' 
        });
      }
    }
  }

  getMainCategoryName(mainCategoryId: Number): string {
    const category = this.mainCategories.find(c => c.mainCategoryId === mainCategoryId);
    return category?.mainCategoryName || 'Unknown';
  }

  get filteredSubCategories(): SubCategoryModel[] {
    const term = this.subCategorySearchTerm.trim().toLowerCase();

    if (!term) {
      return this.subCategories;
    }

    return this.subCategories.filter(subCategory =>
      (subCategory.subCategoryName || '').toLowerCase().includes(term)
    );
  }
}
