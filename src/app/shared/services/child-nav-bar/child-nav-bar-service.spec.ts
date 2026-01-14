import { TestBed } from '@angular/core/testing';

import { ChildNavBarService } from './child-nav-bar-service';

describe('ChildNavBarService', () => {
  let service: ChildNavBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChildNavBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
