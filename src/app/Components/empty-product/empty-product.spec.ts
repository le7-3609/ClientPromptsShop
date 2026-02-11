import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyProduct } from './empty-product';

describe('EmptyProduct', () => {
  let component: EmptyProduct;
  let fixture: ComponentFixture<EmptyProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
