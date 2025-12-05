import { TestBed } from '@angular/core/testing';

import { Httpservice } from './httpservice';

describe('Httpservice', () => {
  let service: Httpservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Httpservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
