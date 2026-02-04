import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';
import { SubCategoryModel } from '../../Models/sub-category-model';
import { SubCategoryService } from '../../Services/subCategoryService/sub-category-service';

@Component({
  selector: 'app-main-category',
  standalone: true,
  imports: [CommonModule, FormsModule, DataViewModule, RouterModule, TagModule, ButtonModule, SelectButtonModule, SelectModule],
  templateUrl: './main-category.html',
  styleUrls: ['./main-category.scss']
})
export class MainCategory implements OnInit {
  mainCategoryName: string = 'Our Products';
  subCategories: SubCategoryModel[] = [];
  selectedSubCategory: SubCategoryModel | null = null;
  layout: 'list' | 'grid' = 'grid';
  sortField: string = '';
  sortOrder: number = 0;
  sortKey: string = '';
  router: Router = inject(Router);

  sortOptions = [
    { label: 'Price:Low to High', value: 'price' },
    { label: 'Price: High to Low', value: '!price' },
    { label: 'Product Name', value: 'name' }
  ];


  private subCategoryService = inject(SubCategoryService);
  private route = inject(ActivatedRoute);
  constructor() { }

  async ngOnInit() {
  this.route.paramMap.subscribe(async (params) => {
    console.log('--- Checking Params ---');
    
    const id = params.get('MainId'); 
    
    console.log('Extracted mainId:', id);

    if (id) {
      console.log('--- Sending filtered API call for ID:', id);
      await this.loadFilteredSubCategories(+id);
    } else {
      console.log('--- No ID found, loading all ---');
      await this.loadAllSubCategories();
    }
  });
}

  async loadFilteredSubCategories(id: number) {
    try {
      const response = await this.subCategoryService.getSubCategoriesFiltered(0, 50, '', [id]);


      this.subCategories = response.item1 || response.subCategories || response;

      console.log('Filtered subcategories loaded:', this.subCategories);
    } catch (error) {
      console.error('Error loading filtered categories:', error);
    }
  }

  async loadAllSubCategories() {
    try {
      this.subCategories = await this.subCategoryService.getSubCategories();
    } catch (error) {
      console.error('Error fetching all categories:', error);
    }
  }

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