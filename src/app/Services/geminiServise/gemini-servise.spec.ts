import { TestBed } from '@angular/core/testing';

import { GeminiServise } from './gemini-servise';

describe('GeminiServise', () => {
  let service: GeminiServise;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeminiServise);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
