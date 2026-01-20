import { TestBed } from '@angular/core/testing';

import { MainCategoryService } from './main-category-service';

describe('MainCategoryService', () => {
  let service: MainCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
