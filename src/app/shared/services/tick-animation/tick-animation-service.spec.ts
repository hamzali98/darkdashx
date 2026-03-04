import { TestBed } from '@angular/core/testing';

import { TickAnimationService } from './tick-animation-service';

describe('TickAnimationService', () => {
  let service: TickAnimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TickAnimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
