import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFormFooter } from './auth-form-footer';

describe('AuthFormFooter', () => {
  let component: AuthFormFooter;
  let fixture: ComponentFixture<AuthFormFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthFormFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthFormFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
