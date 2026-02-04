import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicSite } from './basic-site';

describe('BasicSite', () => {
  let component: BasicSite;
  let fixture: ComponentFixture<BasicSite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicSite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicSite);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
