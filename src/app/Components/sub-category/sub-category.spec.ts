import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategory } from './sub-category';

describe('SubCategory', () => {
  let component: SubCategory;
  let fixture: ComponentFixture<SubCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
