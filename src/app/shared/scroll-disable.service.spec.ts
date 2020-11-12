import { TestBed } from '@angular/core/testing';

import { ScrollStateService } from './scroll-state.service';

describe('ScrollStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScrollStateService = TestBed.get(ScrollStateService);
    expect(service).toBeTruthy();
  });
});
