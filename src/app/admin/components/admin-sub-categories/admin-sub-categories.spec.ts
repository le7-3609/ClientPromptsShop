import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSubCategories } from './admin-sub-categories';

describe('AdminSubCategories', () => {
  let component: AdminSubCategories;
  let fixture: ComponentFixture<AdminSubCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSubCategories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSubCategories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
