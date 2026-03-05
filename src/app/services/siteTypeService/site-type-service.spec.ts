import { TestBed } from '@angular/core/testing';

import { SiteTypeService } from './site-type-service';

describe('SiteTypeService', () => {
  let service: SiteTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiteTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
