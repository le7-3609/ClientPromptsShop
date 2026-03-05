import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSiteTypes } from './admin-site-types';

describe('AdminSiteTypes', () => {
  let component: AdminSiteTypes;
  let fixture: ComponentFixture<AdminSiteTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSiteTypes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSiteTypes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
