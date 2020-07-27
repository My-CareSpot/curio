import { TestBed } from '@angular/core/testing';

import { ObserveableService } from './observeable.service';

describe('ObserveableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ObserveableService = TestBed.get(ObserveableService);
    expect(service).toBeTruthy();
  });
});
