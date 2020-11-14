import { TestBed } from '@angular/core/testing';

import { SimmService } from './simm.service';

describe('SimmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SimmService = TestBed.get(SimmService);
    expect(service).toBeTruthy();
  });
});
