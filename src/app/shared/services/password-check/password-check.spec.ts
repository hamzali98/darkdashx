import { TestBed } from '@angular/core/testing';

import { PasswordCheck } from './password-check';

describe('PasswordCheck', () => {
  let service: PasswordCheck;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordCheck);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
