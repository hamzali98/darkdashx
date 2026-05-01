import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthDesignStyleElements2 } from './auth-design-style-elements2';

describe('AuthDesignStyleElements2', () => {
  let component: AuthDesignStyleElements2;
  let fixture: ComponentFixture<AuthDesignStyleElements2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthDesignStyleElements2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthDesignStyleElements2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
