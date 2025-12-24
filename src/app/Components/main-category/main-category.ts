import { Component, OnInit ,inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';
import { SubCategoryModel } from '../../Models/sub-category-model';
import { SubCategoryService } from '../../Services/sub-category-service';

@Component({
  selector: 'app-main-category',
  standalone: true,
  imports: [CommonModule,FormsModule,DataViewModule,TagModule,ButtonModule,SelectButtonModule,SelectModule],
  templateUrl: './main-category.html',
  styleUrls: ['./main-category.scss']
})
export class MainCategory implements OnInit {
  mainCategoryName: string = 'המוצרים שלנו'; 
  subCategories: SubCategoryModel[] = [];
  selectedSubCategory: SubCategoryModel | null = null;

  private subCategoryService = inject(SubCategoryService);

  // --- הגדרות DataView (מיון ועימוד) ---
  layout: 'list' | 'grid' = 'grid';
  sortField: string = '';
  sortOrder: number = 0;
  sortKey: string = '';
  
  sortOptions = [
    { label: 'מחיר: מהנמוך לגבוה', value: 'price' },
    { label: 'מחיר: מהגבוה לנמוך', value: '!price' },
    { label: 'שם מוצר', value: 'name' }
  ];

  constructor() {}

  async ngOnInit() {
    try {
      this.subCategories = await this.subCategoryService.getSubCategories();
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }
  
  // פונקציית מיון
  onSortChange(event: any) {
    const value = event.value;
    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

}