import { TestBed } from '@angular/core/testing';

import { CalendarsettingService } from './calendarsetting.service';

describe('CalendarsettingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalendarsettingService = TestBed.get(CalendarsettingService);
    expect(service).toBeTruthy();
  });
});
