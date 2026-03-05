import { Component, OnInit,OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext'; 
import { SubCategoryModel } from '../../models/sub-category-model';
import { SubCategoryService } from '../../services/subCategoryService/sub-category-service';
import { firstValueFrom, ObjectUnsubscribedError, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-main-category',
  standalone: true,
  providers: [SubCategoryService],
  imports: [CommonModule, FormsModule, DataViewModule, RouterModule, ButtonModule, SelectButtonModule, SelectModule, InputTextModule],
  templateUrl: './main-category.html',
  styleUrls: ['./main-category.scss']
})
export class MainCategory implements OnInit, OnDestroy{
  readonly PAGE_SIZE = 20; 

  mainCategoryName: string = 'Our Products';
  subCategories: SubCategoryModel[] = [];
  layout: 'list' | 'grid' = 'grid';
  totalCount: number = 0;
  
  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  
  sortField: string = '';
  sortOrder: number = 0;

  sortOptions = [
    { label: 'Price: Low to High', value: 'price' },
    { label: 'Price: High to Low', value: '!price' },
    { label: 'Product Name', value: 'name' }
  ];

  private subCategoryService = inject(SubCategoryService);
  private route = inject(ActivatedRoute);

  constructor() {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.loadInitialData();
    });
  }

  async ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.loadInitialData();
    });
  }

  private async loadInitialData() {
    const id = this.route.snapshot.paramMap.get('MainId');
    const ids = id ? [+id] : [];
    await this.loadFilteredSubCategories(ids, 0, this.PAGE_SIZE);
  }

  async onPageChange(event: any) {
    const id = this.route.snapshot.paramMap.get('MainId');
    const ids = id ? [+id] : [];
    await this.loadFilteredSubCategories(ids, event.first, event.rows);
    window.scrollTo(0, 0);
  }

  onSearchChange(term: string) {
    this.searchSubject.next(term);
  }

  async loadFilteredSubCategories(ids: number[], skip: number, rows: number) {
    try {
        // position = skip + rows (הגבול העליון)
        // skip = skip (ההתחלה)
        const response = await firstValueFrom(this.subCategoryService.getSubCategoriesFiltered(skip + rows, skip, ids, this.searchTerm));
        const responseData = response.body as any;
        
        if (responseData) {
            this.subCategories = (responseData.items || responseData.subCategories || []).map((item: any) => ({
                ...item,
                hasError: false 
            }));
            this.totalCount = responseData.totalCount || 0;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

  onSortChange(event: any) {
    const value = event.value;
    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

ngOnDestroy() {
    if (this.searchSubject) {
      this.searchSubject.complete();
    }
  }
}