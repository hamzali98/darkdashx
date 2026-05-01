import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthDesignStyleElements1 } from './auth-design-style-elements1';

describe('AuthDesignStyleElements1', () => {
  let component: AuthDesignStyleElements1;
  let fixture: ComponentFixture<AuthDesignStyleElements1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthDesignStyleElements1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthDesignStyleElements1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
