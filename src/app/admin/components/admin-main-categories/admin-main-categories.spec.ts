import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMainCategories } from './admin-main-categories';

describe('AdminMainCategories', () => {
  let component: AdminMainCategories;
  let fixture: ComponentFixture<AdminMainCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMainCategories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMainCategories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
