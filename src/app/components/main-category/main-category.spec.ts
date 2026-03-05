import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCategory } from './main-category';

describe('MainCategory', () => {
  let component: MainCategory;
  let fixture: ComponentFixture<MainCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
